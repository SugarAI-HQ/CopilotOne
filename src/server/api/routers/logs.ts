import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getLogsInput,
  logListOutput,
  updateLabel
} from "~/validators/prompt_log";


export const logRouter = createTRPCRouter({

  getLogs: publicProcedure
    .input(getLogsInput)
    .output(logListOutput)
    .query(async ({ ctx, input }) => {
    // console.log(`versions -------------- ${JSON.stringify(input)}`);
    const versions = await ctx.prisma.promptLog.findMany({
      where: {
        // userId: ctx.session?.user.id,
        promptPackageId: input.promptPackageId,
        // promptTemplateId: input.promptTemplateId,
        // promptVersion: input.promptVersionId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log(`pls -------------- ${JSON.stringify(versions)}`);
    return versions;
  }),

  updateLogLabel: publicProcedure
    .input(updateLabel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      let pL = null;
      console.log(`update label -------------- ${JSON.stringify(input)}`);

      if (userId) {
        pL = await ctx.prisma.promptLog.update({
          where: {
            id: input.id,
            userId: userId,
          },
          data: {
            labelledState: input.labelledState,
          },
        });
      }
      console.log(`updated label -------------- ${JSON.stringify(pL)}`);

      return pL;
    })

})