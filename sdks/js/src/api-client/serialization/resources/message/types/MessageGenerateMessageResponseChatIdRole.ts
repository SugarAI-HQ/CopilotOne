/**
 * This file was auto-generated by Fern from our API Definition.
 */

import * as serializers from "../../..";
import * as SugarAiApi from "../../../../api";
import * as core from "../../../../core";

export const MessageGenerateMessageResponseChatIdRole: core.serialization.Schema<
  serializers.MessageGenerateMessageResponseChatIdRole.Raw,
  SugarAiApi.MessageGenerateMessageResponseChatIdRole
> = core.serialization.enum_(["user", "assistant", "system"]);

export declare namespace MessageGenerateMessageResponseChatIdRole {
  type Raw = "user" | "assistant" | "system";
}