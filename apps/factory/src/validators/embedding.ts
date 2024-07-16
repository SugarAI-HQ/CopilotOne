import { z } from "zod";
import { copilotId, stringOpt, userId } from "./base";

export const OPENAI_EMBEDDING_MODELS = [
  "text-embedding-3-small",
  "text-embedding-3-large",
  "text-embedding-ada-002	",
];

export const INHOUSE_EMBEDDING_MODELS = ["a", "b"];

export const embedding = z.array(z.number());
export type Embedding = z.infer<typeof embedding>;

export const embeddingScopeSchema = z.object({
  clientUserId: z.string(),
  scope1: stringOpt.default(""),
  scope2: stringOpt.default(""),
  groupId: z.string().nullable(),
});

export type EmbeddingScopeType = z.infer<typeof embeddingScopeSchema>;

export const createEmbeddingInput = z.object({
  copilotId: copilotId,
  scope: embeddingScopeSchema,
  payload: z.any(),
  strategy: stringOpt,
});
// .strict()
export type CreateEmbeddingInput = z.infer<typeof createEmbeddingInput>;

export const createEmbeddingOutput = z.object({
  count: z.number(),
  strategy: stringOpt,
});
// .strict()
export type CreateEmbeddingOutput = z.infer<typeof createEmbeddingOutput>;

export const getEmbeddingInput = z.object({
  userId: stringOpt,
  copilotId: copilotId,
  scope: embeddingScopeSchema,
  userQuery: z.string(),
});
// .strict()
export type GetEmbeddingInput = z.infer<typeof getEmbeddingInput>;

export const embeddingSchema = z.object({
  id: z.string(),
  copilotId: copilotId,
  identifier: z.string(),
  chunk: z.string(),
  doc: z.string(),
  similarity: z.number(),
});
export type EmbeddingSchema = z.infer<typeof embeddingSchema>;

export const embeddingsSchema = z.array(embeddingSchema);
export type EmbeddingsType = z.infer<typeof embeddingsSchema>;

export const embeddingModelSchema = z.object({
  provider: z.string(),
  model: z.string(),
});

export type EmbeddingModel = z.infer<typeof embeddingModelSchema>;

export const EmbeddingModelDefault: EmbeddingModel = {
  provider: "openai",
  model: "text-embedding-3-small",
};
