/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const MessageGenerateMessageResponse: core.serialization.Schema<
  serializers.MessageGenerateMessageResponse.Raw,
  SugarAiApi.MessageGenerateMessageResponse
> = core.serialization.undiscriminatedUnion([
  core.serialization.lazyObject(
    async () => (await import("../../..")).MessageGenerateMessageResponseChatId,
  ),
  core.serialization.stringLiteral("null"),
]);

export declare namespace MessageGenerateMessageResponse {
  type Raw = serializers.MessageGenerateMessageResponseChatId.Raw | "null";
}