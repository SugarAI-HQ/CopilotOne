-- CreateTable
CREATE TABLE "Embedding" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    "copilotId" TEXT NOT NULL,
    "clientUserId" TEXT NOT NULL,
    "scope1" TEXT NOT NULL,
    "scope2" TEXT,
    "groupId" TEXT,
    "chunk" TEXT NOT NULL,
    "doc" TEXT NOT NULL,
    "embedding" vector(1536) NOT NULL,
    "strategy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Embedding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Embedding_userId_copilotId_clientUserId_idx" ON "Embedding"("userId", "copilotId", "clientUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_userId_copilotId_clientUserId_scope1_scope2_group_key" ON "Embedding"("userId", "copilotId", "clientUserId", "scope1", "scope2", "groupId", "chunk");
