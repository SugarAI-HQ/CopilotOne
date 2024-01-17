import { LlmConfigSchema } from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import OpenAIVendor from "~/services/vendors/openai_vendors";

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

export async function openaiRun(
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
