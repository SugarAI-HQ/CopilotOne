/*
  Warnings:

  - You are about to drop the `Form` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormSubmissionAnswers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormQuestion" DROP CONSTRAINT "FormQuestion_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmission" DROP CONSTRAINT "FormSubmission_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmissionAnswers" DROP CONSTRAINT "FormSubmissionAnswers_formId_fkey";

-- DropForeignKey
ALTER TABLE "FormSubmissionAnswers" DROP CONSTRAINT "FormSubmissionAnswers_submissionId_fkey";

-- DropTable
DROP TABLE "Form";

-- DropTable
DROP TABLE "FormQuestion";

-- DropTable
DROP TABLE "FormSubmission";

-- DropTable
DROP TABLE "FormSubmissionAnswers";
