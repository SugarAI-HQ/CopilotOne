import { PromptTemplate } from "@prisma/client";
import { ppid } from "process";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getPackagesInput,
  getPackageInput,
  createPackageInput,
  deletePackageInput,
  packageOutput,
  packageListOutput,
} from "~/validators/prompt_package";
import {
  getTemplatesInput,
  getTemplateInput,
  createTemplateInput,
  updateTemplateInput,
  deleteTemplateInput,
  templateOutput,
  templateListOutput,
} from "~/validators/prompt_template";
import {
  getVersionsInput,
  getVersionInput,
  createVersionInput,
  updateVersionInput,
  deleteVersionInput,
  versionOutput,
  versionListOutput,
} from "~/validators/prompt_version";

export const promptRouter = createTRPCRouter({
  getPackages: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/packages",
        tags: ["packages"],
        summary: "Read all packages",
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
      return packages;
    }),

  getPackage: publicProcedure
    .input(getPackageInput)
    .output(packageOutput)
    .query(async ({ ctx, input }) => {
      const pkg = await ctx.prisma.promptPackage.findFirst({
        where: {
          userId: ctx.session?.user.id,
          id: input.id,
        },
      });
      console.log(`package -------------- ${JSON.stringify(pkg)}`);
      return pkg;
    }),

  createPackage: publicProcedure
    .input(createPackageInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      let promptPackage = null;

      if (userId) {
        promptPackage = await ctx.prisma.promptPackage.create({
          data: {
            name: input.name,
            description: input.description,
            userId: userId,
          },
        });
      }
      return promptPackage;
    }),

  createTemplate: publicProcedure
    .input(createTemplateInput)
    .output(templateOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      let pt = null;

      console.log(`create template -------------- ${JSON.stringify(input)}`);

      if (userId) {
        pt = await ctx.prisma.promptTemplate.create({
          data: {
            userId: userId,
            promptPackageId: input.promptPackageId,
            name: input.name,
            description: input.description,
          },
        });
      }

      return pt;
    }),

  // updateTemplate: publicProcedure
  // .input(updateTemplateInput)
  // .output(TemplateOutput)
  // .mutation(async ({ ctx, input }) => {

  //   const userId = ctx.session?.user.id
  //   console.log(`update template -------------- ${JSON.stringify(input)}`);

  //   if (userId) {
  //     pt = await ctx.prisma.promptPackage.update({
  //       data: {
  //         promptPackageId: input.promptPackageId,
  //         name: input.name,
  //         description: input.description,
  //       }});
  //   }

  //     return pt;
  // }),

  getTemplates: publicProcedure
    .input(getTemplatesInput)
    .output(templateListOutput)
    .query(async ({ ctx, input }) => {
      // console.log(`templates -------------- ${JSON.stringify(input)}`);
      const templates = await ctx.prisma.promptTemplate.findMany({
        where: {
          userId: ctx.session?.user.id,
          promptPackageId: input.promptPackageId,
        },
      });
      console.log(`templates -------------- ${JSON.stringify(templates)}`);
      return templates;
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

  createVersion: publicProcedure
    .input(createVersionInput)
    .output(versionOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      let pv = null;

      console.log(`create version -------------- ${JSON.stringify(input)}`);

      const template = `
You a bot name {#BOT_NAME} trained by {#PROVIDER}
You act as {@ROLE}, {@DESCRIPTION}
`;

      if (userId) {
        pv = await ctx.prisma.promptVersion.create({
          data: {
            userId: userId,
            promptPackageId: input.promptPackageId,
            promptTemplateId: input.promptTemplateId,
            version: input.version,
            template: template,
            changelog: "TTD",
            llmProvider: "openai",
            llmModel: "gpt-3.5-turbo",
            llmConfig: {},
          },
        });
      }

      return pv;
    }),

  updateVersion: publicProcedure
    .input(updateVersionInput)
    .output(versionOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      let pv = null;
      console.log(`update version -------------- ${JSON.stringify(input)}`);

      if (userId) {
        pv = await ctx.prisma.promptVersion.update({
          where: {
            id: input.id,
            userId: userId,
            promptPackageId: input.promptPackageId,
            promptTemplateId: input.promptTemplateId,
          },
          data: {
            version: input.version,
            template: input.template,
            // changelog: input.changelog,
            llmProvider: input.llmProvider,
            llmModel: input.llmModel,
            llmConfig: input.llmConfig,
          },
        });
      }
      console.log(`updated version -------------- ${JSON.stringify(pv)}`);

      return pv;
    }),

  getVersions: publicProcedure
    .input(getVersionsInput)
    .output(versionListOutput)
    .query(async ({ ctx, input }) => {
      // console.log(`versions -------------- ${JSON.stringify(input)}`);
      const versions = await ctx.prisma.promptVersion.findMany({
        where: {
          userId: ctx.session?.user.id,
          promptPackageId: input.promptPackageId,
          promptTemplateId: input.promptTemplateId,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      console.log(`versions -------------- ${JSON.stringify(versions)}`);
      return versions;
    }),
});
