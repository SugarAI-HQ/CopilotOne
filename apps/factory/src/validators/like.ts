import { z } from "zod";
import { EntityTypesSchema } from "~/generated/prisma-client-zod.ts";

export const LikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: EntityTypesSchema,
  })
  .strict();
export const UnlikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: EntityTypesSchema,
    LikeId: z.string(),
  })
  .strict();

export const getLikeInput = z
  .object({
    EntityId: z.string(),
    EntityType: EntityTypesSchema,
  })
  .strict();

export const getLikeOutput = z
  .object({ likeId: z.string(), hasLiked: z.boolean() })
  .strict();

export const LikePublicOutput = z
  .object({
    likesCount: z.number(),
  })
  .strict();
