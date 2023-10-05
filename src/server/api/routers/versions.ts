import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { getVersionInput, logVersionOutput } from "~/validators/log_version";

export const versionRouter = createTRPCRouter({

  getVersions: publicProcedure
    .input(getVersionInput)
    .output(logVersionOutput)
    .query(async ({ ctx, input }) => {
      const { promptPackageId } = input;

      const versionList = await ctx.prisma.promptVersion.findMany({
        where: {
          promptPackageId: promptPackageId
        },
        select: {
          version: true,
        },
        distinct: ['version'],
        orderBy: {
          version: 'asc',
        },
      });

      return versionList;
    })

});