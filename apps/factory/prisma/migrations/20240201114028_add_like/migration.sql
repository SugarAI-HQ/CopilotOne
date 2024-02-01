-- CreateEnum
CREATE TYPE "EntityTypes" AS ENUM ('PromptPackage', 'PromptTemplate', 'PromptVersion');

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LikeUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "likeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LikeUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_entityId_entityType_key" ON "Like"("entityId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "LikeUser_userId_likeId_key" ON "LikeUser"("userId", "likeId");

-- AddForeignKey
ALTER TABLE "LikeUser" ADD CONSTRAINT "LikeUser_likeId_fkey" FOREIGN KEY ("likeId") REFERENCES "Like"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
