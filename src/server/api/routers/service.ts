import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { completionInput, completionOutput } from "~/validators/service";
import { run } from "~/services/openai";
import { JsonObject } from "@prisma/client/runtime/library";
import { generateLLmConfig, generatePrompt } from "~/utils/template";

export const serviceRouter = createTRPCRouter({
  completion: publicProcedure
    //   .meta({
    //     openapi: {
    //       method: 'GET',
    //       path: '/packages',
    //       tags: ['packages'],
    //       summary: 'Read all packages',
    //     },
    //   })
    .input(completionInput)
    .output(completionOutput)
    .mutation(async ({ ctx, input }) => {
      const pv = await ctx.prisma.promptVersion.findFirst({
        where: {
          userId: ctx.session?.user.id,
          promptPackageId: input.promptPackageId,
          promptTemplateId: input.promptTemplateId,
          id: input.id,
        },
      });

      console.log(`promptVersion >>>> ${JSON.stringify(pv)}`);
      if (pv) {
        console.log(`data >>>> ${JSON.stringify(input)}`);
        const prompt = generatePrompt(pv.template, input.data);
        console.log(`prompt >>>> ${prompt}`);
        // Todo: Load a provider on the fly
        const llmConfig = generateLLmConfig(pv.llmConfig as JsonObject)
        const output = await run(
          prompt,
          pv.llmModel,
          llmConfig
        );
        

        console.log(`output -------------- ${JSON.stringify(output)}`);
        // const pl = await createPromptLog(ctx, pv, prompt, output);

        const pl = await ctx.prisma.promptLog.create({
          data: {
            promptPackageId: pv.promptPackageId,
            promptTemplateId: pv.promptTemplateId,
            promptVersionId: pv.id,
      
            prompt: prompt,
            completion: output?.completion as string,
      
            llmProvider: pv.llmProvider,
            llmModel: pv.llmModel,
            llmConfig: llmConfig as JsonObject,
            
            latency: output?.performance?.latency as number,
            prompt_tokens: output?.performance?.prompt_tokens as number,
            completion_tokens: output?.performance?.completion_tokens as number,
            total_tokens: output?.performance?.total_tokens as number,
            extras: {},
            // promptPackage: {
            //   connect: {
            //     // Provide the unique identifier of the existing promptPackage
            //     id: pv.promptPackageId
            //   },
            // },
            // promptTemplate: {
            //   connect: {
            //     // Provide the unique identifier of the existing promptPackage
            //     id: pv.promptTemplateId
            //   },
            // },
            // promptVersion: {
            //   connect: {
            //     // Provide the unique identifier of the existing promptPackage
            //     id: pv.id
            //   },
            // }
          },
        });

        return pl;
      } else {
        console.error(`promptVersion not found >>>> ${JSON.stringify(input)}`);
      }

      return null;
    }),
});

// async function createPromptLog(ctx, pv:pv, prompt:string, completion:string) {

  
//   //   return {
//   //   id: "",
//   //   promptPackageId: "",
//   //   promptTemplateId: "",
//   //   prompt: "",
//   //   data: "",
//   //   userId: "",
//   //   createdAt: "",
//   //   updatedAt: "",
//   // };
// }
