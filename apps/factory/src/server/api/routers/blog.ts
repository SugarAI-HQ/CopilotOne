import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  getBlogOutput,
  getBlogInput,
  publicBlogListOutput,
} from "~/validators/blog";

export const blogRouter = createTRPCRouter({
  getBlogs: publicProcedure
    .output(publicBlogListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`blog input -------------- ${JSON.stringify(input)}`);

      const blogs = await ctx.prisma.blog.findMany({
        where: {
          publishedAt: {
            not: undefined,
          },
        },
      });

      return blogs;
    }),

  getBlog: protectedProcedure
    .input(getBlogInput)
    .output(getBlogOutput)
    .query(async ({ ctx, input }) => {
      const { slug } = input;
      console.log(`blog input -------------- ${JSON.stringify(input)}`);

      let query = {
        slug: slug,
      };

      const blog = await ctx.prisma.blog.findFirst({
        where: query,
        orderBy: {
          createdAt: "desc",
        },
      });

      return blog;
    }),
});
