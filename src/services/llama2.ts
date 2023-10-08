import { LlmConfigSchema } from "~/validators/prompt_version";
import { fakeResponse, generateOutput } from "./llm_response";

export interface LLMConfig {
  max_tokens: number;
  temperature: number;
}



export function run(
  prompt: string,
  llm_model: string,
  llmConfig: LlmConfigSchema,
  isDevelopment: boolean = false
) {

  const startTime = new Date();
  let response
  if (isDevelopment) {
    response = fakeResponse;
  } else {
    response = fakeResponse;
  }
  const endTime = new Date();
  const latency: number = Number(endTime) - Number(startTime);


  return generateOutput(response)

}


