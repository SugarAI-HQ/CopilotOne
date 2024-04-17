/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const CubeGetPromptResponseCreatedAtModelType: core.serialization.Schema<
  serializers.CubeGetPromptResponseCreatedAtModelType.Raw,
  SugarAiApi.CubeGetPromptResponseCreatedAtModelType
> = core.serialization.enum_([
  "TEXT2TEXT",
  "TEXT2IMAGE",
  "TEXT2CODE",
  "IMAGE2IMAGE",
]);

export declare namespace CubeGetPromptResponseCreatedAtModelType {
  type Raw = "TEXT2TEXT" | "TEXT2IMAGE" | "TEXT2CODE" | "IMAGE2IMAGE";
}
