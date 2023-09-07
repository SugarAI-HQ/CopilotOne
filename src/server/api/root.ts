import { exampleRouter } from "~/server/api/routers/example";
import { postsRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { promptPackageRouter } from "./routers/prompt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  promptPackage: promptPackageRouter,
  post: postsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
