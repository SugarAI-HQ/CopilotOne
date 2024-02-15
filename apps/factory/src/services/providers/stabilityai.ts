import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import DeepInfraVendor from "../vendors/deepinfra_vendor";
import StabilityAIVendor from "../vendors/stabilityai_vendor";

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
  // return run_di(prompt, llmModelType, dryRun);
  return run_si(prompt, llmModelType, dryRun);
}

async function run_di(
  prompt: string,
  llmModelType: ModelTypeType,
  dryRun: boolean = false,
) {
  let client = new DeepInfraVendor("stability-ai", "sdxl");
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);
  return lr;
}

async function run_si(
  prompt: string,
  llmModelType: ModelTypeType,
  dryRun: boolean = false,
) {
  let client = new StabilityAIVendor(
    "stable-diffusion-xl-1024-v1-0",
    "text-to-image",
  );
  // let client = new StabilityAIVendor("stable-diffusion-v1-6", "text-to-image");
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);

  return lr;
}

const sdxl: PromptDataSchemaType = {
  v: 1,
  p: "stabilityai",
  data: [],
};

export const template = {
  sdxl: sdxl,
};
