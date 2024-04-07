import { z } from "zod";

export const createChatInput = z
  .object({
    copilotId: z.string(),
    messageCount: z.number().default(0),
  })
  .strict();

export const getChatInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();

export const chatSchema = createChatInput
  .extend({
    id: z.string(),
    userId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();

export type CreateChatInput = z.infer<typeof createChatInput>;
export type GetChatInput = z.infer<typeof getChatInput>;
export type ChatSchema = z.infer<typeof chatSchema>;
export const chatOutput = chatSchema.or(z.null());
export type ChatOutput = z.infer<typeof chatOutput>;
export const chatListOutput = z.array(chatSchema);
export type ChatListOutput = z.infer<typeof chatListOutput>;
