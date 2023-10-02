import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getPackagesInput,
  getPackageInput,
  packageOutput,
  packageListOutput,
} from "~/validators/prompt_package";

export const marketplaceRouter = createTRPCRouter({
  getPackages: publicProcedure
    .input(getPackagesInput)
    .output(packageListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`packages input -------------- ${JSON.stringify(input)}`);
      
      const packages = await ctx.prisma.promptPackage.findMany({
        where: {
          userId: ctx.session?.user.id,
          visibility: input?.visibility,
        },
      });
      console.log(`packages out -------------- ${JSON.stringify(packages)}`);
      return packages;
    }),

  getPackage: publicProcedure
    .input(getPackageInput)
    .output(packageOutput)
    .query(async ({ ctx, input }) => {
      console.log(`package input -------------- ${JSON.stringify(input)}`);
      const pkg = await ctx.prisma.promptPackage.findFirst({
        where: {
          userId: ctx.session?.user.id,
          id: input.id,
          visibility: input.visibility,
        },
        include: {
          User: true,
          templates: {
            include: {
              releaseVersion: true, // Include comments related to each post
              previewVersion: true
            }
          }
        }
      });
      console.log(`package -------------- ${JSON.stringify(pkg)}`);
      return pkg;
    })
});
