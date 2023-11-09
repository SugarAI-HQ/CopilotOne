import { z } from "zod";
import { packageVisibility } from "./base";
import { templateSchema } from "./prompt_template";
import { RESERVED_NAMES } from "./reserved_names";

export const getPackagesInput = z
  .object({
    userId: z.string().optional(),
    visibility: packageVisibility.optional(),
  })
  .optional();
// .strict()
export type GetPackagesInput = z.infer<typeof getPackagesInput>;

export const getPackageInput = z
  .object({
    id: z.string().uuid(),
    visibility: z.null().optional().or(packageVisibility),
  })
  .strict()
  .required();
export type GetPackageInput = z.infer<typeof getPackageInput>;

export const createPackageInput = z
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
          "Name must only contain lowercase letters, numbers, and dashes.",
      })
      .transform((value) => value.toLowerCase())
      .refine((value) => !RESERVED_NAMES.includes(value), {
        message: "This name is reserved.",
      }),
    description: z.string(),
    visibility: packageVisibility,
  })
  .strict()
  .required();

export type CreatePackageInput = z.infer<typeof createPackageInput>;

export const createTemplateInput = z
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
          "Name must only contain lowercase letters, numbers, and dashes.",
      })
      .transform((value) => value.toLowerCase())
      .refine((value) => !RESERVED_NAMES.includes(value), {
        message: "This name is reserved.",
      }),
    description: z.string(),
  })
  .strict()
  .required();

export type CreateTemplateInput = z.infer<typeof createTemplateInput>;

export const deletePackageInput = z
  .object({
    id: z.string(),
  })
  .strict();
export type DeletePackageInput = z.infer<typeof deletePackageInput>;

export const packageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  visibility: packageVisibility,
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  templates: z.array(templateSchema).optional(),
});

export const updatePackageInput = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    visibility: packageVisibility,
  })
  .strict()
  .required();

export type updatePackageInput = z.infer<typeof updatePackageInput>;

// export type UpdateVersionInput = z.infer<typeof UpdateVersionInput>;

export const packageOutput = packageSchema.or(z.null());
export type PackageOutput = z.infer<typeof packageOutput>;

export const packageListOutput = z.array(packageOutput);
export type PackageListOutput = z.infer<typeof packageListOutput>;
