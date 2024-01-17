import type { LlmConfigSchema } from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { getProvider } from "~/services/providers";

export async function LlmProvider(
  prompt: string,
  llmModel: string,
  llmProvider: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  isDevelopment: boolean = false,
) {
  console.log(`provider >>>> ${llmProvider}`);
  const provider = getProvider(llmProvider);
  const output = await provider(
    prompt,
    llmModel,
    llmConfig,
    llmModelType,
    isDevelopment,
  );
  return output;
}
