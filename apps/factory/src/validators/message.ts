import { z } from "zod";
import { InputJsonValue } from "~/generated/prisma-client-zod.ts";
import { PromptRole } from "./base";

export const createMessageInput = z
  .object({
    copilotId: z.string(),
    logId: z.string().optional(),
    content: z.string(),
    role: z.nativeEnum(PromptRole),
    chatId: z.string(),
    metadata: InputJsonValue.nullable(),
  })
  .strict();

// TODO: fix roles validation
export const messageSchema = createMessageInput
  .extend({
    id: z.string(),
    userId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();

export const getChatHistoryInput = z
  .object({
    chatId: z.string(),
    copilotId: z.string(),
  })
  .required();

export const getMessageInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();

export type CreateMessageInput = z.infer<typeof createMessageInput>;
export type GetMessageInput = z.infer<typeof getMessageInput>;
export type MessageSchema = z.infer<typeof messageSchema>;
export const messaageOutput = messageSchema.or(z.null());
export type MessageOutput = z.infer<typeof messaageOutput>;
export const messageListOutput = z.array(messageSchema);
export type MessageListOutput = z.infer<typeof messageListOutput>;
