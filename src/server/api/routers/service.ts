import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { completionInput, completionOutput } from "~/validators/service";
import {run} from "~/services/openai";

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
    console.log(`promptVersion >>>> ${JSON.stringify(pv)}`)
    console.log(`data >>>> ${JSON.stringify(input)}`)
    const prompt = generatePrompt(pv.template, input.data);
    console.log(`prompt >>>> ${prompt}`)

    // Todo: Load a provider on the fly
    let output = await run(prompt, pv.llmModel, pv.llmConfig);

    console.log(`output -------------- ${JSON.stringify(output)}`);
    return output
  }),

  

});


function generatePrompt(template: string, data: Record<string, string>): string {
    let result = template;
  
    // Iterate through each replacement key and value
    for (const key of Object.keys(data)) {
      let placeholder = `{${key}}`;
      
      // TODO: $CHAT_HISTORY is not getting replaced
      if (placeholder.startsWith("$")) {
        // Add an escape character at the beginning of the string
        placeholder = "\\" + placeholder;
      }
      console.log(`key ${placeholder}`)
      const value = data[key];

      // Replace all occurrences of the placeholder with the value
      result = result.replace(new RegExp(placeholder, 'g'), value);
    }
  
    return result;
}


