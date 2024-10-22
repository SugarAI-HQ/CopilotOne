/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const LiteServiceGenerateRequestSkillsItemFunction: core.serialization.ObjectSchema<
  serializers.LiteServiceGenerateRequestSkillsItemFunction.Raw,
  SugarAiApi.LiteServiceGenerateRequestSkillsItemFunction
> = core.serialization.object({
  name: core.serialization.string(),
  description: core.serialization.string(),
  parameters: core.serialization.lazyObject(
    async () =>
      (await import("../../.."))
        .LiteServiceGenerateRequestSkillsItemFunctionParameters,
  ),
});

export declare namespace LiteServiceGenerateRequestSkillsItemFunction {
  interface Raw {
    name: string;
    description: string;
    parameters: serializers.LiteServiceGenerateRequestSkillsItemFunctionParameters.Raw;
  }
}
