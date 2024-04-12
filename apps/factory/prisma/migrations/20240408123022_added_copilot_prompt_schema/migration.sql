-- AlterTable
ALTER TABLE "PromptPackage" ADD COLUMN     "forkedId" TEXT;

-- CreateTable
CREATE TABLE "CopilotPrompt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "copilotId" TEXT NOT NULL,
    "copilotKey" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "templateName" TEXT NOT NULL,
    "versionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CopilotPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CopilotPrompt_userId_copilotId_copilotKey_key" ON "CopilotPrompt"("userId", "copilotId", "copilotKey");
