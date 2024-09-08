import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import DeepInfraVendor from "../vendors/deepinfra_vendor";
import BedrockVendor from "../vendors/bedrock_vendor";
import { PromptRoleEnum } from "~/validators/base";
import { v4 as uuidv4 } from "uuid";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import {
  RunResponse,
  getTextResponseV1,
  getImageResponseV1,
  LlmResponse,
  getTextResponseV2,
} from "~/validators/llm_respose";

export interface LLMConfig {
  max_tokens: number;
  temperature: number;
}

export async function run(
  prompt: string,
  messages: MessagesSchema,
  skills: skillsSchema,
  skillChoice: SkillChoicesType,
  llmModel: string,
  llmConfig: LlmConfigSchema,
  llmModelType: ModelTypeType,
  dryRun: boolean = false,
) {
  const startTime = new Date();
  let response: any;
  let client = new BedrockVendor("meta", llmModel);
  // Capture the end time
  const endTime = new Date();
  const latency: number = Number(endTime) - Number(startTime);
  let lr: LlmResponse | null = null;

  response = await client.main(prompt, messages, skills, skillChoice, dryRun);
  // const lr = await client.makeApiCallWithRetry(prompt, dryRun);

  debugger;
  if (llmModelType == ModelTypeSchema.Enum.TEXT2TEXT) {
    if (response?.choices?.length > 0) {
      if (response?.choices[0]?.text) {
        lr = getTextResponseV1(response?.choices[0]?.text);
      } else {
        lr = getTextResponseV2(response?.choices);
      }
    }
  }

  return {
    response: lr,
    performance: { latency: latency || 0, ...response?.usage },
  };
}

const b_7_13_70: PromptDataSchemaType = {
  v: 1,
  p: "llama3",
  data: [
    {
      id: uuidv4(),
      role: PromptRoleEnum.enum.USER,
      content: `help me with {@Question}`,
    },
  ],
};

export const template = {
  "7b": b_7_13_70,
  "13b": b_7_13_70,
  "70b": b_7_13_70,
};

export const defaults = {
  "7b": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
  "13b": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
  "70b": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
};
