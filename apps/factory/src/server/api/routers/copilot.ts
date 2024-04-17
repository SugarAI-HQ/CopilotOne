import { PrismaClient } from "@prisma/client";
import {
  ModelTypeType,
  PromptPackage,
  PromptTemplate,
  PromptVersion,
} from "~/generated/prisma-client-zod.ts";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { promptEnvironment } from "~/validators/base";
import {
  CopilotOutput,
  copilotListOutput,
  copilotOutput,
  createCopilotInput,
  getCopilotsInput,
  CopilotListOutput,
  updateCopilotInput,
  getCopilotInput,
  copilotCloneInput,
  getCopilotPromptInput,
  copilotPromptOutput,
  CopilotPromptOutput,
  copilotPromptListOutput,
  CopilotPromptListOutput,
} from "~/validators/copilot";

export const copilotRouter = createTRPCRouter({
  createCopilot: protectedProcedure
    .input(createCopilotInput)
    .output(copilotOutput)
    .mutation(async ({ ctx, input }) => {
      console.log(
        `create copilot input -------------- ${JSON.stringify(input)}`,
      );

      const userId = ctx.jwt?.id as string;
      try {
        const copilot = await ctx.prisma.copilot.create({
          data: {
            ...input,
            userId: userId,
            settings: input.settings || {},
          },
        });
        return copilot as CopilotOutput;
      } catch (error: any) {
        if (error.code === "P2002" && error.meta?.target.includes("name")) {
          const errorMessage = { error: { name: "Name already exist" } };
          throw new Error(JSON.stringify(errorMessage));
        }
        throw new Error("Something went wrong");
      }
    }),

  getCopilots: protectedProcedure
    .input(getCopilotsInput)
    .output(copilotListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`copilot input -------------- ${JSON.stringify(input)}`);

      const copilots = await ctx.prisma.copilot.findMany({
        where: {
          userId: ctx.jwt?.id as string,
        },
      });

      return copilots as CopilotListOutput;
    }),

  getCopilot: protectedProcedure
    .input(getCopilotInput)
    .output(copilotOutput)
    .query(async ({ ctx, input }) => {
      console.log(`copilot input -------------- ${JSON.stringify(input)}`);

      const copilot = await ctx.prisma.copilot.findFirst({
        where: {
          id: input.id,
        },
      });

      return copilot as CopilotOutput;
    }),

  updateCopilot: protectedProcedure
    .input(updateCopilotInput)
    .output(copilotOutput)
    .mutation(async ({ ctx, input }) => {
      console.log(
        `update copilot input -------------- ${JSON.stringify(input)}`,
      );
      const userId = ctx.jwt?.id as string;
      const copilot = await ctx.prisma.copilot.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
          settings: input.settings || {},
        },
      });

      return copilot as CopilotOutput;
    }),

  clonePackage: protectedProcedure
    .input(copilotCloneInput)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id as string;

      console.log(
        `create copilot input -------------- ${JSON.stringify(input)}`,
      );

      const clonePromptPackage = async (promptPackage: string) => {
        try {
          const { pp, pt, pv } = await fetchPromptEntities(
            ctx.prisma,
            userId,
            promptPackage,
          );
          return await ctx.prisma.$transaction(async (prisma) => {
            return await clonePromptPackageWithTemplateAndVersion(
              prisma as PrismaClient,
              userId,
              pp as PromptPackage,
              pt as PromptTemplate,
              pv as PromptVersion,
              input?.copilotId,
            );
          });
        } catch (error) {
          console.error("Error while cloning:", error);
          throw new Error("Failed to clone prompt package.");
        }
      };

      try {
        const promptPackages = input?.autoGenerate
          ? input.promptPackagePath.split(", ")
          : [input.promptPackagePath];
        console.log(promptPackages);
        await Promise.all(promptPackages.map(clonePromptPackage));
      } catch (error) {
        console.error("Error while cloning prompt packages:", error);
        throw new Error("Failed to clone prompt package.");
      }
    }),

  getCopilotPrompt: protectedProcedure
    .input(getCopilotPromptInput)
    .output(copilotPromptOutput)
    .query(async ({ ctx, input }) => {
      const copilotPrompt = await ctx.prisma.copilotPrompt.findFirst({
        where: {
          copilotId: input.copilotId,
          copilotKey: "DEFAULT_PROMPT",
        },
      });

      return copilotPrompt as CopilotPromptOutput;
    }),

  getCopilotPrompts: protectedProcedure
    .input(getCopilotPromptInput)
    .output(copilotPromptListOutput)
    .query(async ({ ctx, input }) => {
      const copilotPrompt = await ctx.prisma.copilotPrompt.findMany({
        where: {
          copilotId: input.copilotId,
        },
        include: {
          promptPackage: true,
        },
      });
      return copilotPrompt;
    }),
});

async function clonePromptPackageWithTemplateAndVersion(
  prisma: PrismaClient,
  userId: string,
  pp: PromptPackage,
  pt: PromptTemplate,
  pv: PromptVersion,
  copilotId: string,
) {
  if (!pp) {
    throw new Error("Prompt package not found.");
  }
  if (!pt) {
    throw new Error("Prompt template not found.");
  }
  if (!pv) {
    throw new Error("Prompt version not found.");
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    const clonePromptPackage = await prisma.promptPackage.create({
      data: {
        userId: userId,
        name: pp?.name,
        description: pp?.description,
        visibility: pp?.visibility,
        forkedId: pp?.id,
      },
    });

    const clonedTemplate = await prisma.promptTemplate.create({
      data: {
        userId: userId,
        promptPackageId: clonePromptPackage?.id,
        name: pt?.name,
        description: pt?.description,
        modelType: pt?.modelType,
        runMode: pt?.runMode,
      },
    });

    const clonedPromptVersion = await prisma.promptVersion.create({
      data: {
        userId: userId,
        version: pv.version,
        template: pv.template,
        promptData: pv.promptData,
        llmProvider: pv.llmProvider,
        llmModel: pv.llmModel,
        llmModelType: pv.llmModelType,
        llmConfig: pv.llmConfig,
        variables: pv.variables,
        promptPackageId: clonePromptPackage.id,
        promptTemplateId: clonedTemplate.id,
      },
    });

    const copilotPrompt = await prisma.copilotPrompt.create({
      data: {
        userId: userId,
        copilotId: copilotId,
        copilotKey: "DEFAULT_PROMPT",
        userName: user?.username as string,
        packageName: clonePromptPackage.name,
        packageId: clonePromptPackage.id,
        templateName: clonedTemplate.name,
        versionName: clonedPromptVersion.version,
      },
    });

    return copilotPrompt;
  } catch (error) {
    console.error("Error while cloning:", error);
    throw error;
  }
}

async function fetchPromptEntities(
  prisma: PrismaClient,
  userId: string,
  promptPackagePath: string,
) {
  const promptPath = promptPackagePath.split("/");
  const packageName = promptPath[1] as string;
  const templateName = promptPath[2] as string;
  const versionName = promptPath[3] as string;
  let pt: any = null;
  let pv: any = null;

  const pp = await prisma.promptPackage.findFirst({
    where: { name: packageName },
  });

  if (versionName in promptEnvironment.Values) {
    pt = await prisma.promptTemplate.findFirst({
      where: {
        name: templateName,
        promptPackageId: pp?.id,
      },
      include: {
        previewVersion: true,
        releaseVersion: true,
      },
    });
    pv =
      versionName == promptEnvironment.Enum.RELEASE
        ? pt?.releaseVersion
        : pt?.previewVersion;
  } else {
    pv = await prisma.promptVersion.findFirst({
      where: {
        promptTemplateId: pt?.id as string,
        promptPackageId: pp?.id,
        version: versionName,
      },
      include: {
        promptTemplate: true,
      },
    });
    pt = pv.promptTemplate;
  }

  return { pp, pt, pv };
}
