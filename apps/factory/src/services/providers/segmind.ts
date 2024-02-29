import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import SegmindVendor from "../vendors/segmind_vendor";

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
  attachments?: any,
) {
  let client = new SegmindVendor("segmind", "sd1.5-img2img", attachments);
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);

  return lr;
}

const segmind: PromptDataSchemaType = {
  v: 1,
  p: "segmind",
  data: [],
};

export const template = {
  "sd1.5-img2img": segmind,
};

export const defaults = {
  "sd1.5-img2img": {
    url: `${process.env.NEXT_PUBLIC_APP_URL}/images/segmind/portrait.jpg`,
    supportFormatType: [".png", ".jpg"],
    base64: true,
  },
};
