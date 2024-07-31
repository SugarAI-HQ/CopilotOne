import { createContext, useContext } from "react";
import { createUseStateEmbedding } from "./useStateEmbedding";

import { any } from "zod";
import {
  type ActionDefinitionType,
  type ActionRegistrationType,
  type CopilotConfigType,
  type CopilotSytleType,
  type EmbeddingScopeType,
  type EmbeddingScopeWithUserType,
  copilotAiDefaults,
  copilotRouterDefaults,
  TextToActionResponse,
  generateUserId,
  SugarAiApiClient,
  register,
  unregister,
  textToAction as nativeTextoAction,
} from "@sugar-ai/core";

export const CopilotContext = createContext({
  config: null as CopilotConfigType | null,
  apiClient: null as any,
  clientUserId: null as null | string,

  useStateEmbedding: (initialState: any, scope: EmbeddingScopeType) => [
    any,
    Function,
  ],

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
    isAssitant: boolean = false,
    chatHistorySize: number = 4,
    actions: Record<string, ActionDefinitionType> = {},
    actionCallbacks: Record<string, Function> = {},
  ) => Promise<TextToActionResponse>,
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
    router: {
      ...copilotRouterDefaults,
      ...config.router,
    },
    ai: {
      ...copilotAiDefaults,
      ...config.ai,
    },
  };

  PROD: console.log(`copilot config ${JSON.stringify(config)}`);

  // 1. Setup userId
  const clientUserId: string = generateUserId(config?.client?.userId ?? null);
  DEV: console.log(`clientUserId: ${clientUserId}`);
  config.clientUserId = clientUserId;

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

  const useStateEmbedding = createUseStateEmbedding(
    apiClient,
    config,
    clientUserId,
  );

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

  const style: CopilotSytleType = config.style;
  DEV: console.log(`default style: ${JSON.stringify(style)}`);

  async function textToAction(
    promptTemplate,
    userQuery,
    promptVariables,
    scope: EmbeddingScopeType,
    isAssitant: boolean = false,
    chatHistorySize: number = 4,
    actions: Record<string, ActionDefinitionType> = {},
    actionCallbacks: Record<string, Function> = {},
  ): Promise<TextToActionResponse> {
    return await nativeTextoAction(
      promptTemplate,
      userQuery,
      promptVariables,
      scope,
      config,
      isAssitant,
      chatHistorySize,
      { ...uxActions, ...actions },
      { ...uxActionCallbacks, ...actionCallbacks },
      // uxActions.concat(actions),
      // uxActionCallbacks.concat(actionCallbacks),
    );
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
