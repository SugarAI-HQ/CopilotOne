/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  getBlogOutput,
  getBlogInput,
  publicBlogListOutput,
  createBlogInput,
  publicBlogListInput,
} from "~/validators/blog";

export const blogRouter = createTRPCRouter({
  createBlog: publicProcedure
    .input(createBlogInput)
    .output(getBlogOutput)
    .mutation(async ({ ctx, input }) => {
      console.log(`create blog input -------------- ${JSON.stringify(input)}`);

      const createdBlog = await ctx.prisma.blog.create({
        data: {
          ...input,
          publishedAt: input.publishedAt ?? (null as unknown as Date),
        },
      });

      return createdBlog;
    }),

  getBlogs: publicProcedure
    .input(publicBlogListInput)
    .output(publicBlogListOutput)
    .query(async ({ ctx, input }) => {
      console.log(`blog input -------------- ${JSON.stringify(input)}`);
      const perPage = 6;
      const blogs = await ctx.prisma.blog.findMany({
        where: {
          publishedAt: {
            not: undefined,
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        ...(input?.pageNo
          ? {
              skip: (input.pageNo - 1) * perPage,
              take: perPage,
            }
          : {}),
      });

      return blogs;
    }),

  getBlog: publicProcedure
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
      });

      return blog;
    }),
});
