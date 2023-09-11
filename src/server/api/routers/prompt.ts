import { describe } from "node:test";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getPackagesSchema, createPackageSchema, deletePackageSchema} from "~/validators/prompt";


export const promptRouter = createTRPCRouter({

  getPackages: publicProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/packages',
      tags: ['packages'],
      summary: 'Read all packages',
    },
  })
  .input(getPackagesSchema)
  .output(
    z.object({
      packages: z.array(
        z.object({
          id: z.string(),
          // userId: z.string(),
          name: z.string(),
          description: z.string(),
        }),
      ),
    }),
  )
  .query(async ({ ctx, input }) => {
    // console.log(`got the reques -------------- ${JSON.stringify(input)}`);
    const packages = await ctx.prisma.promptPackage.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });

    console.log(`packages -------------- ${JSON.stringify(packages)}`);

    return {packages: packages}
    
  }),

  getById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.promptPackage.findFirst({
      where: {
        userId: ctx.session?.user.id,
        id: input.id
      },
    });
    
  }),

  createPackage: publicProcedure
  .input(createPackageSchema)
  .mutation(async ({ ctx, input }) => {
    
    const promptPackage = await ctx.prisma.promptPackage.create({
      data: input
    });
    return promptPackage;
  }),

  createTemplate: publicProcedure
  .input(createPackageSchema)
  .mutation(async ({ ctx, input }) => {
    // const validatedInput = PromptPackageCreateInput.parse(input);
    const promptPackage = await ctx.prisma.promptPackage.create({data: input});
    return promptPackage;
  }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

});

