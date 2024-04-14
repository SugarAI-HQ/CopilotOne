/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as SugarAiApi from "../../../..";

/**
 * @example
 *     {
 *         scope: {
 *             clientUserId: "clientUserId"
 *         }
 *     }
 */
export interface EmbeddingCreateOrUpdateRequest {
  scope: SugarAiApi.EmbeddingCreateOrUpdateRequestScope;
  payload?: unknown;
  strategy?: string;
}