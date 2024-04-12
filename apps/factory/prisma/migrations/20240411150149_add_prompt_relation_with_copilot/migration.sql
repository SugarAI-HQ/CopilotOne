-- AddForeignKey
ALTER TABLE "CopilotPrompt" ADD CONSTRAINT "CopilotPrompt_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "PromptPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopilotPrompt" ADD CONSTRAINT "CopilotPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CopilotPrompt" ADD CONSTRAINT "CopilotPrompt_copilotId_fkey" FOREIGN KEY ("copilotId") REFERENCES "Copilot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
