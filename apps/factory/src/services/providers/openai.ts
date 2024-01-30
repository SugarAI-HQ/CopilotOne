import {
  LlmConfigSchema,
  PromptDataSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import OpenAIVendor from "~/services/vendors/openai_vendors";
import { v4 as uuidv4 } from "uuid";
import { PromptRoleEnum } from "~/validators/base";
export interface LLMConfig {
  max_tokens: number;
  temperature: number;
}

//   // Example usage
//   const template = `You a bot name {#BOT_NAME} trained by {#LLM_PROVIDER} ... Human: {%QUERY} {#BOT_NAME} AI response:`;
//   const replacements = {
//     '@BOT_NAME': 'ChatGPT',
//     '#LLM_PROVIDER': 'OpenAI',
//     'ROLE': 'customer support',
//     'DESCRIPTION': 'answering questions',
//     'TASKS': 'providing information',
//     'CHAT_HISTORY': 'No recent conversation',
//   };

export async function run(
  prompt: string,
  llm_model: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  dryRun: boolean = false,
) {
  try {
    // Capture the start time
    const startTime = new Date();
    let response;
    const client = new OpenAIVendor(llm_model);
    response = await client.main(prompt, dryRun);

    // Capture the end time
    const endTime = new Date();
    const latency: number = Number(endTime) - Number(startTime);
    return generateOutput(response, llmModelType, latency);
  } catch (error) {
    console.log(error);
  }
}

const gpt: PromptDataSchemaType = {
  v: 1,
  p: "openai",
  data: [
    {
      id: uuidv4(),
      role: PromptRoleEnum.enum.SYSTEM,
      content: "you are a smart mathematician",
    },
    {
      id: uuidv4(),
      role: PromptRoleEnum.enum.USER,
      content: `help me with {@Question}`,
    },
  ],
};

const dalle: PromptDataSchemaType = {
  v: 1,
  p: "openai",
  data: [],
};

export const template = {
  "gpt-3.5-turbo": gpt,
  "gpt-4": gpt,
  "dalle-3": dalle,
};
