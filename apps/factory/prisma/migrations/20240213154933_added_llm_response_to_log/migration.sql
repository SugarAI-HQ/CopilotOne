-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "publishedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PromptLog" ADD COLUMN     "llmResponse" JSONB NOT NULL DEFAULT '{}',
ALTER COLUMN "completion" DROP NOT NULL;
