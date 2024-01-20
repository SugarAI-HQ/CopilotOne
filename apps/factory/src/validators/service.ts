import { z } from "zod";
import { promptEnvironment, stringOpt } from "./base";
import {
  LabelledStateSchema,
  ModelTypeSchema,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";

export const getPromptInput = z.object({
  environment: promptEnvironment.optional(),

  // Prompt Template identitication
  username: z.string(),
  package: z.string(),
  template: z.string(),
  version: z.string().optional(),
  versionOrEnvironment: z.string().default(promptEnvironment.Enum.RELEASE),

  userId: stringOpt,
  promptPackageId: stringOpt,
  promptTemplateId: stringOpt,
  promptVersionId: stringOpt,
});
// .strict()
export type GetPromptInput = z.infer<typeof getPromptInput>;

// export const getPromptInput2 = z
//     .object({
//         userId: z.string().optional(),
//         environment: promptEnvironment.default(promptEnvironment.Enum.RELEASE),

//         // Prompt Template identitication
//         promptPackageId: z.string(),
//         promptTemplateId: z.string(),
//         version: z.string().optional(),
//     })
//     // .strict()
// export type GetPromptInput2 = z.infer<typeof getPromptInput2>;

export const getPromptOutput = z
  .object({
    version: z.string().optional(),
    template: z.string(),
    promptData: z.unknown(),
    llmProvider: z.string(),
    model: z.string(),
    description: z.string().optional(),
    modelType: ModelTypeSchema,
    versionOrEnvironment: z.string().default(promptEnvironment.Enum.RELEASE),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    promptPackageId: z.string(),
    templateId: z.string(),
    runMode: PromptRunModesSchema,
  })
  .or(z.null());
export type GetPromptOutput = z.infer<typeof getPromptOutput>;

export const generateInput = z
  .object({
    // Template Data
    data: z.record(z.any()),
    // promptDataVariables: z.record(z.any()),
    isDevelopment: z.boolean().default(false),
  })
  .merge(getPromptInput)
  .strict();
export type GenerateInput = z.infer<typeof generateInput>;

export const logSchema = z.object({
  id: z.string(),

  environment: promptEnvironment,

  version: z.string(),
  prompt: z.string(),
  completion: z.string(),

  latency: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),

  labelledState: LabelledStateSchema,
  llmProvider: z.string(),
  llmModel: z.string(),
  llmModelType: ModelTypeSchema,

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const generateOutput = logSchema.or(z.null());
export type LogSchema = z.infer<typeof logSchema>;
export type GenerateOutput = z.infer<typeof generateOutput>;
