/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const ServiceGenerateRequestSkillsItemFunction: core.serialization.ObjectSchema<
  serializers.ServiceGenerateRequestSkillsItemFunction.Raw,
  SugarAiApi.ServiceGenerateRequestSkillsItemFunction
> = core.serialization.object({
  name: core.serialization.string(),
  description: core.serialization.string(),
  parameters: core.serialization.lazyObject(
    async () =>
      (await import("../../.."))
        .ServiceGenerateRequestSkillsItemFunctionParameters,
  ),
});

export declare namespace ServiceGenerateRequestSkillsItemFunction {
  interface Raw {
    name: string;
    description: string;
    parameters: serializers.ServiceGenerateRequestSkillsItemFunctionParameters.Raw;
  }
}