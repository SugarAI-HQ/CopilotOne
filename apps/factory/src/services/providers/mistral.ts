import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import DeepInfraVendor from "../vendors/deepinfra_vendor";
import XylemVendor from "../vendors/xylem_vendor";
import { v4 as uuidv4 } from "uuid";
import { promptRole } from "~/validators/base";
import { LlmProvider } from "../llm_providers";
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
  // const client =(llmModel==="Mistral-7B-Instruct-v0.1")?:;
  if (llmModel === "Mistral-7B-Instruct-v0.1") {
    const client = new DeepInfraVendor("mistralai", "Mistral-7B-Instruct-v0.1");
    const { response, latency } = await client.makeApiCallWithRetry(
      prompt,
      dryRun,
    );
    return generateOutput(response, llmModelType, latency);
  } else {
    const client = new XylemVendor("mistral", llmModel);
    const { response, latency } = await client.makeApiCallWithRetry(
      prompt,
      dryRun,
    );
    return generateOutput(response, llmModelType, latency);
  }
}

export const template: PromptDataSchemaType = {
  v: 1,
  p: "mistral",
  data: [
    {
      id: uuidv4(),
      role: (promptRole.enum.USER as string).toLowerCase(),
      content: `help me with {@OBJECT}`,
    },
  ],
};
