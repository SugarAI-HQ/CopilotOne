-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "LabelledState" AS ENUM ('UNLABELLED', 'SELECTED', 'REJECTED', 'NOTSURE');

-- CreateEnum
CREATE TYPE "PackageVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "FinetunedState" AS ENUM ('UNPROCESSED', 'PROCESSED');

-- CreateEnum
CREATE TYPE "PromptEnvironment" AS ENUM ('DEV', 'PREVIEW', 'RELEASE');

-- CreateEnum
CREATE TYPE "ModelType" AS ENUM ('TEXT2TEXT', 'TEXT2IMAGE');

-- CreateEnum
CREATE TYPE "PromptRunModes" AS ENUM ('AUTHORISED_ONLY', 'LOGGEDIN_ONLY', 'ALL');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVariables" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptPackageId" TEXT NOT NULL,
    "promptTemplateId" TEXT NOT NULL,
    "promptVersionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "majorVersion" TEXT NOT NULL,
    "minorVersion" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptVariables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptPackage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "visibility" "PackageVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptPackage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptTemplate" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptPackageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "previewVersionId" TEXT,
    "releaseVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "modelType" "ModelType" NOT NULL DEFAULT 'TEXT2TEXT',
    "runMode" "PromptRunModes" NOT NULL DEFAULT 'LOGGEDIN_ONLY',

    CONSTRAINT "PromptTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromptVersion" (
    "id" TEXT NOT NULL,
    "forkedFromId" TEXT,
    "userId" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "promptData" JSONB NOT NULL DEFAULT '{}',
    "inputFields" TEXT[],
    "templateFields" TEXT[],
    "llmProvider" TEXT NOT NULL,
    "llmModelType" "ModelType" NOT NULL DEFAULT 'TEXT2TEXT',
    "llmModel" TEXT NOT NULL,
    "llmConfig" JSONB NOT NULL,
    "lang" TEXT[],
    "changelog" TEXT,
    "publishedAt" TIMESTAMP(3),
    "outAccuracy" DOUBLE PRECISION,
    "outLatency" DOUBLE PRECISION,
    "outCost" DOUBLE PRECISION,
    "promptPackageId" TEXT NOT NULL,
    "promptTemplateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "username" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PromptLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputId" TEXT,
    "environment" "PromptEnvironment" NOT NULL DEFAULT 'DEV',
    "version" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "completion" TEXT NOT NULL,
    "llmModelType" "ModelType" NOT NULL DEFAULT 'TEXT2TEXT',
    "llmProvider" TEXT NOT NULL,
    "llmModel" TEXT NOT NULL,
    "llmConfig" JSONB NOT NULL,
    "latency" INTEGER NOT NULL,
    "prompt_tokens" INTEGER NOT NULL,
    "completion_tokens" INTEGER NOT NULL,
    "total_tokens" INTEGER NOT NULL,
    "extras" JSONB NOT NULL,
    "labelledState" "LabelledState" NOT NULL DEFAULT 'UNLABELLED',
    "finetunedState" "FinetunedState" NOT NULL DEFAULT 'UNPROCESSED',
    "promptPackageId" TEXT NOT NULL,
    "promptTemplateId" TEXT NOT NULL,
    "promptVersionId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "PromptVariables_promptTemplateId_majorVersion_minorVersion__key" ON "PromptVariables"("promptTemplateId", "majorVersion", "minorVersion", "variables");

-- CreateIndex
CREATE UNIQUE INDEX "PromptPackage_userId_name_key" ON "PromptPackage"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PromptTemplate_previewVersionId_key" ON "PromptTemplate"("previewVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptTemplate_releaseVersionId_key" ON "PromptTemplate"("releaseVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "PromptTemplate_promptPackageId_name_key" ON "PromptTemplate"("promptPackageId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "PromptVersion_promptPackageId_promptTemplateId_version_key" ON "PromptVersion"("promptPackageId", "promptTemplateId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVariables" ADD CONSTRAINT "PromptVariables_promptPackageId_fkey" FOREIGN KEY ("promptPackageId") REFERENCES "PromptPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVariables" ADD CONSTRAINT "PromptVariables_promptTemplateId_fkey" FOREIGN KEY ("promptTemplateId") REFERENCES "PromptTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVariables" ADD CONSTRAINT "PromptVariables_promptVersionId_fkey" FOREIGN KEY ("promptVersionId") REFERENCES "PromptVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptPackage" ADD CONSTRAINT "PromptPackage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptTemplate" ADD CONSTRAINT "PromptTemplate_promptPackageId_fkey" FOREIGN KEY ("promptPackageId") REFERENCES "PromptPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptTemplate" ADD CONSTRAINT "PromptTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptTemplate" ADD CONSTRAINT "previewVersion" FOREIGN KEY ("previewVersionId") REFERENCES "PromptVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptTemplate" ADD CONSTRAINT "releaseVersion" FOREIGN KEY ("releaseVersionId") REFERENCES "PromptVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_promptPackageId_fkey" FOREIGN KEY ("promptPackageId") REFERENCES "PromptPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_promptTemplateId_fkey" FOREIGN KEY ("promptTemplateId") REFERENCES "PromptTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromptVersion" ADD CONSTRAINT "PromptVersion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

