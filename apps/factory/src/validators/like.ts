import { z } from "zod";
import { EntityTypesSchema } from "~/generated/prisma-client-zod.ts";

export const getLikeInput = z.object({
  entityId: z.string(),
  entityType: EntityTypesSchema,
});
export type GetLikeInputType = z.infer<typeof getLikeInput>;

export const likeInput = z
  .object({
    likeId: z.string(),
  })
  .strict();
export type LikeInputType = z.infer<typeof likeInput>;

export const unLikeInput = z
  .object({
    likeId: z.string(),
  })
  .strict();
export type UnLikeInputType = z.infer<typeof unLikeInput>;

export const getUserLikeInput = z
  .object({
    likeId: z.string().optional(),
  })
  .strict();

export const getLikeOutput = z.object({ hasLiked: z.boolean() }).strict();
export type GetLikeOutputType = z.infer<typeof getLikeOutput>;

export const likePublicOutput = z
  .object({
    likesCount: z.number(),
    id: z.string(),
  })
  .strict();

export type LikePublicOutputType = z.infer<typeof likePublicOutput>;
