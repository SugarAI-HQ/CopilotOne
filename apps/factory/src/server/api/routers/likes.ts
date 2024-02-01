import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  LikeInput,
  LikePublicOutput,
  UnlikeInput,
  getLikeInput,
  getLikeOutput,
  getUserLikeInput,
} from "~/validators/like";

export const likeRouter = createTRPCRouter({
  likeEntity: protectedProcedure
    .input(LikeInput)
    .mutation(async ({ input, ctx }) => {
      const { likeId } = input;
      const userId = ctx.jwt?.id as string;

      try {
        const transaction = await ctx.prisma.$transaction(async (prisma) => {
          const newLike = await prisma.likeUser.create({
            data: {
              userId: userId,
              likeId: likeId,
            },
          });

          const entityLike = await prisma.like.update({
            where: {
              id: likeId,
            },
            data: {
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
      const { likeId } = input;
      const userId = ctx.jwt?.id as string;

      try {
        // Delete the existing like from LikeUser table
        const transaction = await ctx.prisma.$transaction(async (prisma) => {
          await prisma.likeUser.delete({
            where: {
              userId_likeId: {
                userId: userId,
                likeId: likeId,
              },
            },
          });

          // Decrease likesCount in EntityLike by 1
          const updatedEntity = await prisma.like.update({
            where: {
              id: likeId,
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
      const { entityId, entityType } = input;

      const entityLike = await prisma.like.upsert({
        where: {
          entityId_entityType: {
            entityId,
            entityType,
          },
        },
        create: {
          entityId,
          entityType,
        },
        update: {},
      });

      const result = {
        likesCount: entityLike?.likesCount || 0,
        id: entityLike.id,
      };
      return result;
    }),

  getUserLike: protectedProcedure
    .input(getUserLikeInput)
    .output(getLikeOutput)
    .query(async ({ input, ctx }) => {
      const { likeId } = input;
      const userId = ctx.jwt?.id as string;

      let resp = {
        hasLiked: false,
      };

      if (!likeId) {
        return resp;
      }

      return ctx.prisma
        .$transaction(async (prisma) => {
          const userLike = prisma.likeUser.findFirst({
            where: {
              userId: userId,
              likeId: likeId,
            },
          });

          resp.hasLiked = !!userLike;
          return resp;
        })
        .catch((error) => {
          console.error("Error fetching Likes:", error);
          throw Error("Failed to fetch Likes");
        });
    }),
});
