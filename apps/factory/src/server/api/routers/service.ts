import {
  createTRPCRouter,
  promptMiddleware,
  publicProcedure,
} from "~/server/api/trpc";
import { generateInput, generateOutput } from "~/validators/service";
import { generateLLmConfig, generatePrompt } from "~/utils/template";
import { promptEnvironment } from "~/validators/base";
import { LlmProvider } from "~/services/llm_providers";
import { providerModels } from "~/validators/base";
import {
  ModelTypeType,
  ModelTypeSchema,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";
import { env } from "~/env.mjs";
import { llmResponseSchema, LlmErrorResponse } from "~/validators/llm_respose";

export const serviceRouter = createTRPCRouter({
  generate: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/{username}/{package}/{template}/{versionOrEnvironment}/generate",
        tags: ["prompts"],
        summary: "Generate prompt completion",
      },
    })
    .input(generateInput)
    .use(promptMiddleware)
    // FIXME:
    // .output(generateOutput)
    .mutation(async ({ ctx, input }) => {
      // const userId = input.userId;
      let [pv, pt] = await getPv(ctx, input);
      console.log(`promptVersion >>>> ${JSON.stringify(pv)}`);
      const userId =
        pt.runMode === PromptRunModesSchema.Enum.ALL
          ? (env.DEMO_USER_ID as string)
          : (ctx.jwt?.id as string);
      let pl;
      let errorResponse: LlmErrorResponse | null = null;

      if (pv && userId && userId != "") {
        const modelType: ModelTypeType = pv.llmModelType;
        console.log(`data >>>> ${JSON.stringify(input)}`);
        let prompt = "";
        if (modelType === ModelTypeSchema.Enum.TEXT2IMAGE) {
          // get template data
          prompt = generatePrompt(pv.template, input.data || {});
        } else {
          // here decide whether to take template data or promptData
          if (
            providerModels[`${modelType}`].models[`${pv.llmProvider}`]?.find(
              (item) => item.name === pv.llmModel,
            )?.hasRole
          ) {
            prompt = generatePrompt(
              JSON.stringify(pv.promptData.data),
              input.data || {},
            );
          } else {
            prompt = generatePrompt(pv.template, input.data || {});
          }
        }

        console.log(`prompt >>>> ${prompt}`);

        const llmConfig = generateLLmConfig(pv.llmConfig);
        const rr = await LlmProvider(
          prompt,
          pv.llmModel,
          pv.llmProvider,
          llmConfig,
          pv.llmModelType,
          input.isDevelopment,
        );

        console.log(
          `llm response >>>> ${JSON.stringify(rr.response, null, 2)}`,
        );
        console.log(
          `llm performance >>>> ${JSON.stringify(rr.performance, null, 2)}`,
        );
        try {
          pl = await ctx.prisma.promptLog.create({
            data: {
              userId: userId,
              promptPackageId: pv.promptPackageId,
              promptTemplateId: pv.promptTemplateId,
              promptVersionId: pv.id,
              // error:

              environment: input.environment,

              version: pv.version,
              prompt: prompt,
              // completion: rr.data?.completion as string,
              llmResponse: rr.response,

              llmModelType: pv.llmModelType,
              llmProvider: pv.llmProvider,
              llmModel: pv.llmModel,
              llmConfig: llmConfig,
              latency: (rr.performance?.latency as number) || 0,
              prompt_tokens: (rr?.performance?.prompt_tokens as number) || 0,
              completion_tokens:
                (rr?.performance?.completion_tokens as number) || 0,
              total_tokens: (rr?.performance?.total_tokens as number) || 0,
              extras: rr?.performance?.extra ? rr?.performance?.extra : {},
            },
          });
        } catch (error) {
          // Log the error for debugging
          console.error("Error creating promptLog:", error);
        }
      }

      return pl;
    }),
});

export async function getPv(ctx: any, input: any) {
  const userId = ctx.jwt?.id;
  let pt = null;
  let pv = null;

  console.info(
    `figuring out version for ${input.environment} version ${input.version}`,
  );

  if (!input.version && input.environment in promptEnvironment.Values) {
    const ptd = {
      // userId: userId, disabled this for shared URL
      promptPackageId: input.promptPackageId,
      id: input.promptTemplateId,
    };

    console.log(`ptd ----->>>>>> ${JSON.stringify(ptd)}`);

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
  } else if (input.version) {
    console.info(
      `loading version ${input.versionOrEnvironment} ${JSON.stringify(input)}`,
    );
    pv = await ctx.prisma.promptVersion.findFirst({
      where: {
        // userId: userId,
        promptPackageId: input.promptPackageId,
        promptTemplateId: input.promptTemplateId,
        version: input.version,
      },
      include: {
        promptTemplate: true,
      },
    });
    pt = pv.promptTemplate;
  }

  if (!pv) {
    console.error(`<<<>>> version: not found - ${JSON.stringify(input)}`);
  } else {
    console.log(`<<<>>> version: ${pv.version}  ${JSON.stringify(pv)}`);
  }

  return [pv, pt];
}
