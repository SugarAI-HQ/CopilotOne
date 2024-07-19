import { ZodError } from "zod";

import {
  type ActionDefinitionType,
  type ActionRegistrationType,
  actionRegistrationSchema,
  type EmbeddingScopeWithUserType,
  DEFAULT_GROUP_ID,
  defaultGroupId,
  scopeDefaults,
  TextToActionResponse,
} from "./schema";
import { extractFunctionParams } from "./utils";
import { performanceTracker } from "./performance";
import { SugarAiApiClient, type SugarAiApi } from "./api-client";
import { type ServiceGenerateRequestSkillsItem } from "./api-client/api";

export function validate(
  name: string,
  registrationSchema: ActionRegistrationType,
  func: Function,
): string[] {
  const errors: string[] = [];

  // Validate the definition to be sure
  try {
    actionRegistrationSchema.parse(registrationSchema);
  } catch (error: any) {
    const msg: string = `[${name}] Invalid action schema: ${
      error instanceof ZodError ? JSON.stringify(error.errors) : error.message
    }`;
    console.error(msg);
    errors.push(msg);
    // return false;
  }

  const funcString = func.toString();

  DEV: console.log(`[${name}] func ${funcString}`);

  const functionParams = extractFunctionParams(name, funcString);
  const functionParamNames = functionParams.map((param) => param.trim());

  // Extract parameters from ActionDefinitionType
  const parameters = registrationSchema.parameters;

  // Check if all function parameters exist in ActionRegistration
  if (functionParamNames.length !== parameters.length) {
    DEV: console.log(JSON.stringify(functionParamNames));
    DEV: console.log(JSON.stringify(parameters));
    const msg = `[${name}] Parameter count mismatch, expected ${functionParamNames.length} got ${parameters.length}`;
    errors.push(msg);
    PROD: console.error(msg);
  } else {
    functionParamNames.forEach((paramName, index: number) => {
      // const paramName = functionParamNames[index];
      const param = parameters[index];

      if (param.name !== paramName) {
        console.warn(
          `[${name}] Mismatached parameter name expected ${param.name} got: ${paramName}`,
        );
      }
    });
  }

  return errors;
}

export const register = (
  name: string,
  actionDefinition: ActionRegistrationType,
  actionCallback: Function,
  actions: Array<Record<string, ActionDefinitionType>> = [],
  callbacks: Array<Record<string, Function>> = [],
) => {
  if (!actionDefinition) {
    throw new Error(`[${name}] Action config is required`);
  }

  if (actions[name]) {
    DEV: console.warn(`[${name}] Action already registered `);
  }

  const errors = validate(name, actionDefinition, actionCallback);
  if (errors.length > 0) {
    throw new Error(
      `[${name}] Invalid action definition: ${errors.join(", ")}`,
    );
  }

  //  Generate action JSON object
  // actions[func.name] = generateTool(func);
  actions[name] = transformActionRegistrationToDefinition(actionDefinition);
  callbacks[name] = actionCallback;

  PROD: console.log(
    `[${name}] Action Registered ${JSON.stringify(actions[name])}`,
  );
};
export const unregister = (
  name: string,
  actions: Array<Record<string, ActionDefinitionType>>,
  callbacks: Array<Record<string, Function>>,
) => {
  // Assuming actions is defined somewhere globally or in the scope
  DEV: console.log(`Unregistering Actions ${name}`);
  //  Generate action JSON object
  if (actions[name] ?? false) {
    delete actions[name];
  }
  if (callbacks[name] ?? false) {
    delete callbacks[name];
  }

  // console.log(JSON.stringify(Object.values(actions)));
};

export function transformActionRegistrationToDefinition(
  registration: ActionRegistrationType,
): ActionDefinitionType {
  const actionDefinition: ActionDefinitionType = {
    type: "function",
    function: {
      name: registration.name,
      description: registration.description,
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  };

  // Iterate through registration parameters and map them to definition parameters
  registration.parameters.forEach((param) => {
    const pp = {
      type: param.type,
      description: param.description,
      enum: param.enum,
    };

    if (!param.enum) {
      delete pp.enum;
    }
    actionDefinition.function.parameters.properties[param.name] = pp;

    // Check if the parameter is required and add it to the required array if so
    if (param.required) {
      actionDefinition.function.parameters.required.push(param.name);
    }
  });
  return actionDefinition;
}

// TEST: setTimeout(() => {
//   const registration: ActionRegistrationType = {
//     name: "exampleAction",
//     description: "This is an example action",
//     parameters: [
//       {
//         name: "param1",
//         type: "string",
//         enum: ["value1", "value2"],
//         description: "Description for param1",
//         required: true,
//       },
//       {
//         name: "param2",
//         type: "integer",
//         description: "Description for param2",
//         required: false,
//       },
//     ],
//     // required: ["param1"],
//   };

//   const definition: ActionDefinitionType =
//     transformActionRegistrationToDefinition(registration);

//   TEST: console.log(definition);
// }, 1000);

export const executeAction = async function executeAction(
  actions,
  actionCallbacks,
): Promise<any> {
  for (const index in actions) {
    // Access each action object
    const action = actions[index];
    const actionName = action.function.name;
    // Access properties of the action object
    const actionArgs = JSON.parse(action.function.arguments);

    // Call the corresponding callback function using apply
    // actionCallbacks[actionName].apply(null, actionArgs);
    // actionCallbacks[actionName].call(null, actionArgs);
    // actionCallbacks[actionName].apply(null, actionArgs);
    PROD: console.log(
      `[${actionName}] Calling action ----> ${actionName}(${action.function.arguments})`,
    );

    const actionoutput: any = actionCallbacks[actionName](
      ...Object.values(actionArgs),
    );
    return actionoutput;
  }
};

export async function textToAction(
  promptTemplate,
  userQuery: string | null,
  promptVariables,
  scope: EmbeddingScopeWithUserType,
  config,
  isAssitant: boolean = false,
  chatHistorySize: number = 4,
  actions: Array<Record<string, ActionDefinitionType>> = [],
  actionCallbacks: Array<Record<string, Function>> = [],
): Promise<TextToActionResponse> {
  const { reset, addMarker, getStats } = performanceTracker();
  reset();
  addMarker("start");
  const [username, pp, pt, pv] = promptTemplate.split("/");
  const msg: SugarAiApi.ServiceGenerateRequestChatMessage = {
    role: isAssitant ? "assistant" : "user",
    content: userQuery as string,
  };

  const apiClient = new SugarAiApiClient({
    environment: config?.server.endpoint,
    token: config?.server.token,
  });

  // const messages = [msg];
  console.log("actions", JSON.stringify(actions));
  console.log("actionCallbacks", JSON.stringify(actionCallbacks));

  const effectiveScope = { ...scopeDefaults, ...scope };

  if (effectiveScope.groupId === DEFAULT_GROUP_ID) {
    effectiveScope.groupId = defaultGroupId();
  }
  const result = (await apiClient.prompts.liteServiceGenerate(
    username,
    pp,
    pt,
    pv,
    {
      router: config.router,
      variables: promptVariables,
      scope: effectiveScope as SugarAiApi.ServiceGenerateRequestScope,
      // messages: messages as ServiceGenerateRequestMessagesItem[],
      chat: {
        id: config.clientUserId,
        message: msg,
        historyChat: chatHistorySize,
      },
      // messages: messages.slice(-3),
      // @ts-expect-error
      skills: Object.values(actions) as ServiceGenerateRequestSkillsItem[],
    },
  )) as SugarAiApi.LiteServiceGenerateResponse;
  // const c = await makeInference(
  //   promptTemplate,
  //   promptVariables,
  //   userQuery,
  //   uxActions,
  //   scope,
  //   dryRun,
  // );

  let output: string = config?.ai?.successResponse as string;
  let actionOutput: any = null;

  addMarker("got_llm_response");

  // @ts-expect-error
  if (result.llmResponse?.error) {
    output = config.ai?.failureResponse as string;
    addMarker("textToAction:failed");
  } else {
    // @ts-expect-error
    const choices: string | any[] = result.llmResponse?.data?.completion;

    if (choices instanceof Array) {
      if (choices[0].message?.tool_calls) {
        addMarker("executing_actions");
        actionOutput = await executeAction(
          choices[0].message.tool_calls,
          actionCallbacks,
        );
        addMarker("executed_actions");
      }

      if (choices[0].message?.content) {
        output = choices[0].message.content as string;
        addMarker("success");
      }
    } else if (typeof choices === "string") {
      output = choices;
      addMarker("textToAction:success");
    } else if (isAssitant) {
      DEV: console.debug(`No choices expected in case of manual mode nudge`);
    } else {
      PROD: console.error(`Unknown response ${JSON.stringify(choices)}`);
      output = config?.ai?.failureResponse as string;
      addMarker("textToAction:failed");
    }
  }
  addMarker("end");
  // observePerformance();
  PROD: console.log("Performance Stats", {
    // @ts-expect-error
    ...result.stats,
    ...{ clientStats: getStats() },
  });
  return { output, actionOutput };
}
