import {
  createTRPCRouter,
  promptMiddleware,
  publicProcedure,
} from "~/server/api/trpc";
import {
  GenerateOutput,
  skillsSchema,
  generateInput,
  generateOutput,
  MessagesSchema,
  SkillChoicesType,
} from "~/validators/service";
import {
  generateLLmConfig,
  generatePrompt,
  generatePromptFromJson,
  hasImageModels,
} from "~/utils/template";
import { promptEnvironment } from "~/validators/base";
import { LlmGateway } from "~/services/llm_gateways";
import { providerModels } from "~/validators/base";
import {
  ModelTypeType,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";
import { env } from "~/env.mjs";
import { llmResponseSchema, LlmErrorResponse } from "~/validators/llm_respose";
import { getEditorVersion } from "~/utils/template";
import { Prompt, PromptDataType } from "~/validators/prompt_version";

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
    .output(generateOutput)
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
        let prompt: Prompt = "";
        if (hasImageModels(modelType)) {
          prompt = generatePrompt(pv.template, input.variables || {});
        } else {
          // here decide whether to take template data or promptData
          if (getEditorVersion(modelType, pv.llmProvider, pv.llmModel)) {
            // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
            prompt = generatePromptFromJson(
              pv.promptData.data,
              input.variables || {},
            ) as PromptDataType;
            // console.log(prompt);
            // console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
          } else {
            prompt = generatePrompt(pv.template, input.variables || {});
          }
        }

        console.log(`prompt >>>> ${JSON.stringify(prompt, null, 2)}`);

        const llmConfig = generateLLmConfig(pv.llmConfig);

        const rr = await LlmGateway({
          prompt,
          messages: input.messages!,
          skills: input.skills!,
          skillChoice: input.skillChoice as SkillChoicesType,
          llmModel: pv.llmModel,
          llmProvider: pv.llmProvider,
          llmConfig: llmConfig,
          llmModelType: pv.llmModelType,
          isDevelopment: input.isDevelopment,
          attachments: input.attachments,
        });

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
              prompt: JSON.stringify(prompt),
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

      return pl as GenerateOutput;
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
