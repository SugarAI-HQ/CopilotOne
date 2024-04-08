import { PrismaClient } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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
      return await ctx.prisma.$transaction(async (prisma) => {
        return await clonePromptPackageWithTemplateAndVersion(
          prisma as PrismaClient,
          userId as string,
          input.promptPackagePath,
          input.copilotId,
        );
      });
    }),
});

async function clonePromptPackageWithTemplateAndVersion(
  prisma: PrismaClient,
  userId: string,
  promptPackagePath: string,
  copilotId: string,
) {
  const promptPath = promptPackagePath.split("/");
  const userName = promptPath[0] as string;
  const packageName = promptPath[1] as string;
  const templateName = promptPath[2] as string;
  const versionName = promptPath[3] as string;

  try {
    const pp = await prisma.promptPackage.findFirst({
      where: { name: packageName },
    });

    console.log(`promptPackage -------------- ${JSON.stringify(pp)}`);

    if (!packageName) {
      throw new Error("Prompt package not found.");
    }

    const pt = await prisma.promptTemplate.findFirst({
      where: {
        name: templateName,
        promptPackageId: pp?.id,
      },
    });

    console.log(`promptTemplate -------------- ${JSON.stringify(pt)}`);

    if (!templateName) {
      throw new Error("Prompt template not found.");
    }

    const pv = await prisma.promptVersion.findFirst({
      where: {
        promptTemplateId: pt?.id,
        promptPackageId: pp?.id,
        version: versionName,
      },
    });

    console.log(`promptVersion -------------- ${JSON.stringify(pv)}`);

    if (!versionName) {
      throw new Error("Prompt version not found.");
    }

    const clonePromptPackage = await prisma.promptPackage.create({
      data: {
        userId: userId,
        name: pp?.name as string,
        description: pp?.description as string,
        visibility: pp?.visibility,
        forkedId: pp?.id,
      },
    });

    const clonedTemplate = await prisma.promptTemplate.create({
      data: {
        userId: userId,
        promptPackageId: clonePromptPackage?.id as string,
        name: pt?.name as string,
        description: pt?.description as string,
        modelType: pt?.modelType,
        runMode: pt?.runMode,
      },
    });

    const clonedPromptVersion = await prisma.promptVersion.create({
      data: {
        userId: userId,
        version: pv?.version as string,
        template: pv?.template as string,
        promptData: pv?.promptData as any,
        llmProvider: pv?.llmProvider as string,
        llmModel: pv?.llmModel as string,
        llmModelType: pv?.llmModelType,
        llmConfig: pv?.llmConfig as any,
        variables: pv?.variables as any,
        promptPackageId: clonePromptPackage?.id as string,
        promptTemplateId: clonedTemplate?.id as string,
      },
    });

    const copilotPrompt = await prisma.copilotPrompt.create({
      data: {
        userId: userId,
        copilotId: copilotId,
        copilotKey: "DEFAULT_PROMPT",
        userName: userName,
        packageName: packageName,
        templateName: templateName,
        versionName: versionName,
      },
    });

    return copilotPrompt;
  } catch (error) {
    console.error("Error while cloning:", error);
    throw error;
  }
}
