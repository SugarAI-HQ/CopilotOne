import { LlmConfigSchema } from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import DeepInfraVendor from "../vendors/deepinfra_vendor";
import XylemVendor from "../vendors/xylem_vendor";
import { v4 as uuidv4 } from "uuid";

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
    const startTime = new Date();
    const client = new XylemVendor(llmModel, llmConfig);
    const response = await client.main(prompt, dryRun);
    const endTime = new Date();
    const latency: number = endTime.getTime() - startTime.getTime();
    return generateOutput(response, llmModelType, latency);
  }
}

export const template = {
  v: "mistral",
  data: [
    {
      id: uuidv4(),
      role: "user",
      content: `help me with {@OBJECT}`,
    },
  ],
};
