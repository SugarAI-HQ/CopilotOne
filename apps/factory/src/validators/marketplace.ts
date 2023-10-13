import { z } from "zod";
import { packageVisibility, publicUserSchema } from "./base";
import { templateSchema } from "./prompt_template";

export const getPublicPackageInput = z
  .object({
    id: z.string().uuid(),
    visibility: packageVisibility,
  })
  .strict()
  .required();
export type GetPackageInput = z.infer<typeof getPublicPackageInput>;

export const packagePublicSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  visibility: packageVisibility,
  description: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  User: publicUserSchema,
  templates: z.array(templateSchema).optional(),
});

export const packagePublicOutput = packagePublicSchema.or(z.null());
export type PackagePublicOutput = z.infer<typeof packagePublicOutput>;

export const publicPackageListOutput = z.array(packagePublicSchema);
export type PublicPackageListOutput = z.infer<typeof publicPackageListOutput>;
