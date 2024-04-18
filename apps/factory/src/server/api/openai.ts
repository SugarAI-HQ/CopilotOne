import { generateOpenApiDocument } from "trpc-openapi";

import { appRouter } from "./root";
import { env } from "~/env.mjs";

// Generate OpenAPI schema document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Sugar Factory API",
  description: "Prompt over apis",
  version: "1.0.0",
  baseUrl: `${env.NEXT_PUBLIC_API_ENDPOINT}/api`,
  docsUrl: "https://github.com/sugarcane-ai/factory",
  tags: ["prompts"],
});
