/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const ServiceGenerateRequestChat: core.serialization.ObjectSchema<
  serializers.ServiceGenerateRequestChat.Raw,
  SugarAiApi.ServiceGenerateRequestChat
> = core.serialization.object({
  id: core.serialization.string().optional(),
  message: core.serialization
    .lazyObject(
      async () => (await import("../../..")).ServiceGenerateRequestChatMessage,
    )
    .optional(),
  historyChat: core.serialization.number().optional(),
});

export declare namespace ServiceGenerateRequestChat {
  interface Raw {
    id?: string | null;
    message?: serializers.ServiceGenerateRequestChatMessage.Raw | null;
    historyChat?: number | null;
  }
}
