import { createTRPCRouter } from "~/server/api/trpc";
import { promptRouter } from "./routers/prompt";
import { marketplaceRouter } from "./routers/marketplace";
import { serviceLiteRouter, serviceRouter } from "./routers/service";
import { logRouter } from "./routers/logs";
import { versionRouter } from "./routers/versions";
import { cubeRouter } from "./routers/cube";
import { likeRouter } from "./routers/likes";
import { blogRouter } from "./routers/blog";
import { embeddingRouter } from "./routers/embedding";
import { apiKeyRouter } from "./routers/apikey";
import { chatRouter } from "./routers/chat";
import { messageRouter } from "./routers/message";
import { copilotRouter } from "./routers/copilot";
import { formRouter } from "./routers/form";
import { formSubmissionRouter } from "./routers/formSubmission";

// export const runtime = 'nodejs';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  prompt: promptRouter,
  service: serviceRouter,
  liteService: serviceLiteRouter,
  marketplace: marketplaceRouter,
  log: logRouter,
  version: versionRouter,
  cube: cubeRouter,
  like: likeRouter,
  blog: blogRouter,
  embedding: embeddingRouter,
  apiKey: apiKeyRouter,
  chat: chatRouter,
  message: messageRouter,
  copilot: copilotRouter,
  form: formRouter,
  formSubmission: formSubmissionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
