import BaseVendor from "./base_vendor";
import OpenAI from "openai";
import { env } from "~/env.mjs";
import { fakeResponse } from "../llm_response/fake_response";
import { GPTResponseType } from "~/validators/openaiResponse";
import { LlmConfigSchema } from "~/validators/prompt_version";

class XylemVendor extends BaseVendor {
  private openaiMistral = new OpenAI({
    apiKey: env.Mistral_7B_API_KEY,
    baseURL: "https://api.xylem.ai/api/v0",
  });
  private openaiWizard = new OpenAI({
    apiKey: env.WizardCoder_34B_API_KEY,
    baseURL: "https://api.xylem.ai/api/v0",
  });

  private provider = "xylem";
  private model;
  private llmConfig;
  constructor(
    model: string,
    llmConfig: LlmConfigSchema,
    maxRetries = 3,
    retryDelay = 1000,
  ) {
    super("", maxRetries, retryDelay);
    this.model = model;
    this.llmConfig = llmConfig;
  }

  private createWizardCoder_34BResponse = (response: any) => {
    return "";
  };

  private executeMistral_7B = async (prompt: string, dryRun: boolean) => {
    if (dryRun) {
      return fakeResponse.openAIFakeResponse;
    }
    try {
      // let message =[...this.parsePromptChat(prompt)]
      // let message = this.parsePromptChat(prompt).filter((item: { id: string; role: string; content: string })=>item.role!=="system")
      // console.log("--------------------------------MEssagE")
      // console.log(message)
      // console.log("--------------------------------MEssagE")
      const response = await this.openaiMistral.chat.completions.create({
        messages: [...this.parsePromptChat(prompt)],
        model: this.model,
        max_tokens: this.llmConfig.maxTokens,
        temperature: this.llmConfig.temperature,
      });
      // console.log("--------------------------RESPONSE-----------------")
      // console.log(response.choices)
      // console.log("--------------------------RESPONSE-----------------")
      return this.createChatResponse(response);
    } catch (error) {
      console.log(error);
    }
  };
  private executeWizardCoder_34B = async (prompt: string, dryRun: boolean) => {
    const response = await this.openaiWizard.completions.create({
      model: "WizardCoder-34B",
      prompt: prompt,
      max_tokens: this.llmConfig.maxTokens,
      temperature: this.llmConfig.temperature,
    });
    // console.log("--------------------------RESPONSE-----------------")
    // console.log(response.choices)
    // console.log("--------------------------RESPONSE-----------------")
    return response;
  };
  async main(prompt: string, dryRun: boolean) {
    try {
      if (this.model === "Mistral-7B") {
        return this.executeMistral_7B(prompt, dryRun);
      } else {
        return this.executeWizardCoder_34B(prompt, dryRun);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

export default XylemVendor;
