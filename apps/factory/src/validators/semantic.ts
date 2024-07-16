// Define the schema for SemanticRouterInput
import {
  EmbeddingModelDefault,
  embeddingModelSchema,
} from "~/validators/embedding";

// export const semanticRouterLookupSchema = z.object({
//   query: z.string().max(4096),
//   em: EmbeddingModel.default(EmbeddingModelDefault),
//   defaultPromptVersion: z.string().optional(),
// });

// export type SemanticRouterLookup = z.infer<typeof semanticRouterLookupSchema>;
