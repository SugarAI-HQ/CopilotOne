import { useEffect, useState as useStateOriginal } from "react";
import {
  defaultGroupId,
  type CopilotConfigType,
  type EmbeddingScopeWithUserType,
  DEFAULT_GROUP_ID,
} from "../schema";
import { createOrUpdate } from "../embedding";
import { type SugarAiApiClient } from "../api-client";

export function createUseState(
  client: SugarAiApiClient,
  config: CopilotConfigType,
  clientUserId: string,
  // scope: EmbeddingScopeType,
) {
  let timerId: any = null;

  return function useStateCopilot(
    initialState: any,
    scope1: string,
    scope2: string,
    groupId: string = DEFAULT_GROUP_ID,
  ) {
    if (groupId === DEFAULT_GROUP_ID) {
      groupId = defaultGroupId();
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

          scope1, // pageId
          scope2, // ComponentId

          groupId,
        };
        // Avoid using async here, handle promise inside the function
        createOrUpdate({ config, client, scope, payload: state }).catch(
          (error) => {
            // Handle any errors from the createOrUpdate function
            PROD: console.error("Error in createOrUpdate:", error);
          },
        );
      }, 3000);

      return () => {
        clearTimeout(timerId);
      };
    }, [state]);

    // Return the state and setState function as usual
    return [state, setStateOverride];
  };
}
