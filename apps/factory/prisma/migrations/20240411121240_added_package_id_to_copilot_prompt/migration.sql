/*
  Warnings:

  - Added the required column `packageId` to the `CopilotPrompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CopilotPrompt" ADD COLUMN     "packageId" TEXT NOT NULL;
