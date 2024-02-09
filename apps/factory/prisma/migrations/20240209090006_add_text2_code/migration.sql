-- AlterEnum
ALTER TYPE "ModelType" ADD VALUE 'TEXT2CODE';

-- DropForeignKey
ALTER TABLE "LikeUser" DROP CONSTRAINT "LikeUser_likeId_fkey";

-- AlterTable
ALTER TABLE "LikeUser" ALTER COLUMN "likeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LikeUser" ADD CONSTRAINT "LikeUser_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like"("id") ON DELETE SET NULL ON UPDATE CASCADE;
