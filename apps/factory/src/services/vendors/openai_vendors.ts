import BaseVendor from "~/services/vendors/base_vendor";
import { fakeResponse } from "~/services/llm_response/fake_response";
import OpenAI from "openai";
import { env } from "~/env.mjs";
import { GPTResponseType, DalleSchemaType } from "~/validators/openaiResponse";
import { logLLMResponse } from "~/utils/log";
import {
  MessageSchema,
  MessagesSchema,
  skillsSchema,
  SkillChoicesType,
} from "~/validators/service";
import { Message } from "react-hook-form";
import { Prompt, PromptDataType } from "~/validators/prompt_version";

class OpenAIVendor extends BaseVendor {
  private openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  private provider = "openai";
  private model: string;

  constructor(model: string, maxRetries = 3, retryDelay = 1000) {
    super("https://api.openai.com/v1/chat/completions", maxRetries, retryDelay);
    this.model = model;
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${process.env.OPENAI_API_KEY}`);
    return myHeaders;
  }

  protected createFakeResponse() {
    const allowedModels = ["gpt-3.5-turbo", "gpt-4"];
    if (allowedModels.includes(this.model)) {
      return fakeResponse.openAIFakeResponse;
    } else {
      throw `Not implemented for ${this.provider}/${this.model}`;
    }
  }

  protected createChatResponse(response: any) {
    const newResponse: GPTResponseType = {
      warning: "",
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      choices: [
        {
          message: response.choices[0]?.message,
          logprobs: null,
          finish_reason: response.choices[0]?.finish_reason,
        },
      ],
      usage: response.usage,
      system_fingerprint: response.system_fingerprint,
    };
    return newResponse;
  }

  protected parsePromptChat(prompt: PromptDataType): MessagesSchema {
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    // console.log(prompt);
    // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    return prompt.map((item: { id: string; role: string; content: string }) => {
      return {
        role: item.role,
        content: item.content,
      } as MessageSchema;
    });
  }

  protected async executeGptModel(
    prompt: PromptDataType,
    messages: MessagesSchema,
    skills: skillsSchema,
    skillChoice: SkillChoicesType,
    dryRun: boolean,
  ) {
    if (dryRun) {
      return this.createFakeResponse();
    }
    console.log("-------------------------------------------------");
    const promptMessages = [...this.parsePromptChat(prompt)];
    const allMessages: any = promptMessages.concat(messages);
    console.log(`messages: ${JSON.stringify(allMessages)}`);
    console.log(`skills: ${JSON.stringify(skills)}`);
    console.log("-------------------------------------------------");

    const response = await this.openai.chat.completions.create({
      messages: allMessages,
      model: this.model,
      ...(skills.length > 0 && {
        tools: skills,
        tool_choice: skillChoice,
      }),
    });
    return this.createChatResponse(response);
  }
  protected async executeDalleModel(prompt: Prompt, dryRun: boolean) {
    const res = await this.openai.images.generate({
      model: "dall-e-3",
      prompt: prompt as string,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    let response: DalleSchemaType = {
      created: "",
      images: [
        "https://oaidalleapiprodscus.blob.core.windows.net/private/org-EtszQGOwBjuTHl0KBLpY3i5m/user-NXHbJDw87weLt2F0XIpbqqYe/img-kyRHr23SdZaGFXRCB0725bf1.png?st=2024-01-13T14%3A18%3A26Z&se=2024-01-13T16%3A18%3A26Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-01-13T02%3A35%3A10Z&ske=2024-01-14T02%3A35%3A10Z&sks=b&skv=2021-08-06&sig=LSDw8Jas8WIlatxsLhv%2BggD50eXsTos7cC4z3ECTxBk%3D",
      ],
      inference_status: "",
    };

    if (dryRun) {
      return response;
    }

    // response.images[0] = res.data[0]!.url;
    logLLMResponse("openai", res);
    response.images[0] = `data:image/png;base64,${res.data[0]!.b64_json}`;
    return response;
  }

  async main(
    prompt: Prompt,
    messages: MessagesSchema,
    skills: skillsSchema,
    skillChoice: SkillChoicesType,
    dryRun: boolean,
  ) {
    const allowedModels = ["gpt-3.5-turbo", "gpt-4"];
    try {
      if (allowedModels.includes(this.model)) {
        return this.executeGptModel(
          prompt as PromptDataType,
          messages,
          skills,
          skillChoice,
          dryRun,
        );
      } else {
        return this.executeDalleModel(prompt, dryRun);
      }
    } catch (error) {
      console.error("OpenAI API request failed:", error);
      return this.createFakeResponse();
    }
  }
}

export default OpenAIVendor;
