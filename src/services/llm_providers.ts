import type { LlmConfigSchema } from "~/validators/prompt_version";

export async function LlmProvider(
  prompt: string,
  llmModel: string,
  llmProvider: string,
  llmConfig: LlmConfigSchema,
  llmModelType: string,
  isDevelopment: boolean = false,
) {
  console.log(`provider >>>> ${llmProvider}`);
  const { run } = await import(`~/services/providers/${llmProvider}`);
  const output = await run(
    prompt,
    llmModel,
    llmConfig,
    llmModelType,
    isDevelopment,
  );
  return output;
}
