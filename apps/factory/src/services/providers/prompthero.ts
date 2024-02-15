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
  let client = new DeepInfraVendor("prompthero", "openjourney");
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);
  return lr;
}

const open_Journey: PromptDataSchemaType = {
  v: 1,
  p: "prompthero",
  data: [],
};

export const template = {
  openjourney: open_Journey,
};
