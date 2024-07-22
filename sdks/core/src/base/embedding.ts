import { type SugarAiApiClient } from "../api-client";
import {
  type CopilotConfigType,
  type EmbeddingScopeWithUserType,
} from "../schema/copilot";
import { isObjectEmpty } from "../helpers/utils";

export const createOrUpdateEmbedding = async ({
  config,
  client,
  scope,
  payload,
}: {
  config: CopilotConfigType;
  client: SugarAiApiClient;
  scope: EmbeddingScopeWithUserType;
  payload: any;
}) => {
  // 1. is payload valid
  if (isObjectEmpty(payload)) {
    return false;
  }

  // 2. Create embedding
  client.embedding
    .createorupdate(config.copilotId, {
      scope,
      payload,
      strategy: "auto",
    })
    .then((result) => {
      DEV: console.log(result);
    })
    .catch((error) => {
      PROD: console.error("Error:", error);
    });
};
