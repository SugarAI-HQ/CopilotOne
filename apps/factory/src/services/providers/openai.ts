/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import OpenAIVendor from "~/services/vendors/openai_vendors";
import { v4 as uuidv4 } from "uuid";
import { PromptRoleEnum } from "~/validators/base";
import { errorCodes, LlmErrorResponse } from "../vendors/error_handling";

import {
  RunResponse,
  getTextResponseV1,
  getImageResponseV1,
  LlmResponse,
  getTextResponseV2,
} from "~/validators/llm_respose";
import {
  MessagesSchema,
  SkillChoicesType,
  skillsSchema,
} from "~/validators/service";

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
  messages: MessagesSchema,
  skills: skillsSchema,
  skillChoice: SkillChoicesType,
  llm_model: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  dryRun: boolean = false,
): Promise<RunResponse> {
  try {
    // Capture the start time
    const startTime = new Date();
    let response: any;
    const client = new OpenAIVendor(llm_model);
    response = await client.main(prompt, messages, skills, skillChoice, dryRun);

    // Capture the end time
    const endTime = new Date();
    const latency: number = Number(endTime) - Number(startTime);
    let lr: LlmResponse | null = null;
    if (llmModelType !== ModelTypeSchema.Enum.TEXT2IMAGE) {
      if (response?.choices?.length > 0) {
        if (response?.choices[0]?.text) {
          lr = getTextResponseV1(response?.choices[0]?.text);
        } else {
          lr = getTextResponseV2(response?.choices);
        }
      }
    } else {
      if (response?.images?.length > 0) {
        lr = getImageResponseV1(response?.images[0]);
      }
    }
    return {
      response: lr,
      performance: { latency: latency || 0, ...response?.usage },
    };
  } catch (error: any) {
    console.log(error);
    const responseCode = error?.status;
    const errorDetails = errorCodes[responseCode];
    const errorResponse: LlmErrorResponse = {
      code: parseInt(responseCode),
      message: errorDetails?.message || `Unknown Error: ${responseCode}`,
      vendorCode: error?.status,
      vendorMessage: error?.error?.message || `Unknown Error: ${responseCode}`,
    };
    return {
      response: { data: null, error: errorResponse },
      performance: {},
    };
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

export const defaults = {
  "gpt-3.5-turbo": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
  "gpt-4": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
  "dalle-3": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
};
