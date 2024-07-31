import { useEffect, useState as useStateOriginal } from "react";
import { type SugarAiApiClient } from "~/api-client";
import {
  type CopilotConfigType,
  type EmbeddingScopeType,
  type EmbeddingScopeWithUserType,
  DEFAULT_GROUP_ID,
  defaultGroupId,
  scopeDefaults,
} from "~/schema/copilot";

import { createOrUpdateEmbedding } from "~/base/embedding";

export function createUseStateEmbedding(
  client: SugarAiApiClient,
  config: CopilotConfigType,
  clientUserId: string,
  // scope: EmbeddingScopeType,
) {
  let timerId: any = null;

  return function useStateEmbeddingHook(
    initialState: any,
    scope: EmbeddingScopeType,
  ) {
    const effectiveScope = { ...scopeDefaults, ...scope };

    if (effectiveScope.groupId === DEFAULT_GROUP_ID) {
      effectiveScope.groupId = defaultGroupId();
    }

    // Call the original useState hook
    const [state, setState] = useStateOriginal(initialState);

    function setStateOverride(value: any) {
      setState(value);
    }

    useEffect(() => {
      clearTimeout(timerId);

      // Set a new timer to execute createEmbedding after 2 seconds
      timerId = setTimeout(() => {
        const scope: EmbeddingScopeWithUserType = {
          clientUserId,
          ...effectiveScope,
        };
        // Avoid using async here, handle promise inside the function
        createOrUpdateEmbedding({
          config,
          client,
          scope,
          payload: state,
        }).catch((error) => {
          // Handle any errors from the createOrUpdateEmbedding function
          PROD: console.error("Error in createOrUpdateEmbedding:", error);
        });
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }, [state]);

    // Return the state and setState function as usual
    return [state, setStateOverride];
  };
}
