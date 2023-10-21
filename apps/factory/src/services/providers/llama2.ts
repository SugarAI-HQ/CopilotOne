import { LlmConfigSchema } from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { fakeResponse } from "../llm_response/fake_response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";

export interface LLMConfig {
  max_tokens: number;
  temperature: number;
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number,
  retryDelay: number,
) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.error("Request failed:", error);
    }

    retryCount++;
    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return null;
}

export async function run(
  prompt: string,
  llmModel: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  isDevelopment: boolean = false,
) {
  const maxRetries = 3;
  const retryDelay = 1000;

  const startTime = new Date();
  let response;
  if (isDevelopment) {
    response = fakeResponse.llama2FakeResponse;
  } else {
    const apiUrl = `https://api.deepinfra.com/v1/inference/meta-llama/Llama-2-${llmModel}-chat-hf`;
    const requestOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPINFRA_API_TOKEN}`,
      },
      body: JSON.stringify({ input: prompt }),
    };

    response = await fetchWithRetry(
      apiUrl,
      requestOptions,
      maxRetries,
      retryDelay,
    );

    console.log(`llm response -------------- ${JSON.stringify(response)}`);
  }

  const endTime = new Date();
  const latency: number = Number(endTime) - Number(startTime);

  return generateOutput(response, llmModelType, latency);
}
