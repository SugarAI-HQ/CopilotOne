import { z } from "zod";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";
import { RESERVED_NAMES } from "./reserved_names";

const templateNameInput = z
  .string()
  .min(3, {
    message: "Name must be at least 3 characters long.",
  })
  .max(30, {
    message: "Name must be at most 30 characters long.",
  })
  .regex(/^[a-z0-9-]+$/, {
    message: "Name must only contain lowercase letters, numbers, and hyphen.",
  })
  .transform((value) => value.toLowerCase())
  .refine((value) => !RESERVED_NAMES.includes(value), {
    message: "This name is reserved.",
  });

export const getTemplatesInput = z
  .object({
    userId: z.string().optional(),
    promptPackageId: z.string(),
  })
  .strict();
export type GetTemplatesInput = z.infer<typeof getTemplatesInput>;

export const getTemplateInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();
export type GetTemplateInput = z.infer<typeof getTemplateInput>;

export const createTemplateInput = z
  .object({
    name: templateNameInput,
    description: z.string(),
    promptPackageId: z.string(),
    modelType: ModelTypeSchema,
  })
  .strict()
  .required();

export type CreateTemplateInput = z.infer<typeof createTemplateInput>;

export const updateTemplateInput = z
  .object({
    id: z.string(),
    description: z.string(),
  })
  .strict()
  .required();

export type UpdateTemplateInput = z.infer<typeof updateTemplateInput>;

export const deployTemplateInput = z
  .object({
    // userId: z.string().optional(),
    promptTemplateId: z.string(),
    promptPackageId: z.string(),
    promptVersionId: z.string(),
    environment: z.string(),
    changelog: z.string().nullable(),
  })
  .strict()
  .required();

export type DeployTemplateInput = z.infer<typeof deployTemplateInput>;

export const deleteTemplateInput = z
  .object({
    id: z.string(),
  })
  .strict();
export type DeleteTemplateInput = z.infer<typeof deleteTemplateInput>;

export const templateSchema = z.object({
  id: z.string(),

  userId: z.string(),
  promptPackageId: z.string(),

  name: z.string(),
  description: z.string(),
  modelType: ModelTypeSchema,

  releaseVersionId: z.string().or(z.null()),
  previewVersionId: z.string().or(z.null()),

  releaseVersion: z.null().optional().or(z.record(z.any())),
  previewVersion: z.null().optional().or(z.record(z.any())),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const templateOutput = templateSchema.or(z.null());
export type TemplateOutput = z.infer<typeof templateOutput>;

export const templateListOutput = z.array(templateSchema);
export type TemplateListOutput = z.infer<typeof templateListOutput>;
