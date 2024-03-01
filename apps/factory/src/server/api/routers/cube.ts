import {
  createTRPCRouter,
  promptMiddleware,
  publicProcedure,
} from "~/server/api/trpc";
import { getPromptInput, getPromptOutput } from "~/validators/service";
import { getPv } from "./service";
import { PromptDataSchemaType } from "~/validators/prompt_version";
import { getLogsInput, logIdsListOutput } from "~/validators/prompt_log";
import { Prisma } from "@prisma/client";

export const cubeRouter = createTRPCRouter({
  getPrompt: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/{username}/{package}/{template}/{versionOrEnvironment}",
        tags: ["prompts"],
        summary: "Get Prompt Template",
      },
    })
    .input(getPromptInput)
    .use(promptMiddleware)
    .output(getPromptOutput)
    .query(async ({ ctx, input }) => {
      console.info(`Prompt get ----------------- ${JSON.stringify(input)}`);
      const [pv, pt] = await getPv(ctx, input);
      // console.log(
      //   "pt-------------------------------------------------------------->",
      //   pt,
      // );
      if (pv) {
        console.info(`Prompt generating output ${JSON.stringify(pv)}`);
        return {
          template: pv.template,
          promptData: pv.promptData as PromptDataSchemaType,
          llmProvider: pv.llmProvider,
          model: pv.llmModel,
          version: pv.version,
          createdAt: pv.createdAt,
          updatedAt: pv.updatedAt,
          description: pt?.description,
          modelType: pv.llmModelType,
          promptPackageId: pt.promptPackageId,
          templateId: pt.id,
          runMode: pt.runMode,
        };
      }
      return null;
    }),

  getLogIds: publicProcedure
    .input(getLogsInput)
    .output(logIdsListOutput)
    .query(async ({ ctx, input }) => {
      const {
        promptPackageId,
        promptTemplateId,
        cursor,
        perPage,
        environment,
      } = input;

      const baseWhere = {
        promptPackageId,
        promptTemplateId,
        environment,
      };

      const filteredWhere = Object.fromEntries(
        Object.entries(baseWhere).filter(([_, value]) => value !== undefined),
      );

      // console.log(`logs 1 -------------- ${JSON.stringify(filteredWhere)}`);

      const totalRecords = await ctx.prisma.promptLog.count({
        where: {
          ...filteredWhere,
          llmResponse: {
            path: ["data"],
            not: Prisma.JsonNull,
          },
        },
      });
      const totalPages = Math.ceil(totalRecords / perPage);

      // console.log(`logs 2 -------------- ${JSON.stringify(totalPages)}`);

      const logs = await ctx.prisma.promptLog.findMany({
        cursor: cursor ? { id: cursor } : undefined,
        where: {
          ...filteredWhere,
          llmResponse: {
            path: ["data"],
            not: Prisma.JsonNull,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: perPage + 1,
        select: { id: true },
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
        // data: slicedLogs.map((log) => log.id),
        data: logs,
        totalPages: totalPages,
        hasNextPage: hasMore,
        nextCursor: nextPageCursor,
      };

      // console.log(`logs 5 -------------- ${JSON.stringify(response)}`);

      // console.log(`updated label -------------- ${JSON.stringify(response)}`);
      // return a array containing only array of stirngs
      return response;
    }),
});
