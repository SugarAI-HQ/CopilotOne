import { LlmConfigSchema } from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
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
  const { response, latency } = await client.makeApiCallWithRetry(
    prompt,
    dryRun,
  );
  return generateOutput(response, llmModelType, latency);
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

  const { response, latency } = await client.makeApiCallWithRetry(
    prompt,
    dryRun,
  );
  return generateOutput(response, llmModelType, latency);
}

export const template = {
  v: "stabilityai",
  data: [],
};
