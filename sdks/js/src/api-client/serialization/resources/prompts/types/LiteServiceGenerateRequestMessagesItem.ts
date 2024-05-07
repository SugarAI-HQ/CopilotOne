/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const LiteServiceGenerateRequestMessagesItem: core.serialization.ObjectSchema<
  serializers.LiteServiceGenerateRequestMessagesItem.Raw,
  SugarAiApi.LiteServiceGenerateRequestMessagesItem
> = core.serialization.object({
  role: core.serialization.lazy(
    async () =>
      (await import("../../..")).LiteServiceGenerateRequestMessagesItemRole,
  ),
  content: core.serialization.string(),
});

export declare namespace LiteServiceGenerateRequestMessagesItem {
  interface Raw {
    role: serializers.LiteServiceGenerateRequestMessagesItemRole.Raw;
    content: string;
  }
}
