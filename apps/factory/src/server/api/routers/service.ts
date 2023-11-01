import {
  createTRPCRouter,
  promptMiddleware,
  protectedProcedure,
} from "~/server/api/trpc";
import { generateInput, generateOutput } from "~/validators/service";
import { generateLLmConfig, generatePrompt } from "~/utils/template";
import { promptEnvironment } from "~/validators/base";
import { LlmProvider } from "~/services/llm_providers";

export const serviceRouter = createTRPCRouter({
  generate: protectedProcedure
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
      if (pv) {
        console.log(`data >>>> ${JSON.stringify(input)}`);
        const prompt = generatePrompt(pv.template, input.data || {});
        console.log(`prompt >>>> ${prompt}`);
        // Todo: Load a provider on the fly
        const llmConfig = generateLLmConfig(pv.llmConfig);
        const output = await LlmProvider(
          prompt,
          pv.llmModel,
          pv.llmProvider,
          llmConfig,
          pv.llmModelType,
          input.isDevelopment,
        );

        console.log(`output -------------- ${JSON.stringify(output)}`);
        // const pl = await createPromptLog(ctx, pv, prompt, output);
        if (output?.completion) {
          const pl = await ctx.prisma.promptLog.create({
            data: {
              userId: ctx.jwt?.id as string,
              promptPackageId: pv.promptPackageId,
              promptTemplateId: pv.promptTemplateId,
              promptVersionId: pv.id,

              environment: input.environment,

              version: pv.version,
              prompt: prompt,
              completion: output?.completion as string,

              llmModelType: pv.llmModelType,
              llmProvider: pv.llmProvider,
              llmModel: pv.llmModel,
              llmConfig: llmConfig,
              latency: output?.performance?.latency as number,
              prompt_tokens: output?.performance?.prompt_tokens as number,
              completion_tokens:
                (output?.performance?.completion_tokens as number) || 0,
              total_tokens: output?.performance?.total_tokens as number,
              extras: output?.performance?.extra
                ? output?.performance?.extra
                : {},
            },
          });

          return pl;
        } else {
          console.log("Error: output.completion is missing");
        }
      }

      return null;
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
    });
  }

  if (!pv) {
    console.error(`promptVersion >>>> not found - ${JSON.stringify(input)}`);
  } else {
    console.error(`promptVersion >>>>  ${JSON.stringify(pv)}`);
  }

  return [pv, pt];
}
