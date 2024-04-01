-- AlterTable
ALTER TABLE "PromptLog" ADD COLUMN     "promptVariables" JSONB NOT NULL DEFAULT '[]';
