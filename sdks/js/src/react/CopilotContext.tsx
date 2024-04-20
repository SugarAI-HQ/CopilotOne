import { createContext, useContext } from "react";
import {
  type ActionRegistrationType,
  type CopilotConfigType,
  type EmbeddingScopeType,
  type ActionDefinitionType,
  type EmbeddingScopeWithUserType,
  type CopilotSytleType,
  DEFAULT_GROUP_ID,
  copilotAiDefaults,
} from "../schema";
import { type SugarAiApi, SugarAiApiClient } from "../api-client";
import { createUseState } from "./hooks";
import { generateUserId } from "../utils";
import { type ServiceGenerateRequestSkillsItem } from "../api-client/api";
import { register, unregister } from "../actions";
import { any } from "zod";
import { addMarker, observePerformance, reset } from "../performance";

export const CopilotContext = createContext({
  config: null as CopilotConfigType | null,
  apiClient: null as any,
  clientUserId: null as null | string,
  useStateEmbedding: (
    initialState: any,
    scope1: string,
    scope2: string,
    groupId: string = DEFAULT_GROUP_ID,
  ) => [any, Function],
  registerAction: (
    name: string,
    actionDefinition: ActionRegistrationType,
    actioncallback: Function,
  ) => {},
  unregisterAction: (name: string) => {},
  textToAction: async (
    promptTemplate: string,
    userQuery: string,
    promptVariables: any,
    scope: EmbeddingScopeType,
  ) => Promise<string>,
  // ) => Promise<string>,
});

// const ActionsDispatchContext = createContext(null)

export const CopilotProvider = function ({
  config,
  children,
}: {
  config: CopilotConfigType;
  children: any;
}) {
  const uxActions: Array<Record<string, ActionDefinitionType>> = [];
  const uxActionCallbacks: Array<Record<string, Function>> = [];

  // 0. setup config
  config = {
    ...config,
    ai: {
      ...copilotAiDefaults,
      ...config.ai,
    },
  };

  PROD: console.log(`copilot config ${JSON.stringify(config)}`);

  // 1. Setup userId
  const clientUserId: string = generateUserId(config?.client?.userId ?? null);
  DEV: console.log(`clientUserId: ${clientUserId}`);

  // 2. Setup User Auth
  // 3. Setup API Client
  const apiClient = new SugarAiApiClient({
    environment: config?.server.endpoint,
    token: config?.server.token,
  });

  // 4. Setup scope
  // const scope: EmbeddingScopeType = {
  //   clientUserId,

  //   scope1: "page-list", // pageId
  //   scope2: "component-main", // ComponentId

  //   groupId: window.location.pathname,
  // };

  const useStateEmbedding = createUseState(apiClient, config, clientUserId);

  const registerAction = (
    name: string,
    actionDefinition: ActionRegistrationType,
    actionCallback: Function,
  ) => {
    register(
      name,
      actionDefinition,
      actionCallback,
      uxActions,
      uxActionCallbacks,
    );
  };

  const unregisterAction = (name: string) => {
    unregister(name, uxActions, uxActionCallbacks);
  };

  const executeAction = async function executeAction(actions) {
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

      // @ts-expect-error
      uxActionCallbacks[actionName](...Object.values(actionArgs));
    }
  };

  const style: CopilotSytleType = config.style;
  DEV: console.log(`default style: ${JSON.stringify(style)}`);

  async function textToAction(
    promptTemplate,
    userQuery,
    promptVariables,
    scope: EmbeddingScopeWithUserType,
  ): Promise<string> {
    reset();
    addMarker("textToAction:start");
    const [username, pp, pt, pv] = promptTemplate.split("/");
    const msg: SugarAiApi.ServiceGenerateRequestChatMessage = {
      role: "user",
      content: userQuery,
    };
    // const messages = [msg];
    const result = (await apiClient.prompts.serviceGenerate(
      username,
      pp,
      pt,
      pv,
      {
        variables: promptVariables,
        scope: scope as SugarAiApi.ServiceGenerateRequestScope,
        // messages: messages as ServiceGenerateRequestMessagesItem[],
        chat: {
          id: clientUserId,
          message: msg,
        },
        // messages: messages.slice(-3),
        // @ts-expect-error
        actions: Object.values(uxActions) as ServiceGenerateRequestSkillsItem[],
      },
    )) as SugarAiApi.ServiceGenerateResponse;
    // const c = await makeInference(
    //   promptTemplate,
    //   promptVariables,
    //   userQuery,
    //   uxActions,
    //   scope,
    //   dryRun,
    // );

    let output: string = config?.ai?.successResponse as string;

    addMarker("textToAction:gotLLMResponse");

    // @ts-expect-error
    if (result.llmResponse?.error) {
      output = config.ai?.failureResponse as string;
      addMarker("textToAction:failed");
    } else {
      // @ts-expect-error
      const choices: string | any[] = result.llmResponse?.data?.completion;

      if (choices instanceof Array) {
        if (choices[0].message?.tool_calls) {
          addMarker("textToAction:executingActions");
          await executeAction(choices[0].message.tool_calls);
          addMarker("textToAction:executedActions");
        }

        if (choices[0].message?.content) {
          output = choices[0].message.content as string;
          addMarker("textToAction:success");
        }
      } else if (typeof choices === "string") {
        output = choices;
        addMarker("textToAction:success");
      } else {
        PROD: console.error(`Unknown response ${JSON.stringify(choices)}`);
        output = config?.ai?.failureResponse as string;
        addMarker("textToAction:failed");
      }
    }

    observePerformance();
    return output;
  }

  return (
    <CopilotContext.Provider
      value={{
        config,
        apiClient,
        clientUserId,
        useStateEmbedding,
        registerAction,
        unregisterAction,
        // @ts-expect-error
        textToAction,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export function useCopilot() {
  return useContext(CopilotContext);
}
