import { createContext, useContext } from "react";
import {
  type SkillRegistrationType,
  type CopilotConfigType,
  type EmbeddingScopeType,
  type SkillDefinitionType,
  type EmbeddingScopeWithUserType,
  type CopilotSytleType,
} from "../schema";
import { type SugarAiApi, SugarAiApiClient } from "../api-client";
import { createUseState } from "./hooks";
import { generateUserId } from "../utils";
import {
  type ServiceGenerateRequestMessagesItem,
  type ServiceGenerateRequestSkillsItem,
  type ServiceGenerateResponseCompletion,
} from "../api-client/api";
import { register, unregister } from "../skill";
import { any } from "zod";
import { addMarker, observePerformance, reset } from "../performance";

export const CopilotContext = createContext({
  config: null as CopilotConfigType | null,
  apiClient: null as any,
  clientUserId: null as null | string,
  useStateCopilot: (
    initialState: any,
    scope1: string,
    scope2: string,
    groupId: string = window.location.pathname,
  ) => [any, Function],
  registerSkill: (
    name: string,
    skillDefinition: SkillRegistrationType,
    skillcallback: Function,
  ) => {},
  unregisterSkill: (name: string) => {},
  textToSkill: async (
    promptTemplate: string,
    userQuery: string,
    promptVariables: any,
    scope: EmbeddingScopeType,
  ) => Promise<string>,
  // ) => Promise<string>,
});

// const SkillsDispatchContext = createContext(null)

export const CopilotProvider = function ({
  config,
  children,
}: {
  config: CopilotConfigType;
  children: any;
}) {
  const uxSkills: Array<Record<string, SkillDefinitionType>> = [];
  const uxSkillCallbacks: Array<Record<string, Function>> = [];

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

  const useStateCopilot = createUseState(apiClient, config, clientUserId);

  const registerSkill = (
    name: string,
    skillDefinition: SkillRegistrationType,
    skillCallback: Function,
  ) => {
    register(name, skillDefinition, skillCallback, uxSkills, uxSkillCallbacks);
  };

  const unregisterSkill = (name: string) => {
    unregister(name, uxSkills, uxSkillCallbacks);
  };

  const executeSkill = async function executeSkill(skills) {
    for (const index in skills) {
      // Access each skill object
      const skill = skills[index];
      const skillName = skill.function.name;

      // Access properties of the skill object
      const skillArgs = JSON.parse(skill.function.arguments);

      // Call the corresponding callback function using apply
      // skillCallbacks[skillName].apply(null, skillArgs);
      // skillCallbacks[skillName].call(null, skillArgs);
      // skillCallbacks[skillName].apply(null, skillArgs);
      PROD: console.log(
        `[${skillName}] Calling skill ----> ${skillName}(${skill.function.arguments})`,
      );

      // @ts-expect-error
      uxSkillCallbacks[skillName](...Object.values(skillArgs));
    }
  };

  const style: CopilotSytleType = config.style;
  DEV: console.log(`default style: ${JSON.stringify(style)}`);

  async function textToSkill(
    promptTemplate,
    userQuery,
    promptVariables,
    scope: EmbeddingScopeWithUserType,
  ): Promise<string> {
    reset();
    addMarker("textToSkill:start");
    const [username, pp, pt, pv] = promptTemplate.split("/");
    const messages = [{ role: "user", content: userQuery }];
    const result = (await apiClient.prompts.serviceGenerate(
      username,
      pp,
      pt,
      pv,
      {
        variables: promptVariables,
        scope: scope as SugarAiApi.ServiceGenerateRequestScope,
        messages: messages as ServiceGenerateRequestMessagesItem[],
        // messages: messages.slice(-3),
        // @ts-expect-error
        skills: Object.values(uxSkills) as ServiceGenerateRequestSkillsItem[],
      },
    )) as ServiceGenerateResponseCompletion;
    // const c = await makeInference(
    //   promptTemplate,
    //   promptVariables,
    //   userQuery,
    //   uxSkills,
    //   scope,
    //   dryRun,
    // );

    let output: string = config?.ai?.successResponse as string;

    addMarker("textToSkill:gotLLMResponse");

    // @ts-expect-error
    if (result.llmResponse?.error) {
      output = config.ai?.failureResponse as string;
      addMarker("textToSkill:failed");
    } else {
      // @ts-expect-error
      const choices: string | any[] = result.llmResponse?.data?.completion;

      if (choices instanceof Array) {
        if (choices[0].message?.tool_calls) {
          addMarker("textToSkill:executingSkills");
          await executeSkill(choices[0].message.tool_calls);
          addMarker("textToSkill:executedSkills");
        }

        if (choices[0].message?.content) {
          output = choices[0].message.content as string;
          addMarker("textToSkill:success");
        }
      } else if (typeof choices === "string") {
        output = choices;
        addMarker("textToSkill:success");
      } else {
        PROD: console.error(`Unknown response ${JSON.stringify(choices)}`);
        output = config?.ai?.failureResponse as string;
        addMarker("textToSkill:failed");
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
        useStateCopilot,
        registerSkill,
        unregisterSkill,
        // @ts-expect-error
        textToSkill,
      }}
    >
      {children}
    </CopilotContext.Provider>
  );
};

export function useCopilot() {
  return useContext(CopilotContext);
}
