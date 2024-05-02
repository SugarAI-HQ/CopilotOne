-- AlterTable
ALTER TABLE "PromptLog" ADD COLUMN     "stats" JSONB NOT NULL DEFAULT '{}';
