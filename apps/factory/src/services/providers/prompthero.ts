import { LlmConfigSchema } from "~/validators/prompt_version";
import { generateOutput } from "../llm_response/response";
import { fetchWithRetry } from "./llama2";
import { fakeResponse } from "../llm_response/fake_response";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";

export interface LLMConfig {
  max_tokens: number;
  temperature: number;
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
    response = fakeResponse.stableDiffusionFakeResponse;
  } else {
    const apiUrl = `https://api.deepinfra.com/v1/inference/prompthero/openjourney`;
    const myHeaders = new Headers();
    myHeaders.append(
      "Authorization",
      `Bearer ${process.env.DEEPINFRA_API_TOKEN}`,
    );
    const formdata = new FormData();
    formdata.append("prompt", `${prompt}`);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    response = await fetchWithRetry(
      apiUrl,
      requestOptions,
      maxRetries,
      retryDelay,
    );

    console.log(
      `prompthero response -------------- ${JSON.stringify(response)}`,
    );
  }

  const endTime = new Date();
  const latency: number = Number(endTime) - Number(startTime);

  return generateOutput(response, llmModelType, latency);
}
