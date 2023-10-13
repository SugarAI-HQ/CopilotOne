import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getVersionInput, logVersionOutput } from "~/validators/log_version";

export const versionRouter = createTRPCRouter({
  getLogVersions: protectedProcedure
    .input(getVersionInput)
    .output(logVersionOutput)
    .query(async ({ ctx, input }) => {
      const { promptPackageId } = input;

      const versionList = await ctx.prisma.promptVersion.findMany({
        where: {
          userId: ctx.jwt?.id as string,
          promptPackageId: promptPackageId,
        },
        select: {
          version: true,
        },
        distinct: ["version"],
        orderBy: {
          version: "asc",
        },
      });

      return versionList;
    }),
});
