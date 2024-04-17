/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const ServiceGenerateRequestChatMessage: core.serialization.ObjectSchema<
  serializers.ServiceGenerateRequestChatMessage.Raw,
  SugarAiApi.ServiceGenerateRequestChatMessage
> = core.serialization.object({
  role: core.serialization.lazy(
    async () =>
      (await import("../../..")).ServiceGenerateRequestChatMessageRole,
  ),
  content: core.serialization.string(),
});

export declare namespace ServiceGenerateRequestChatMessage {
  interface Raw {
    role: serializers.ServiceGenerateRequestChatMessageRole.Raw;
    content: string;
  }
}
