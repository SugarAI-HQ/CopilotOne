import { exampleRouter } from "~/server/api/routers/example";
import { postsRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { promptRouter } from "./routers/prompt";
import { serviceRouter } from "./routers/service";

export const runtime = 'nodejs';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  prompt: promptRouter,
  post: postsRouter,
  service: serviceRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
