import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import XylemVendor from "../vendors/xylem_vendor";
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
  return runXylem(prompt, llmModelType, llmModel, dryRun);
}

async function runXylem(
  prompt: string,
  llmModelType: ModelTypeType,
  llmModel: string,
  dryRun: boolean,
) {
  const client = new XylemVendor("WizardCoder", llmModel);
  const { response, latency } = await client.makeApiCallWithRetry(
    prompt,
    dryRun,
  );
  return generateOutput(response, llmModelType, latency);
}

const WizardCoder_34B: PromptDataSchemaType = {
  v: 1,
  p: "WizardCoder",
  data: [],
};

export const template = {
  "WizardCoder-34B": WizardCoder_34B,
};
