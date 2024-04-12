import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getLogsInput,
  logListOutput,
  updateLabel,
  getLogInput,
  logOutput,
} from "~/validators/prompt_log";

export const logRouter = createTRPCRouter({
  getLogs: protectedProcedure
    .input(getLogsInput)
    .output(logListOutput)
    .query(async ({ ctx, input }) => {
      const {
        promptPackageId,
        promptTemplateId,
        cursor,
        perPage,
        version,
        environment,
        llmModel,
        llmProvider,
      } = input;

      const baseWhere = {
        promptPackageId,
        promptTemplateId,
        version,
        environment,
        llmModel,
        llmProvider,
      };

      const filteredWhere = Object.fromEntries(
        Object.entries(baseWhere).filter(([_, value]) => value !== undefined),
      );

      // console.log(`logs 1 -------------- ${JSON.stringify(filteredWhere)}`);

      const totalRecords = await ctx.prisma.promptLog.count({
        where: filteredWhere,
      });
      const totalPages = Math.ceil(totalRecords / perPage);

      // console.log(`logs 2 -------------- ${JSON.stringify(totalPages)}`);

      const logs = await ctx.prisma.promptLog.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        where: filteredWhere,
        orderBy: {
          createdAt: "desc",
        },
        take: perPage + 1,
      });

      // console.log(`logs 3 -------------- ${JSON.stringify(logs)}`);

      const hasMore = logs.length >= perPage;
      const slicedLogs = hasMore ? logs.slice(0, perPage) : logs;
      let nextPageCursor: typeof cursor | undefined = undefined;

      if (logs.length > perPage) {
        const nextItem = logs.pop();
        nextPageCursor = nextItem!.id;
      }

      // console.log(`logs 4 -------------- ${JSON.stringify(logs.length)}`);

      const response = {
        data: slicedLogs,
        totalPages: totalPages,
        hasNextPage: hasMore,
        nextCursor: nextPageCursor,
      };

      // console.log(`logs 5 -------------- ${JSON.stringify(response)}`);

      // console.log(`updated label -------------- ${JSON.stringify(response)}`);

      return response;
    }),

  getLog: protectedProcedure
    .input(getLogInput)
    .output(logOutput)
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const userId = ctx.jwt?.id;
      console.log(id);
      let query = {
        // userId: userId,
        id: id,
      };

      const log = await ctx.prisma.promptLog.findFirst({
        where: query,
      });

      // console.log(`log -------------- ${JSON.stringify(log)}`);

      return log;
    }),

  updateLogLabel: protectedProcedure
    .input(updateLabel)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.jwt?.id;
      let pL = null;
      // console.log(`update label -------------- ${JSON.stringify(input)}`);

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
      // console.log(`updated label -------------- ${JSON.stringify(pL)}`);

      return pL;
    }),
});

// {"data":{"completion":"This is fake respoonse generated for testing purposes", "v": "1"},"error":null}
