import { z } from "zod";
import {
  InputJsonValue,
  StatusStateSchema,
} from "~/generated/prisma-client-zod.ts";
import { RESERVED_NAMES } from "./reserved_names";

export const createCopilotInput = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "Name must be at least 3 characters long.",
      })
      .max(30, {
        message: "Name must be at most 30 characters long.",
      })
      .regex(/^[a-z0-9-]+$/, {
        message:
          "Name must only contain lowercase letters, numbers, and hyphen.",
      })
      .transform((value) => value.toLowerCase())
      .refine((value) => !RESERVED_NAMES.includes(value), {
        message: "This name is reserved.",
      }),
    description: z.string().optional(),
    copilotType: z.string().default("Text2Text"),
    settings: InputJsonValue.nullable(),
    status: StatusStateSchema.default("PRODUCTION"),
  })
  .strict()
  .required();

export const getCopilotInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();

export const getCopilotsInput = z
  .object({
    userId: z.string().optional(),
  })
  .strict();

export const updateCopilotInput = createCopilotInput
  .extend({
    id: z.string(),
    userId: z.string(),
  })
  .strict();

export const copilotSchema = createCopilotInput
  .extend({
    id: z.string(),
    userId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const copilotCloneInput = z
  .object({
    promptPackagePath: z.string(),
    copilotId: z.string(),
  })
  .required();

export const getCopilotPromptInput = z
  .object({
    copilotId: z.string(),
  })
  .required();

export const copilotPromptOutput = z.object({
  id: z.string(),
  userId: z.string(),
  copilotId: z.string(),
  copilotKey: z.string(),
  userName: z.string(),
  packageName: z.string(),
  packageId: z.string(),
  templateName: z.string(),
  versionName: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const copilotPromptListOutput = z.array(copilotPromptOutput);

export type CreateCopilotInput = z.infer<typeof createCopilotInput>;
export type GetCopilotInput = z.infer<typeof getCopilotInput>;
export type UpdateCopilotInput = z.infer<typeof updateCopilotInput>;
export type CopilotSchema = z.infer<typeof copilotSchema>;
export const copilotOutput = copilotSchema.or(z.null());
export type CopilotOutput = z.infer<typeof copilotOutput>;
export const copilotListOutput = z.array(copilotSchema);
export type CopilotListOutput = z.infer<typeof copilotListOutput>;
export type GetCopilotPromptInput = z.infer<typeof getCopilotPromptInput>;
export type CopilotPromptOutput = z.infer<typeof copilotPromptOutput>;
export type CopilotPromptListOutput = z.infer<typeof copilotPromptListOutput>;
