import { z } from "zod";
import { EntityTypesSchema } from "~/generated/prisma-client-zod.ts";

export const getLikeInput = z.object({
  entityId: z.string(),
  entityType: EntityTypesSchema,
});

export const LikeInput = z.object({
  likeId: z.string(),
});
// .strict();
export const UnlikeInput = z.object({
  likeId: z.string(),
});
// .strict();

export const getUserLikeInput = z.object({
  likeId: z.string(),
});
// .strict();

export const getLikeOutput = z.object({ hasLiked: z.boolean() }).strict();
export type GetLikeOutput = z.infer<typeof getLikeOutput>;

export const LikePublicOutput = z
  .object({
    likesCount: z.number(),
    id: z.string(),
  })
  .strict();
