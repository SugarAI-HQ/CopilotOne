import { z } from "zod";
import { promptEnvironment } from "./base";
import { InputJsonValue } from "~/generated/prisma-client-zod.ts";
import {
  LabelledStateSchema,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import { llmResponseSchema } from "./llm_respose";

// const allowedLabelledStates = ["UNLABELLED", "SELECTED", "REJECTED", "NOTSURE"] as const;
// export type LabelledState = typeof LabelledStateSchema;

export const getLogsInput = z
  .object({
    userId: z.string().optional(),
    promptPackageId: z.string().optional(),
    promptTemplateId: z.string().optional(),
    promptVersionId: z.string().optional(),
    cursor: z.string().optional(),
    perPage: z.number().default(10), // Add a perPage field for pagination
    version: z.string().optional(),
    environment: z.string().optional(),
    llmModel: z.string().optional(),
    llmProvider: z.string().optional(),
  })
  .strict();

export type GetLogsInput = z.infer<typeof getLogsInput>;

export const getLogInput = z
  .object({
    userId: z.string().optional(),
    id: z.string(),
  })
  .strict();

export type GetLogInput = z.infer<typeof getLogInput>;

const logSchema = z.object({
  id: z.string(),
  // inputId: z.string().optional(),
  promptPackageId: z.string(),
  promptTemplateId: z.string(),
  promptVersionId: z.string(),
  prompt: z.string(),
  version: z.string(),
  completion: z.string().nullable(),
  llmResponse: InputJsonValue.nullable(),
  llmProvider: z.string(),
  llmModel: z.string(),
  llmConfig: InputJsonValue.nullable(),
  llmModelType: ModelTypeSchema,

  environment: promptEnvironment,

  latency: z.number(),
  prompt_tokens: z.number(),
  completion_tokens: z.number(),
  total_tokens: z.number(),
  // extras: z.record(z.any()),

  labelledState: z.string(),
  finetunedState: z.string(),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const updateLabel = z.object({
  id: z.string(),
  labelledState: LabelledStateSchema,
});

export const logOutput = logSchema.or(z.null());
export type LogOutput = z.infer<typeof logOutput>;

// export const logListOutput = z.object({data: z.array(logSchema), totalPages: z.number()})
export const logListOutput = z.object({
  data: z.array(logSchema),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  nextCursor: z.string().optional(),
});
export type LogListOutput = z.infer<typeof logListOutput>;

// const dd = {
//     "id": "clmq7ranr0001sgpp3l6qou92",
//     "userId": "clmpdlyre0000sgj58t3yilf8",
//     "log": "0.0.1",
//     "template": "\nYou a bot name {#BOT_NAME} trained by {#PROVIDER}\nYou act as {@C_ROLE}, {@C_DESCRIPTION}\n",

//     "inputFields": [],
//     "templateFields": [],
//     "changelog": "TTD",
//     "llmProvider": "openai",
//     "llmModel": "gpt-3.5-turbo",
//     "llmConfig": {},
//     "lang": [],
//     "outAccuracy": null,
//     "outLatency": null,
//     "outCost": null,
//     "promptPackageId":
//     "clmpdm6jm0006sgj59s49k8nv",
//     "promptTemplateId": "clmpzzla20003sg6fku7k5qtv"
// }
