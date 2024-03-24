import type { LlmConfigSchema, Prompt } from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { getProvider } from "~/services/providers";
import { MessagesSchema, skillsSchema } from "~/validators/service";

export async function LlmProvider(
  prompt: Prompt,
  messages: MessagesSchema,
  skills: skillsSchema,
  llmModel: string,
  llmProvider: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  isDevelopment: boolean = false,
  attachments?: any,
) {
  console.log(`provider >>>> ${llmProvider}`);
  const provider = getProvider(llmProvider);
  const output = await provider(
    prompt,
    messages,
    skills,
    llmModel,
    llmConfig,
    llmModelType,
    isDevelopment,
    attachments,
  );
  return output;
}
