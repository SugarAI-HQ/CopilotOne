import { z } from "zod";
import { v4 as uuid } from 'uuid';


import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Post, database } from "./database";
import { TRPCError } from "@trpc/server";

export const postsRouter = createTRPCRouter({
    getPosts: publicProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/posts',
          tags: ['posts'],
          summary: 'Read all posts',
        },
      })
      .input(
        z.object({
          userId: z.string().uuid().optional(),
        }),
      )
      .output(
        z.object({
          posts: z.array(
            z.object({
              id: z.string().uuid(),
              content: z.string(),
              userId: z.string().uuid(),
            }),
          ),
        }),
      )
      .query(({ input }) => {
        let posts: Post[] = database.posts;
  
        if (input.userId) {
          posts = posts.filter((post) => {
            return post.userId === input.userId;
          });
        }
  
        return { posts };
      }),
    getPostById: publicProcedure
      .meta({
        openapi: {
          method: 'GET',
          path: '/posts/{id}',
          tags: ['posts'],
          summary: 'Read a post by id',
        },
      })
      .input(
        z.object({
          id: z.string().uuid(),
        }),
      )
      .output(
        z.object({
          post: z.object({
            id: z.string().uuid(),
            content: z.string(),
            userId: z.string().uuid(),
          }),
        }),
      )
      .query(({ input }) => {
        const post = database.posts.find((_post) => _post.id === input.id);
  
        if (!post) {
          throw new TRPCError({
            message: 'Post not found',
            code: 'NOT_FOUND',
          });
        }
  
        return { post };
      }),
    createPost: protectedProcedure
      .meta({
        openapi: {
          method: 'POST',
          path: '/posts',
          tags: ['posts'],
          protect: true,
          summary: 'Create a new post',
        },
      })
      .input(
        z.object({
          content: z.string().min(1).max(140),
        }),
      )
      .output(
        z.object({
          post: z.object({
            id: z.string().uuid(),
            content: z.string(),
            userId: z.string().uuid(),
          }),
        }),
      )
      .mutation(({ input, ctx }) => {
        const post: Post = {
          id: uuid(),
          content: input.content,
          userId: ctx.user.id,
        };
  
        database.posts.push(post);
  
        return { post };
      }),
    updatePostById: protectedProcedure
      .meta({
        openapi: {
          method: 'PUT',
          path: '/posts/{id}',
          tags: ['posts'],
          protect: true,
          summary: 'Update an existing post',
        },
      })
      .input(
        z.object({
          id: z.string().uuid(),
          content: z.string().min(1),
        }),
      )
      .output(
        z.object({
          post: z.object({
            id: z.string().uuid(),
            content: z.string(),
            userId: z.string().uuid(),
          }),
        }),
      )
      .mutation(({ input, ctx }) => {
        const post = database.posts.find((_post) => _post.id === input.id);
  
        if (!post) {
          throw new TRPCError({
            message: 'Post not found',
            code: 'NOT_FOUND',
          });
        }
        if (post.userId !== ctx.user.id) {
          throw new TRPCError({
            message: 'Cannot edit post owned by other user',
            code: 'FORBIDDEN',
          });
        }
  
        post.content = input.content;
  
        return { post };
      }),
    deletePostById: protectedProcedure
      .meta({
        openapi: {
          method: 'DELETE',
          path: '/posts/{id}',
          tags: ['posts'],
          protect: true,
          summary: 'Delete a post',
        },
      })
      .input(
        z.object({
          id: z.string().uuid(),
        }),
      )
      .output(z.null())
      .mutation(({ input, ctx }) => {
        const post = database.posts.find((_post) => _post.id === input.id);
  
        if (!post) {
          throw new TRPCError({
            message: 'Post not found',
            code: 'NOT_FOUND',
          });
        }
        if (post.userId !== ctx.user.id) {
          throw new TRPCError({
            message: 'Cannot delete post owned by other user',
            code: 'FORBIDDEN',
          });
        }
  
        database.posts = database.posts.filter((_post) => _post !== post);
  
        return null;
      })
})