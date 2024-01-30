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
  let client = new DeepInfraVendor("runwayml", "stable-diffusion-v1-5");
  const { response, latency } = await client.makeApiCallWithRetry(
    prompt,
    dryRun,
  );

  return generateOutput(response, llmModelType, latency);
}

const stable_Diffusion_V1_5: PromptDataSchemaType = {
  v: 1,
  p: "runwayml",
  data: [],
};

export const template = {
  "stable-diffusion-v1-5": stable_Diffusion_V1_5,
};
