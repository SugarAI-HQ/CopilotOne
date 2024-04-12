-- AlterTable
ALTER TABLE "PromptVersion" ADD COLUMN     "variables" JSONB NOT NULL DEFAULT '[]';
