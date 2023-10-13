import type { LlmConfigSchema } from "~/validators/prompt_version";

export async function LlmProvider(
  prompt: string,
  llmModel: string,
  llmProvider: string,
  llmConfig: LlmConfigSchema,
  isDevelopment: boolean = false,
) {
  console.log(`provider >>>> ${llmProvider}`);
  const { run } = await import(`~/services/${llmProvider}`);
  const output = await run(prompt, llmModel, llmConfig, isDevelopment);
  return output;
}
