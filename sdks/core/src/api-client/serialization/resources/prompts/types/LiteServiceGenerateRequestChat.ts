/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const LiteServiceGenerateRequestChat: core.serialization.ObjectSchema<
  serializers.LiteServiceGenerateRequestChat.Raw,
  SugarAiApi.LiteServiceGenerateRequestChat
> = core.serialization.object({
  id: core.serialization.string().optional(),
  message: core.serialization
    .lazyObject(
      async () =>
        (await import("../../..")).LiteServiceGenerateRequestChatMessage,
    )
    .optional(),
  historyChat: core.serialization.number().optional(),
});

export declare namespace LiteServiceGenerateRequestChat {
  interface Raw {
    id?: string | null;
    message?: serializers.LiteServiceGenerateRequestChatMessage.Raw | null;
    historyChat?: number | null;
  }
}
