/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const CubeGetPromptRequestEnvironment: core.serialization.Schema<
  serializers.CubeGetPromptRequestEnvironment.Raw,
  SugarAiApi.CubeGetPromptRequestEnvironment
> = core.serialization.enum_(["DEV", "PREVIEW", "RELEASE"]);

export declare namespace CubeGetPromptRequestEnvironment {
  type Raw = "DEV" | "PREVIEW" | "RELEASE";
}
