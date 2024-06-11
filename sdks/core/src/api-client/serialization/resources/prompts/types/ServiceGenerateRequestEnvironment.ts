/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const ServiceGenerateRequestEnvironment: core.serialization.Schema<
  serializers.ServiceGenerateRequestEnvironment.Raw,
  SugarAiApi.ServiceGenerateRequestEnvironment
> = core.serialization.enum_(["DEV", "PREVIEW", "RELEASE"]);

export declare namespace ServiceGenerateRequestEnvironment {
  type Raw = "DEV" | "PREVIEW" | "RELEASE";
}