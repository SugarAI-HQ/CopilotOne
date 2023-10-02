import {
  createTRPCRouter,
  promptMiddleware,
  publicProcedure,
} from "~/server/api/trpc";
import {
  generateInput,
  generateOutput,
  getPromptInput,
  getPromptOutput,
} from "~/validators/service";
import { run } from "~/services/openai";
import { JsonObject } from "@prisma/client/runtime/library";
import { generateLLmConfig, generatePrompt } from "~/utils/template";
import { promptEnvironment } from "~/validators/base";
import { LlmConfigSchema } from "~/validators/prompt_version";

export const serviceRouter = createTRPCRouter({
  getPrompt: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/{username}/{package}/{template}/{version}",
        tags: ["prompts"],
        summary: "Get Prompt Template",
      },
    })
    .input(getPromptInput)
    // .use(promptMiddleware)
    .output(getPromptOutput)
    .query(async ({ ctx, input }) => {
      console.info(`Prompt get ----------------- ${JSON.stringify(input)}`);

      const [pv, pt] = await getPv(ctx, input);

      if (pv) {
        console.info(`Prompt generating output ${JSON.stringify(pv)}`);
        return {
          template: pv.template,
          version: pv.version,
          createdAt: pv.createdAt,
          updatedAt: pv.updatedAt,
        };
      }

      return null;
    }),

  generate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/{username}/{package}/{template}/{version}/generate",
        tags: ["prompts"],
        summary: "Generate prompt completion",
      },
    })
    .input(generateInput)
    .use(promptMiddleware)
    .output(generateOutput)
    .mutation(async ({ ctx, input }) => {
      // const userId = input.userId;
      let [pv, pt] = await getPv(ctx, input);

      console.log(`promptVersion >>>> ${JSON.stringify(pv)}`);
      if (pv) {
        console.log(`data >>>> ${JSON.stringify(input)}`);
        const prompt = generatePrompt(pv.template, input.data);
        console.log(`prompt >>>> ${prompt}`);
        // Todo: Load a provider on the fly
        const llmConfig = generateLLmConfig(pv.llmConfig);
        const output = await run(prompt, pv.llmModel, llmConfig);

        console.log(`output -------------- ${JSON.stringify(output)}`);
        // const pl = await createPromptLog(ctx, pv, prompt, output);

        const pl = await ctx.prisma.promptLog.create({
          data: {
            userId: input.userId as string,
            promptPackageId: pv.promptPackageId,
            promptTemplateId: pv.promptTemplateId,
            promptVersionId: pv.id,

            environment: input.environment,

            version: pv.version,
            prompt: prompt,
            completion: output?.completion as string,

            llmProvider: pv.llmProvider,
            llmModel: pv.llmModel,
            llmConfig: llmConfig,

            latency: output?.performance?.latency as number,
            prompt_tokens: output?.performance?.prompt_tokens as number,
            completion_tokens:
              (output?.performance?.completion_tokens as number) || 0,
            total_tokens: output?.performance?.total_tokens as number,
            extras: {},
          },
        });

        return pl;
      }

      return null;
    }),
});

async function getPv(ctx: any, input: any) {
  const userId = input.userId || ctx.session?.user.id;
  let pt = null;
  let pv = null;

  if (input.version && input.version !== "latest") {
    console.info(`loading version ${input.version} for ${input.environment}`);
    pv = await ctx.prisma.promptVersion.findFirst({
      where: {
        userId: userId,
        promptPackageId: input.promptPackageId,
        promptTemplateId: input.promptTemplateId,
        version: input.version,
      },
    });
  } else {
    const ptd = {
      userId: userId,
      promptPackageId: input.promptPackageId,
      id: input.promptTemplateId,
    };

    console.info(
      `finding the ${input.environment} version ${JSON.stringify(ptd)}`,
    );
    pt = await ctx.prisma.promptTemplate.findFirst({
      where: ptd,
      include: {
        previewVersion: true,
        releaseVersion: true,
      },
    });
    pv =
      input.environment == promptEnvironment.Enum.RELEASE
        ? pt?.releaseVersion
        : pt?.previewVersion;
  }

  if (!pv) {
    console.error(`promptVersion >>>> not found - ${JSON.stringify(input)}`);
  } else {
    console.error(`promptVersion >>>>  ${JSON.stringify(pv)}`);
  }

  return [pv, pt];
}
