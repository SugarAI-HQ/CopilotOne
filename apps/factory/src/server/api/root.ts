import { createTRPCRouter } from "~/server/api/trpc";
import { promptRouter } from "./routers/prompt";
import { marketplaceRouter } from "./routers/marketplace";
import { serviceRouter } from "./routers/service";
import { logRouter } from "./routers/logs";
import { versionRouter } from "./routers/versions";
import { cubeRouter } from "./routers/cube";
import { likeRouter } from "./routers/likes";
import { blogRouter } from "./routers/blog";
import { apiKeyRouter } from "./routers/apikey";

// export const runtime = 'nodejs';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompt: promptRouter,
  service: serviceRouter,
  marketplace: marketplaceRouter,
  log: logRouter,
  version: versionRouter,
  cube: cubeRouter,
  like: likeRouter,
  blog: blogRouter,
  apiKey: apiKeyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
