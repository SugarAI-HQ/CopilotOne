import {
  LlmConfigSchema,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import XylemVendor from "~/services/vendors/xylem_vendor";
import { v4 as uuidv4 } from "uuid";
import { PromptRoleEnum } from "~/validators/base";
import {
  MessagesSchema,
  SkillChoicesType,
  skillsSchema,
} from "~/validators/service";
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
  return runXylem(prompt, llmModelType, llmModel, dryRun);
}

async function runXylem(
  prompt: string,
  llmModelType: ModelTypeType,
  llmModel: string,
  dryRun: boolean,
) {
  const client = new XylemVendor("WizardCoder", llmModel);
  const lr = await client.makeApiCallWithRetry(prompt, dryRun);

  return lr;
}

const WizardCoder_34B: PromptDataSchemaType = {
  v: 1,
  p: "WizardCoder",
  data: [
    {
      id: uuidv4(),
      role: PromptRoleEnum.enum.USER,
      content: `Solve Coding Question {@question}`,
    },
  ],
};

export const template = {
  "WizardCoder-34B": WizardCoder_34B,
};

export const defaults = {
  "WizardCoder-34B": {
    url: "",
    supportFormatType: [],
    base64: false,
  },
};
