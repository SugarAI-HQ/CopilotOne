import { z } from "zod";
import { MediaTypeSchema } from "~/generated/prisma-client-zod.ts";

export const getBlogSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    mediaUrl: z.string(),
    mediaType: MediaTypeSchema,
    tags: z.array(z.string()).optional(),
    previewImage: z.string(),
    publishedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .strict();

export const getBlogInput = z
  .object({
    slug: z.string(),
  })
  .strict();

export type GetBlogInput = z.infer<typeof getBlogInput>;

export const getBlogOutput = getBlogSchema.or(z.null());
export type GetBlogOutput = z.infer<typeof getBlogOutput>;

export const publicBlogListOutput = z.array(getBlogSchema);
export type PublicBlogListOutput = z.infer<typeof publicBlogListOutput>;
