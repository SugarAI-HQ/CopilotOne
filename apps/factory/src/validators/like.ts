import { z } from "zod";
import { EntityTypesSchema } from "~/generated/prisma-client-zod.ts";

export const getLikeInput = z.object({
  entityId: z.string(),
  entityType: EntityTypesSchema,
});

export const likeInput = z
  .object({
    likeId: z.string(),
  })
  .strict();

export const unLikeInput = z
  .object({
    likeId: z.string(),
  })
  .strict();

export const getUserLikeInput = z
  .object({
    likeId: z.string().optional(),
  })
  .strict();

export const getLikeOutput = z.object({ hasLiked: z.boolean() }).strict();

export const likePublicOutput = z
  .object({
    likesCount: z.number(),
    id: z.string(),
  })
  .strict();

export type unLikeInputType = z.infer<typeof unLikeInput>;
export type likeInputType = z.infer<typeof likeInput>;
export type getLikeInputType = z.infer<typeof getLikeInput>;
export type getLikeOutputType = z.infer<typeof getLikeOutput>;
export type likePublicOutputType = z.infer<typeof likePublicOutput>;
