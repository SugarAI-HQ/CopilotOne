import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { findSemanticLogs } from "~/utils/semantic";
import {
  getLogsInput,
  logListOutput,
  updateLabel,
  getLogInput,
  logOutput,
  getAnalyticsInput,
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
      let logs: any = [];
      const userId = ctx.jwt?.id as string;

      if (input.searchText == undefined || input.searchText == "") {
        logs = await ctx.prisma.promptLog.findMany({
          cursor: cursor ? { id: cursor } : undefined,
          where: filteredWhere,
          orderBy: {
            createdAt: "desc",
          },
          take: perPage + 1,
        });
      } else {
        const pls = await findSemanticLogs(
          userId,
          input?.searchText as string,
          filteredWhere,
        );

        console.log(`logs 4 -------------- semantic logs size: ${logs.length}`);
        // const ids = pls.map((p) => p.id);
        const ids: string[] = [];
        let similarities: any = {};
        let messages: any = {};
        pls?.forEach((p: any) => {
          ids.push(p.id);
          similarities[p.id] = p.similarity;
          messages[p.id] = p.content;
        });

        logs = await ctx.prisma.promptLog.findMany({
          cursor: cursor ? { id: cursor } : undefined,
          // where: filteredWhere,
          where: {
            id: {
              in: ids,
            },
          },
          take: perPage + 1,
        });

        logs.forEach((l: any) => {
          l.similarity = similarities[l.id];
          l.message = messages[l.id];
        });
      }

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
  getAnalytics: protectedProcedure
    .input(getAnalyticsInput)
    .query(async ({ ctx, input }) => {
      const { fieldName, nestedKey } = input;

      const average = await lookupAverage(ctx, nestedKey, fieldName);
      const p95 = await lookupP95(ctx, nestedKey, fieldName);
      const p50 = await lookupP50(ctx, nestedKey, fieldName);

      // return {
      //   average,
      //   p95,
      //   p50,
      // };
      const mergeArrays = (arr: any[]) =>
        arr.reduce(
          (acc, item) => {
            if (item && item.data !== undefined && item.data !== null) {
              acc.data.push(item.data);
            }
            if (
              item &&
              item.date !== undefined &&
              item.date !== null &&
              !acc.date.includes(item.date)
            ) {
              acc.date.push(item.date);
            }
            return acc;
          },
          { data: [], date: [] },
        );

      const mergedAverage = mergeArrays(average);
      const mergedP95 = mergeArrays(p95);
      const mergedP50 = mergeArrays(p50);

      return {
        date: mergedAverage.date,
        average: mergedAverage.data,
        p95: mergedP95.data,
        p50: mergedP50.data,
      };
    }),
});

// {"data":{"completion":"This is fake respoonse generated for testing purposes", "v": "1"},"error":null}

export const lookupAverage = async (
  ctx: any,
  nestedKey: string,
  fieldName: string,
) => {
  const average = await ctx.prisma.$queryRaw`
    SELECT
      DATE_TRUNC('day', "created_at") AS date,
      AVG((stats->${fieldName}->>${nestedKey})::float) AS data
    FROM "PromptLog"
    WHERE
      stats->${fieldName}->>${nestedKey} IS NOT NULL
      AND "created_at" >= CURRENT_TIMESTAMP - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', "created_at")
    ORDER BY date;
  `;
  return average;
};

export const lookupP95 = async (
  ctx: any,
  nestedKey: string,
  fieldName: string,
  pNumber: number = 0.95,
) => {
  const p95 = await ctx.prisma.$queryRaw`
    SELECT
      date_trunc('day', created_at) AS date,
      percentile_cont(${pNumber}) WITHIN GROUP (ORDER BY (stats->${fieldName}->>${nestedKey})::float) AS data
    FROM "PromptLog"
    WHERE stats->${fieldName}->>${nestedKey} IS NOT NULL
    AND created_at >= CURRENT_TIMESTAMP - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', "created_at")
    ORDER BY date;
  `;
  return p95;
};

export const lookupP50 = async (
  ctx: any,
  nestedKey: string,
  fieldName: string,
) => {
  const p50 = await lookupP95(ctx, nestedKey, fieldName, 0.5);
  return p50;
};
