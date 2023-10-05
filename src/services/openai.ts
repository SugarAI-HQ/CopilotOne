import OpenAI from "openai";
import { env } from "~/env.mjs";
import memoize from "memoizee";
import { LlmConfigSchema } from "~/validators/prompt_version";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
) {
  // Capture the start time
  const startTime = new Date();

  // const fake_resonse = {
  //   warning:
  //     "This model version is deprecated. Migrate before January 4, 2024 to avoid disruption of service. Learn more https://platform.openai.com/docs/deprecations",
  //   id: "cmpl-7y3qfAWwoy9nQ1JgTrxlC6reNDv8P",
  //   object: "text_completion",
  //   created: 1694548829,
  //   model: "text-davinci-003",
  //   choices: [
  //     {
  //       text: " {@RESPONSE}",
  //       index: 0,
  //       logprobs: null,
  //       finish_reason: "stop",
  //     },
  //   ],
  //   usage: { prompt_tokens: 127, completion_tokens: 7, total_tokens: 134 },
  // };
  // let response = fake_resonse;
  // response = await memoizedCompletion(prompt, llm_model, llmConfig)
  let response = await completion(prompt, llm_model, llmConfig);

  // Capture the end time
  const endTime = new Date();
  const latency: number = Number(endTime) - Number(startTime);

  let res = null;

  if (response?.choices?.length > 0) {
    res = {
      completion: response.choices[0]?.text || "",
      performance: {
        latency: latency,
        ...response.usage,
      },
    };
  }

  return res;
}

const memoizedCompletion = memoize(completion, {
  async: true,
  maxAge: 10 * 60 * 1000,
});

async function completion(
  prompt: string,
  llm_model: string,
  llmConfig: LlmConfigSchema,
): Promise<any> {
  try {
    // Make a call to the OpenAI API
    const response = await openai.completions.create({
      model: llm_model, // Use the desired engine
      prompt: prompt,
      // best_of?: number | null;
      // echo?: boolean | null;
      // frequency_penalty?: number | null;
      // logit_bias?: Record<string, number> | null;
      // logprobs?: number | null;
      max_tokens: llmConfig.maxTokens, // Adjust as needed
      // n?: number | null;
      // presence_penalty?: number | null;
      // stop?: string | null | Array<string>;
      // stream?: boolean | null;
      // suffix?: string | null;
      temperature: llmConfig.temperature,
      // top_p?: number | null;
      // user?: string;
    });

    console.log("response >>>>>>");
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
