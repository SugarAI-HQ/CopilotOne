import { ppid } from "process";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { v4 as uuidv4 } from "uuid";
import { InputJsonValueType } from "~/generated/prisma-client-zod.ts";
import {
  getPackagesInput,
  getPackageInput,
  createPackageInput,
  deletePackageInput,
  packageOutput,
  packageListOutput,
  updatePackageInput,
} from "~/validators/prompt_package";
import {
  getTemplatesInput,
  getTemplateInput,
  createTemplateInput,
  updateTemplateInput,
  deleteTemplateInput,
  templateOutput,
  templateListOutput,
  deployTemplateInput,
} from "~/validators/prompt_template";
import {
  getVersionsInput,
  getVersionInput,
  createVersionInput,
  updateVersionInput,
  deleteVersionInput,
  versionOutput,
  versionListOutput,
  PromptDataType,
  VersionOutput,
  VersionListOutput,
  PromptDataSchemaType,
  PromptDataSchema,
} from "~/validators/prompt_version";
import { JsonArray, JsonObject } from "@prisma/client/runtime/library";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";
import { Visibility } from "@mui/icons-material";
import { JSONArray } from "superjson/dist/types";

export const promptRouter = createTRPCRouter({
  getPackages: protectedProcedure
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
      let query = {
        userId: ctx.jwt?.id as string,
      };

      // console.log(`packages input -------------- ${JSON.stringify(query)}`);

      const packages = await ctx.prisma.promptPackage.findMany({
        where: query,
      });
      // console.log(`packages out -------------- ${JSON.stringify(packages)}`);
      return packages;
    }),

  getPackage: protectedProcedure
    .input(getPackageInput)
    .output(packageOutput)
    .query(async ({ ctx, input }) => {
      let query = {
        userId: ctx.jwt?.id as string,
        id: input.id,
      };

      const pkg = await ctx.prisma.promptPackage.findFirst({
        where: query,
      });
      // console.log(`package -------------- ${JSON.stringify(pkg)}`);
      // console.log(pkg);
      return pkg;
    }),

  createPackage: protectedProcedure
    .input(createPackageInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      try {
        const promptPackage = await ctx.prisma.promptPackage.create({
          data: {
            name: input.name,
            description: input.description,
            visibility: input.visibility,
            userId: userId,
          },
        });
        return promptPackage;
      } catch (error: any) {
        console.error(`Error in creating Package-----------------  ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  updatePackage: protectedProcedure
    .input(updatePackageInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      try {
        if (userId) {
          await ctx.prisma.promptPackage.update({
            where: {
              id: input.id,
              userId: userId,
            },
            data: {
              name: input.name,
              description: input.description,
              visibility: input.visibility,
            },
          });
        }
      } catch (error: any) {
        console.error(`Error in creating Package-----------------  ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  updateTemplate: protectedProcedure
    .input(updateTemplateInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      try {
        await ctx.prisma.promptTemplate.update({
          where: {
            id: input.id,
            userId: userId,
          },
          data: {
            description: input.description,
          },
        });
      } catch (error: any) {
        throw new Error(error as string);
      }
    }),

  createTemplate: protectedProcedure
    .input(createTemplateInput)
    .output(templateOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      // console.log(`template input -------------- ${JSON.stringify(input)}`);

      try {
        const pt = await ctx.prisma.promptTemplate.create({
          data: {
            userId: userId,
            promptPackageId: input.promptPackageId,
            name: input.name,
            description: input.description,
            modelType: input.modelType,
          },
          include: {
            previewVersion: true,
            releaseVersion: true,
          },
        });
        // console.log(`template output -------------- ${JSON.stringify(pt)}`);
        return pt;
      } catch (error: any) {
        console.error(`Error in creating template -------------- ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  getTemplates: protectedProcedure
    .input(getTemplatesInput)
    .output(templateListOutput)
    .query(async ({ ctx, input }) => {
      // console.log(`templates -------------- ${JSON.stringify(input)}`);
      const templates = await ctx.prisma.promptTemplate.findMany({
        where: {
          userId: ctx.jwt?.id as string,
          promptPackageId: input.promptPackageId,
        },
        include: {
          previewVersion: true,
          releaseVersion: true,
        },
      });
      // console.log(`templates -------------- ${JSON.stringify(templates)}`);
      return templates;
    }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

  // getTemplate

  getTemplate: protectedProcedure
    .input(getTemplateInput)
    .output(templateOutput)
    .query(async ({ ctx, input }) => {
      const query = {
        userId: ctx.jwt?.id as string,
        id: input.id,
      };
      const template = ctx.prisma.promptTemplate.findFirst({
        where: query,
      });

      // console.log(`templates -------------- ${JSON.stringify(template)}`);
      return template;
    }),

  createVersion: protectedProcedure
    .input(createVersionInput)
    .output(versionOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      // let pv = null;

      console.log(`create version -------------- ${JSON.stringify(input)}`);

      let modelType = input.moduleType === ModelTypeSchema.Enum.TEXT2TEXT;

      let template = modelType
        ? `Tell me a joke on topic "{@topic}"`
        : `A photo of an astronaut riding a horse on {@OBJECT}`;

      let promptData: PromptDataSchemaType = {
        v: 1,
        data: [
          {
            id: uuidv4(),
            role: "system",
            content: "you are a smart mathematician",
          },
          {
            id: uuidv4(),
            role: "user",
            content: `help me with {@OBJECT}`,
          },
        ],
      };
      const defaultTemplate = {
        template: template,
        promptData: promptData,
        llmModelType: input.moduleType,
        llmProvider: modelType ? "llama2" : "runwayml",
        llmModel: modelType ? "7b" : "stable-diffusion-v1-5",
        llmConfig: {},
        // forkedFromId: null
      };

      if (input.forkedFromId) {
        const forkedFrom = await ctx.prisma.promptVersion.findUnique({
          where: {
            id: input.forkedFromId,
          },
        });
        if (forkedFrom) {
          defaultTemplate.template = forkedFrom.template;
          defaultTemplate.promptData =
            forkedFrom.promptData as PromptDataSchemaType;
          defaultTemplate.llmProvider = forkedFrom.llmProvider;
          defaultTemplate.llmModel = forkedFrom.llmModel;
          defaultTemplate.llmConfig = forkedFrom.llmConfig as JsonObject;
        }
      }

      try {
        const pv = await ctx.prisma.promptVersion.create({
          data: {
            userId: userId,
            forkedFromId: input.forkedFromId,

            promptPackageId: input.promptPackageId,
            promptTemplateId: input.promptTemplateId,
            version: input.version,

            ...defaultTemplate,

            changelog: "",
          },
        });
        return pv;
      } catch (error: any) {
        console.log(`Error in creating version -------------- ${error}`);
        if (error.code === "P2002" && error.meta?.target.includes("version")) {
          const errorMessage = { error: { message: "Version already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  updateVersion: protectedProcedure
    .input(updateVersionInput)
    .output(versionOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
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
            // version: input.version,
            template: input.template,
            promptData: input.promptData as PromptDataSchemaType,
            llmProvider: input.llmProvider,
            llmModel: input.llmModel,
            llmConfig: input.llmConfig,
          },
        });
      }
      // console.log(`updated version -------------- ${JSON.stringify(pv)}`);

      return pv;
    }),

  deployTemplate: protectedProcedure
    .input(deployTemplateInput)
    // .output(versionOutput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;
      let pv = null;
      let pt = null;
      // console.log(`deploy template -------------- ${JSON.stringify(input)}`);

      let data = {
        changelog: input.changelog,
        publishedAt: new Date(),
      };

      let templateData: { [key: string]: any } = {};
      templateData[`${input.environment}VersionId`] = input.promptVersionId;

      // data[`${input.environment}Version`] = {
      //   connect: {
      //     id: input.promptVersionId
      //   }
      // }

      if (userId) {
        const transaction = await ctx.prisma.$transaction(async (prisma) => {
          pv = await prisma.promptVersion.update({
            where: {
              id: input.promptVersionId,
              // promptTemplateId: input.promptTemplateId,
              // userId: userId,
              // promptPackageId: input.promptPackageId,
            },
            data: data,
          });

          pt = await prisma.promptTemplate.update({
            where: {
              id: input.promptTemplateId,
              promptPackageId: input.promptPackageId,
              userId: userId,
            },
            data: templateData,
          });

          return { pv, pt };
        });
      }
      // console.log(
      //   `deployed version -------------- ${JSON.stringify(pv)} ${JSON.stringify(
      //     pt,
      //   )}`,
      // );
      return { pv, pt };
    }),

  getVersions: protectedProcedure
    .input(getVersionsInput)
    .output(versionListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`versions input -------------- ${JSON.stringify(input)}`);
      const versions = await ctx.prisma.promptVersion.findMany({
        where: {
          userId: ctx.jwt?.id as string,
          promptPackageId: input.promptPackageId,
          promptTemplateId: input.promptTemplateId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      // console.log(`versions output -------------- ${JSON.stringify(versions)}`);
      return versions;
    }),
});
