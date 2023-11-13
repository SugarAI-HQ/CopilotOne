import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getPublicPackageInput,
  packagePublicOutput,
  publicPackageListOutput,
} from "~/validators/marketplace";
import {
  getPackagesInput,
  packageOutput,
  packageListOutput,
} from "~/validators/prompt_package";

export const marketplaceRouter = createTRPCRouter({
  getPackages: publicProcedure
    .input(getPackagesInput)
    .output(publicPackageListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`packages input -------------- ${JSON.stringify(input)}`);

      const packages = await ctx.prisma.promptPackage.findMany({
        where: {
          // userId: ctx.session?.user.id,
          visibility: input?.visibility,
        },
        orderBy: {
          updatedAt: "desc",
        },
        include: {
          User: true,
        },
      });
      console.log(`packages out -------------- ${JSON.stringify(packages)}`);

      // sort according to date when packages were created

      // packages.sort((packageA, packageB) => {
      //   return (
      //     new Date(packageB.updatedAt).valueOf() -
      //     new Date(packageA.updatedAt).valueOf()
      //   );
      // });
      return packages;
    }),

  getPackage: publicProcedure
    .input(getPublicPackageInput)
    .output(packagePublicOutput)
    .query(async ({ ctx, input }) => {
      console.log(`package input -------------- ${JSON.stringify(input)}`);
      const pkg = await ctx.prisma.promptPackage.findFirst({
        where: {
          // userId: ctx.session?.user.id,
          id: input.id,
          visibility: input.visibility,
        },
        include: {
          User: true,
          templates: {
            include: {
              releaseVersion: true, // Include comments related to each post
              previewVersion: true,
            },
          },
        },
      });
      // console.log(`package -------------- ${JSON.stringify(pkg)}`);
      return pkg;
    }),
});
