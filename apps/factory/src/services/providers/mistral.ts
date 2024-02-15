import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import DeepInfraVendor from "../vendors/deepinfra_vendor";
import XylemVendor from "../vendors/xylem_vendor";
import { v4 as uuidv4 } from "uuid";
import { PromptRoleEnum } from "~/validators/base";
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
  let client;
  if (llmModel === "Mistral-7B-Instruct-v0.1") {
    client = new DeepInfraVendor("mistralai", "Mistral-7B-Instruct-v0.1");
  } else {
    client = new XylemVendor("mistral", llmModel);
  }
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);
  return lr;
}

const mistral_7B: PromptDataSchemaType = {
  v: 1,
  p: "mistral",
  data: [
    {
      id: uuidv4(),
      role: PromptRoleEnum.enum.USER,
      content: `help me with {@OBJECT}`,
    },
  ],
};

const mistral_7B_Instruct: PromptDataSchemaType = {
  v: 1,
  p: "mistral",
  data: [],
};

export const template = {
  "Mistral-7B": mistral_7B,
  "Mistral-7B-Instruct-v0.1": mistral_7B_Instruct,
};
