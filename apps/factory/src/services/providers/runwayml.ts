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
  let client = new DeepInfraVendor("runwayml", "stable-diffusion-v1-5");
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);

  return lr;
}

const stable_Diffusion_V1_5: PromptDataSchemaType = {
  v: 1,
  p: "runwayml",
  data: [],
};

export const template = {
  "stable-diffusion-v1-5": stable_Diffusion_V1_5,
};
