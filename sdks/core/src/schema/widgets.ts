import { z } from "zod";

export const schemaToJsonConfig = z.object({
  generateButtonText: z.string().optional(),
  generatingButtonText: z.string().optional(),
});

export type SchemaToJsonConfig = z.infer<typeof schemaToJsonConfig>;

export const SchemaToJsonConfigDefaults: SchemaToJsonConfig = {
  generateButtonText: "Generate",
  generatingButtonText: "Generating...",
};
