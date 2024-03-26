import type { LlmConfigSchema, Prompt } from "~/validators/prompt_version";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { getProvider } from "~/services/providers";
import {
  MessagesSchema,
  SkillChoicesType,
  skillsSchema,
} from "~/validators/service";

type LlmGatewayProps = {
  prompt: Prompt;
  messages: MessagesSchema;
  skills: skillsSchema;
  skillChoice: SkillChoicesType;
  llmModel: string;
  llmProvider: string;
  llmConfig: LlmConfigSchema;
  llmModelType: ModelTypeType;
  isDevelopment?: boolean;
  attachments?: any;
};

export async function LlmGateway({
  prompt,
  messages,
  skills,
  skillChoice,
  llmModel,
  llmProvider,
  llmConfig,
  llmModelType,
  isDevelopment = false,
  attachments,
}: LlmGatewayProps) {
  console.log(`provider >>>> ${llmProvider}`);
  const provider = getProvider(llmProvider);

  const output = await provider(
    prompt,
    messages,
    skills,
    skillChoice,
    llmModel,
    llmConfig,
    llmModelType,
    isDevelopment,
    attachments,
  );
  return output;
}
