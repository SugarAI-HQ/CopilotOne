import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
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
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);
  return lr;
}

const b_7_13_70: PromptDataSchemaType = {
  v: 1,
  p: "llama2",
  data: [],
};

export const template = {
  "7b": b_7_13_70,
  "13b": b_7_13_70,
  "70b": b_7_13_70,
};
