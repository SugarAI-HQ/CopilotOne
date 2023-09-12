import { describe } from "node:test";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getPackagesInput, getPackageInput, createPackageInput, deletePackageInput, packageOutput, packageListOutput} from "~/validators/prompt_package";
import { getTemplatesInput, getTemplateInput, createTemplateInput, deleteTemplateInput, TemplateOutput, TemplateListOutput} from "~/validators/prompt_template";


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
  .input(getPackagesInput)
  .output(packageListOutput)
  .query(async ({ ctx, input }) => {
    const packages = await ctx.prisma.promptPackage.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });
    // console.log(`packages -------------- ${JSON.stringify(packages)}`);
    return packages
  }),

  getPackage: publicProcedure
  .input(getPackageInput)
  .output(packageOutput)
  .query(async ({ ctx, input }) => {
    const pkg = await ctx.prisma.promptPackage.findFirst({
      where: {
        userId: ctx.session?.user.id,
        id: input.id
      },
    });
    console.log(`package -------------- ${JSON.stringify(pkg)}`);
    return pkg;
  }),

  createPackage: publicProcedure
  .input(createPackageInput)
  .mutation(async ({ ctx, input }) => {
    
    const promptPackage = await ctx.prisma.promptPackage.create({
      data: input
    });
    return promptPackage;
  }),

  createTemplate: publicProcedure
  .input(createPackageInput)
  .mutation(async ({ ctx, input }) => {
    // const validatedInput = PromptPackageCreateInput.parse(input);
    const promptPackage = await ctx.prisma.promptPackage.create({data: input});
    return promptPackage;
  }),

  getTemplates: publicProcedure
    .input(getTemplatesInput)
    .output(TemplateListOutput)
    .query(async ({ ctx, input }) => {
      const templates = await ctx.prisma.promptTemplate.findMany({
        where: {
          userId: ctx.session?.user.id,
          promptPackageId: input.promptPackageId
        },
      });
      console.log(`templates -------------- ${JSON.stringify(templates)}`);
      return templates;
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

});

