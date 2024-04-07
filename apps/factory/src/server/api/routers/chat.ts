import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createChatInput, chatOutput, ChatOutput } from "~/validators/chat";

export const chatRouter = createTRPCRouter({
  generateChat: protectedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/copilot/{copilotId}/chats",
        tags: ["chat"],
        summary: "Generate chat",
      },
    })
    .input(createChatInput)
    .output(chatOutput)
    .mutation(async ({ ctx, input }) => {
      const query = {
        userId: ctx.jwt?.id as string,
        copilotId: input?.copilotId,
      };
      const chat = await ctx.prisma.chat.create({
        data: query,
      });

      console.log(`chat response -------------- ${JSON.stringify(chat)}`);

      return chat as ChatOutput;
    }),
});
