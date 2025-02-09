/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const EmbeddingLookupResponseItem: core.serialization.ObjectSchema<
  serializers.EmbeddingLookupResponseItem.Raw,
  SugarAiApi.EmbeddingLookupResponseItem
> = core.serialization.object({
  id: core.serialization.string(),
  copilotId: core.serialization.string(),
  identifier: core.serialization.string(),
  chunk: core.serialization.string(),
  doc: core.serialization.string(),
  similarity: core.serialization.number(),
});

export declare namespace EmbeddingLookupResponseItem {
  interface Raw {
    id: string;
    copilotId: string;
    identifier: string;
    chunk: string;
    doc: string;
    similarity: number;
  }
}
