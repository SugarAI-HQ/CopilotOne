import { z } from "zod";
import { promptEnvironment, stringOpt } from "./base";
import {
  LabelledStateSchema,
  ModelTypeSchema,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";
import { InputJsonValue } from "~/generated/prisma-client-zod.ts";

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

const skillParameterSchema = z.object({
  type: z.string(),
  description: z.string(),
});

const skillDefinitionSchema = z.object({
  name: z.string(),
  description: z.string(),
  parameters: z.object({
    type: z.string(),
    properties: z.record(skillParameterSchema),
    required: z.array(z.string()),
  }),
});

export const skillSchema = z.object({
  type: z.literal("function"),
  function: skillDefinitionSchema,
});

export const skillsSchema = z.array(skillSchema).default([]);

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

export const messageRoleEnum = z.enum(["user", "assistant", "system", "tool"]);
export const messageSchema = z.object({
  role: messageRoleEnum,
  content: z.string(),
});
export const messagesSchema = z.array(messageSchema).default([]);

export const skillChoiceEnum = z.enum(["auto", "none"]);

const skillChoices = z.enum(["auto", "none"]).default("none");

export const generateInput = z
  .object({
    // Template Data
    variables: z.record(z.any()),
    messages: messagesSchema,
    attachments: z.record(z.any()).optional(),
    skills: skillsSchema.default([]),
    skillChoice: skillChoices,
    // promptDataVariables: z.record(z.any()),
    isDevelopment: z.boolean().default(false),
  })
  .merge(getPromptInput)
  .strict();
export type GenerateInput = z.infer<typeof generateInput>;

export type SkillChoicesType = z.infer<typeof skillChoices>;

export const logSchema = z.object({
  id: z.string(),

  environment: promptEnvironment,

  version: z.string(),
  prompt: z.string(),
  completion: z.string().nullable(),

  latency: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  // llmResponse: llmResponseSchema,
  llmResponse: InputJsonValue.nullable(),
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
export type SkillSchema = z.infer<typeof skillSchema>;
export type skillsSchema = z.infer<typeof skillsSchema>;
export type MessageSchema = z.infer<typeof messageSchema>;
export type MessagesSchema = z.infer<typeof messagesSchema>;
