/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const PromptGetPackagesResponseItemCreatedAtTemplatesItemReleaseVersion: core.serialization.Schema<
  serializers.PromptGetPackagesResponseItemCreatedAtTemplatesItemReleaseVersion.Raw,
  SugarAiApi.PromptGetPackagesResponseItemCreatedAtTemplatesItemReleaseVersion
> = core.serialization.undiscriminatedUnion([
  core.serialization.lazy(
    async () =>
      (await import("../../.."))
        .PromptGetPackagesResponseItemCreatedAtTemplatesItemReleaseVersionZero,
  ),
  core.serialization.record(
    core.serialization.string(),
    core.serialization.unknown(),
  ),
]);

export declare namespace PromptGetPackagesResponseItemCreatedAtTemplatesItemReleaseVersion {
  type Raw =
    | serializers.PromptGetPackagesResponseItemCreatedAtTemplatesItemReleaseVersionZero.Raw
    | Record<string, unknown>;
}
