import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import DeepInfraVendor from "../vendors/deepinfra_vendor";

export interface LLMConfig {
  max_tokens: number;
  temperature: number;
}

export async function run(
  prompt: string,
  llmModel: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  dryRun: boolean = false,
) {
  let client = new DeepInfraVendor("meta-llama", `Llama-2-${llmModel}-chat-hf`);
  const { response, latency } = await client.makeApiCallWithRetry(
    prompt,
    dryRun,
  );

  return generateOutput(response, llmModelType, latency);
}

export const template: PromptDataSchemaType = {
  v: 1,
  p: "llama2",
  data: [],
};
