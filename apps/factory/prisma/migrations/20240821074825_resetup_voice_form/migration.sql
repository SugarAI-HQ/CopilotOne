-- CreateTable
CREATE TABLE "Form" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" JSONB NOT NULL,
    "startButtonText" JSONB NOT NULL,
    "messages" JSONB NOT NULL,
    "languages" JSONB NOT NULL DEFAULT '[]',
    "formConfig" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormQuestion" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "formId" UUID NOT NULL,
    "question_type" TEXT NOT NULL,
    "question_text" JSONB NOT NULL,
    "question_params" JSONB NOT NULL,
    "validation" JSONB NOT NULL,
    "qualification" JSONB NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "clientUserId" TEXT NOT NULL,
    "formId" UUID NOT NULL,
    "submittedAt" TIMESTAMP(3),
    "duration" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSubmissionAnswers" (
    "id" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "clientUserId" TEXT NOT NULL,
    "formId" UUID NOT NULL,
    "submissionId" UUID NOT NULL,
    "questionId" UUID NOT NULL,
    "answer" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FormSubmissionAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Form_userId_id_idx" ON "Form"("userId", "id");

-- CreateIndex
CREATE INDEX "FormQuestion_userId_formId_id_idx" ON "FormQuestion"("userId", "formId", "id");

-- CreateIndex
CREATE INDEX "FormSubmission_userId_clientUserId_formId_idx" ON "FormSubmission"("userId", "clientUserId", "formId");

-- CreateIndex
CREATE INDEX "FormSubmissionAnswers_formId_submissionId_questionId_idx" ON "FormSubmissionAnswers"("formId", "submissionId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "FormSubmissionAnswers_submissionId_questionId_key" ON "FormSubmissionAnswers"("submissionId", "questionId");

-- AddForeignKey
ALTER TABLE "FormQuestion" ADD CONSTRAINT "FormQuestion_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionAnswers" ADD CONSTRAINT "FormSubmissionAnswers_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionAnswers" ADD CONSTRAINT "FormSubmissionAnswers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "FormSubmission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSubmissionAnswers" ADD CONSTRAINT "FormSubmissionAnswers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "FormQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
