import type { LlmConfigSchema } from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { getProvider } from "~/services/providers";
import { skillsSchema } from "~/validators/service";

export async function LlmProvider(
  prompt: string,
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
    skills,
    llmModel,
    llmConfig,
    llmModelType,
    isDevelopment,
    attachments,
  );
  return output;
}
