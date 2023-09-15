
import { z } from "zod";

export const getTemplatesInput = z
    .object({
        userId: z.string().optional(),
        promptPackageId: z.string(),
    })
    .strict()
export type GetTemplatesInput = z.infer<typeof getTemplatesInput>;

export const getTemplateInput = z
    .object({
        id: z.string()
    })
    .strict()
    .required()
export type GetTemplateInput = z.infer<typeof getTemplateInput>;

export const createTemplateInput = z
    .object({
        name: z.string()
        .min(3, {
            message: "Name must be at least 3 characters long.",
        })
        .max(30, {
            message: "Name must be at most 30 characters long.",
        })
        .regex(/^[a-z0-9-]+$/, {
            message: "Name must only contain lowercase letters, numbers, and dashes.",
        })
        .transform((value) => value.toLowerCase()),
        description: z.string() 
    })
    .strict()
    .required();

export type CreateTemplateInput = z.infer<typeof createTemplateInput>;

export const deleteTemplateInput = z
    .object({
        id: z.string(),
    })
    .strict();
export type DeleteTemplateInput = z.infer<typeof deleteTemplateInput>;
  

export const TemplateOutput = z
    .object({
        id: z.string(),
        userId: z.string(),
        promptPackageId: z.string(),
        
        name: z.string(),
        description: z.string(),

        releaseVersion: z.string(),
        preReleaseVersion: z.string(),
    })
export type TemplateOutput = z.infer<typeof TemplateOutput>;

export const TemplateListOutput = z.array(TemplateOutput)
export type TemplateListOutput = z.infer<typeof TemplateListOutput>;

