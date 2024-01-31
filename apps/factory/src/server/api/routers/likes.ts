import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  LikeInput,
  LikePublicOutput,
  UnlikeInput,
  getLikeInput,
  getLikeOutput,
} from "~/validators/like";

export const likeRouter = createTRPCRouter({
  likeEntity: protectedProcedure
    .input(LikeInput)
    .mutation(async ({ input, ctx }) => {
      const { EntityId, EntityType } = input;
      const userId = ctx.jwt?.id as string;

      try {
        const transaction = await ctx.prisma.$transaction(async (prisma) => {
          const newLike = await prisma.likeUser.create({
            data: {
              userId: userId,
            },
          });

          const entityLike = await prisma.like.upsert({
            where: {
              EntityId_EntityType: {
                EntityId,
                EntityType,
              },
            },
            create: {
              likes: {
                connect: {
                  id: newLike.id,
                },
              },
              EntityId,
              EntityType,
              likesCount: 1,
            },
            update: {
              likes: {
                connect: {
                  id: newLike.id,
                },
              },
              likesCount: {
                increment: 1,
              },
            },
          });
          return entityLike.id;
        });

        return transaction;
      } catch (error) {
        console.error("Error creating Like:", error);
        throw Error("Failed to create Like");
      }
    }),

  unlikeEntity: protectedProcedure
    .input(UnlikeInput)
    .mutation(async ({ input, ctx }) => {
      const { EntityId, EntityType, LikeId } = input;
      const userId = ctx.jwt?.id as string;

      try {
        // Delete the existing like from LikeUser table
        const transaction = await ctx.prisma.$transaction(async (prisma) => {
          await prisma.likeUser.delete({
            where: {
              userId_likeId: {
                userId: userId,
                likeId: LikeId,
              },
            },
          });

          // Decrease likesCount in EntityLike by 1
          const updatedEntity = await prisma.like.update({
            where: {
              EntityId_EntityType: {
                EntityId,
                EntityType,
              },
            },
            data: {
              likesCount: {
                decrement: 1,
              },
            },
          });
          return updatedEntity;
        });

        console.log("Like deleted and Entity updated:", transaction);
        return transaction;
      } catch (error) {
        console.error("Error deleting Like:", error);
        throw Error("Failed to delete Like");
      }
    }),

  getLikes: publicProcedure
    .input(getLikeInput)
    .output(LikePublicOutput)
    .query(async ({ input, ctx }) => {
      const { EntityId, EntityType } = input;

      return ctx.prisma
        .$transaction(async (prisma) => {
          const entityLike = await prisma.like.findUnique({
            where: {
              EntityId_EntityType: {
                EntityId,
                EntityType,
              },
            },
          });

          const result = {
            likesCount: entityLike?.likesCount || 0,
          };
          return result;
        })
        .catch((error) => {
          console.error("Error fetching Likes:", error);
          throw Error("Failed to fetch Likes");
        });
    }),

  UserLikeCheck: protectedProcedure
    .input(getLikeInput)
    .output(getLikeOutput)
    .query(async ({ input, ctx }) => {
      const { EntityId, EntityType } = input;
      const userId = ctx.jwt?.id as string;

      return ctx.prisma
        .$transaction(async (prisma) => {
          const entityLike = await prisma.like.findUnique({
            where: {
              EntityId_EntityType: {
                EntityId,
                EntityType,
              },
            },
            include: { likes: true },
          });

          if (entityLike) {
            const userLike = entityLike.likes.find(
              (like) => like.userId === userId,
            );
            if (userLike) {
              return {
                likeId: entityLike.id,
                hasLiked: true,
              };
            }
          }
          return {
            likeId: entityLike!.id,
            hasLiked: false,
          };
        })
        .catch((error) => {
          console.error("Error fetching Likes:", error);
          throw Error("Failed to fetch Likes");
        });
    }),
});
