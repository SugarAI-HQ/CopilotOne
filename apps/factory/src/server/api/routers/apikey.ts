import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createKeyInput,
  getKeyInput,
  getKeysInput,
  keyOutput,
  keyListOutput,
  updateKeyInput,
  getCopilotKeyInput,
} from "~/validators/api_key";

export const apiKeyRouter = createTRPCRouter({
  createKey: protectedProcedure
    .input(createKeyInput)
    .output(keyOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      console.log(`create keys -------------- ${JSON.stringify(input)}`);

      const key = await ctx.prisma.apiKey.create({
        data: {
          ...input,
          userId: userId,
        },
      });
      return key;
    }),

  getKey: protectedProcedure
    .input(getKeyInput)
    .output(keyOutput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const query = {
        userId: userId,
        id: input.id,
      };

      const key = await ctx.prisma.apiKey.findFirst({
        where: query,
      });

      return key;
    }),

  getCopilotKey: protectedProcedure
    .input(getCopilotKeyInput)
    .output(keyOutput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const query = {
        userId: userId,
        copilotId: input.copilotId,
      };

      const key = await ctx.prisma.apiKey.findFirst({
        where: query,
      });

      return key;
    }),

  getKeys: protectedProcedure
    .input(getKeysInput)
    .output(keyListOutput)
    .query(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      const keys = await ctx.prisma.apiKey.findMany({
        where: {
          userId: userId,
        },
      });
      return keys;
    }),

  updateKey: protectedProcedure
    .input(updateKeyInput)
    .output(keyOutput)
    .mutation(async ({ ctx, input }) => {
      const data = {
        name: input.name,
      };
      const key = await ctx.prisma.apiKey.update({
        where: {
          id: input.id,
        },
        data: data,
      });

      return key;
    }),

  // deleteKey: protectedProcedure
  //   .input(getKeyInput)
  //   .output(keyOutput)
  //   .mutation(async ({ ctx, input }) => {
  //     const userId = ctx.jwt?.id as string;

  //     const query = {
  //       userId: userId,
  //       id: input.id,
  //     };

  //     const key = await ctx.prisma.apiKey.delete({
  //       where: query,
  //     });

  //     return key;
  //   }),
});
