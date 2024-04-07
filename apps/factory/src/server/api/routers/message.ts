import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { InputJsonValueType } from "~/generated/prisma-client-zod.ts";

import {
  createMessageInput,
  getChatHistoryInput,
  messaageOutput,
  messageListOutput,
  MessageOutput,
  MessageListOutput,
} from "~/validators/message";

export const messageRouter = createTRPCRouter({
  generateMessage: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/copilot/{copilotId}/chats/{chatId}/messages",
        tags: ["message"],
        summary: "Generate chat message",
      },
    })
    .input(createMessageInput)
    .output(messaageOutput)
    .mutation(async ({ ctx, input }) => {
      console.log(`message input -------------- ${JSON.stringify(input)}`);
      const query = {
        userId: ctx.jwt?.id as string,
        chatId: input?.chatId,
        logId: input?.logId,
        copilotId: input?.copilotId,
        content: input?.content,
        role: input?.role,
        metadata: input?.metadata as InputJsonValueType,
      };
      const message = await ctx.prisma.message.create({
        data: query,
      });

      console.log(`message response -------------- ${JSON.stringify(message)}`);

      return message as MessageOutput;
    }),

  getChatHistory: protectedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/copilot/{copilotId}/chats/{chatId}/messages",
        tags: ["chat_history"],
        summary: "Get chat messages",
      },
    })
    .input(getChatHistoryInput)
    .output(messageListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`messages input -------------- ${JSON.stringify(input)}`);
      const query = {
        chatId: input?.chatId,
        copilotId: input?.copilotId,
      };

      const messages = await ctx.prisma.message.findMany({
        where: query,
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      console.log(
        `messages response -------------- ${JSON.stringify(messages)}`,
      );

      return messages as MessageListOutput;
    }),
});
