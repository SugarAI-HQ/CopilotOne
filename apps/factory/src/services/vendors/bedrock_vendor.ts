import BaseVendor from "~/services/vendors/base_vendor";
import { fakeResponse } from "~/services/llm_response/fake_response";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";
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

class BedrockVendor extends BaseVendor {
  private bedrockClient: BedrockRuntimeClient;
  private model: string;
  private provider = "bedrock";

  constructor(
    provider: string,
    model: string,
    maxRetries = 3,
    retryDelay = 1000,
  ) {
    super("https://api.aws.com/v1/models", maxRetries, retryDelay);
    this.bedrockClient = new BedrockRuntimeClient({ region: env.AWS_REGION });
    this.provider = provider;
    this.model = getModelIdVersion(provider, model);
    console.log(`model`, this.model); // Output: "meta.llama3-8b-instruct-v1:0"
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", `Bearer ${env.BEDROCK_API_KEY}`);
    return myHeaders;
  }

  protected createFakeResponse() {
    const allowedModels = ["meta.llama3-8b-instruct-v1:0"];
    if (allowedModels.includes(this.model)) {
      // return fakeResponse.bedrockFakeResponse; // Adjust fake response as needed
    } else {
      throw `Not implemented for ${this.provider}/${this.model}`;
    }
  }

  protected createChatResponse(response: any, model: string) {
    // responseText = response.output.message.content[0].text;

    const newResponse: GPTResponseType = {
      warning: "",
      id: response.$metadata.requestId,
      object: "",
      created: 0,
      model: model,
      choices: [
        {
          message: response.output.message.content[0]?.text,
          logprobs: null,
          finish_reason: response.stopReason,
        },
      ],
      usage: response.usage,
      system_fingerprint: null,
    };
    return newResponse;
  }

  protected parsePromptChat(prompt: PromptDataType): MessagesSchema {
    return prompt.filter(
      (item: { id: string; role: string; content: string }) => {
        if (item.role !== "system") {
          return {
            role: item.role,
            content: item.content,
          } as MessageSchema;
        }
      },
    );
  }

  protected async executeLama3(
    prompt: PromptDataType,
    messages: MessagesSchema,
    skills: skillsSchema,
    skillChoice: SkillChoicesType,
    dryRun: boolean,
  ) {
    if (dryRun) {
      return this.createFakeResponse();
    }

    const promptMessages = [...this.parsePromptChat(prompt)];
    const allMessages: any = promptMessages.concat(messages);

    // Create conversation structure expected by the Bedrock Converse API
    const conversation = allMessages.map((msg: MessageSchema) => ({
      role: msg.role,
      content: [{ text: msg.content }],
    }));

    const model = this.model;

    // Create a ConverseCommand with the conversation and config
    const command = new ConverseCommand({
      modelId: model,
      // modelId: "cohere.command-light-text-v14",
      messages: conversation,
      inferenceConfig: { maxTokens: 2048, temperature: 0.5, topP: 0.9 },
    });

    // Send the ConverseCommand and get a response
    try {
      const response = await this.bedrockClient.send(command);

      // const responseText = response.output.message.content[0].text;
      // Log and return the response
      logLLMResponse("bedrock", response);
      const llmResposne = this.createChatResponse(response, model);
      return llmResposne;
    } catch (error) {
      console.error(`Bedrock API request failed: ${error}`);
      return this.createFakeResponse();
    }
  }

  protected async executeDalleModel(prompt: Prompt, dryRun: boolean) {
    // Bedrock does not support DALL-E directly; this method may need to be removed or adapted based on available services.
    const response: DalleSchemaType = {
      created: "",
      images: ["https://example.com/default-image.png"],
      inference_status: "",
    };

    if (dryRun) {
      return response;
    }

    // Implementation for Bedrock's image generation, if available, would go here.

    return response;
  }

  async main(
    prompt: Prompt,
    messages: MessagesSchema,
    skills: skillsSchema,
    skillChoice: SkillChoicesType,
    dryRun: boolean,
  ) {
    const allowedModels = [
      "meta.llama3-8b-instruct-v1:0",
      "cohere.command-light-text-v14",
    ];
    try {
      if (true || allowedModels.includes(this.model)) {
        return this.executeLama3(
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
      console.error("Bedrock API request failed:", error);
      // return this.createFakeResponse();
    }
  }
}

export default BedrockVendor;

function getModelIdVersion(provider, modelName) {
  const model = BEDROCK_MODELS.find(
    (m) =>
      m.provider.toLowerCase() === provider.toLowerCase() &&
      m.modelName.toLowerCase() === modelName.toLowerCase(),
  );

  if (model) {
    return model.modelId;
  } else {
    return `Model not found for provider ${provider} and model name ${modelName}`;
  }
}

export const BEDROCK_MODELS = [
  {
    provider: "AI21 Labs",
    modelName: "Jamba-Instruct",
    modelId: "ai21.jamba-instruct-v1:0",
  },
  {
    provider: "AI21 Labs",
    modelName: "Jurassic-2 Mid",
    modelId: "ai21.j2-mid-v1",
  },
  {
    provider: "AI21 Labs",
    modelName: "Jurassic-2 Ultra",
    modelId: "ai21.j2-ultra-v1",
  },
  {
    provider: "Amazon",
    modelName: "Titan Text G1 - Express",
    modelId: "amazon.titan-text-express-v1",
  },
  {
    provider: "Amazon",
    modelName: "Titan Text G1 - Lite",
    modelId: "amazon.titan-text-lite-v1",
  },
  {
    provider: "Amazon",
    modelName: "Titan Text Premier",
    modelId: "amazon.titan-text-premier-v1:0",
  },
  {
    provider: "Amazon",
    modelName: "Titan Embeddings G1 - Text",
    modelId: "amazon.titan-embed-text-v1",
  },
  {
    provider: "Amazon",
    modelName: "Titan Embedding Text v2",
    modelId: "amazon.titan-embed-text-v2:0",
  },
  {
    provider: "Amazon",
    modelName: "Titan Multimodal Embeddings G1",
    modelId: "amazon.titan-embed-image-v1",
  },
  {
    provider: "Amazon",
    modelName: "Titan Image Generator G1 V1",
    modelId: "amazon.titan-image-generator-v1",
  },
  {
    provider: "Amazon",
    modelName: "Titan Image Generator G1 V2",
    modelId: "amazon.titan-image-generator-v2:0",
  },
  {
    provider: "Anthropic",
    modelName: "Claude",
    modelId: "anthropic.claude-v2",
  },
  {
    provider: "Anthropic",
    modelName: "Claude",
    modelId: "anthropic.claude-v2:1",
  },
  {
    provider: "Anthropic",
    modelName: "Claude 3 Sonnet",
    modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
  },
  {
    provider: "Anthropic",
    modelName: "Claude 3.5 Sonnet",
    modelId: "anthropic.claude-3-5-sonnet-20240620-v1:0",
  },
  {
    provider: "Anthropic",
    modelName: "Claude 3 Haiku",
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
  },
  {
    provider: "Anthropic",
    modelName: "Claude 3 Opus",
    modelId: "anthropic.claude-3-opus-20240229-v1:0",
  },
  {
    provider: "Anthropic",
    modelName: "Claude Instant",
    modelId: "anthropic.claude-instant-v1",
  },
  {
    provider: "Cohere",
    modelName: "Command",
    modelId: "cohere.command-text-v14",
  },
  {
    provider: "Cohere",
    modelName: "Command Light",
    modelId: "cohere.command-light-text-v14",
  },
  {
    provider: "Cohere",
    modelName: "Command R",
    modelId: "cohere.command-r-v1:0",
  },
  {
    provider: "Cohere",
    modelName: "Command R+",
    modelId: "cohere.command-r-plus-v1:0",
  },
  {
    provider: "Cohere",
    modelName: "Embed English",
    modelId: "cohere.embed-english-v3",
  },
  {
    provider: "Cohere",
    modelName: "Embed Multilingual",
    modelId: "cohere.embed-multilingual-v3",
  },
  {
    provider: "Meta",
    modelName: "Llama 2 Chat 13B",
    modelId: "meta.llama2-13b-chat-v1",
  },
  {
    provider: "Meta",
    modelName: "Llama 2 Chat 70B",
    modelId: "meta.llama2-70b-chat-v1",
  },
  {
    provider: "Meta",
    modelName: "8b-instruct",
    modelId: "meta.llama3-8b-instruct-v1:0",
  },
  {
    provider: "Meta",
    modelName: "70b-instruct",
    modelId: "meta.llama3-70b-instruct-v1:0",
  },
  {
    provider: "Meta",
    modelName: "Llama 3.1 8B Instruct",
    modelId: "meta.llama3-1-8b-instruct-v1:0",
  },
  {
    provider: "Meta",
    modelName: "Llama 3.1 70B Instruct",
    modelId: "meta.llama3-1-70b-instruct-v1:0",
  },
  {
    provider: "Meta",
    modelName: "Llama 3.1 405B Instruct",
    modelId: "meta.llama3-1-405b-instruct-v1:0",
  },
  {
    provider: "Mistral AI",
    modelName: "Mistral 7B Instruct",
    modelId: "mistral.mistral-7b-instruct-v0:2",
  },
  {
    provider: "Mistral AI",
    modelName: "Mixtral 8X7B Instruct",
    modelId: "mistral.mixtral-8x7b-instruct-v0:1",
  },
  {
    provider: "Mistral AI",
    modelName: "Mistral Large",
    modelId: "mistral.mistral-large-2402-v1:0",
  },
  {
    provider: "Mistral AI",
    modelName: "Mistral Large 2 (24.07)",
    modelId: "mistral.mistral-large-2407-v1:0",
  },
  {
    provider: "Mistral AI",
    modelName: "Mistral Small",
    modelId: "mistral.mistral-small-2402-v1:0",
  },
  {
    provider: "Stability AI",
    modelName: "Stable Diffusion XL",
    modelId: "stability.stable-diffusion-xl-v0",
  },
  {
    provider: "Stability AI",
    modelName: "Stable Diffusion XL",
    modelId: "stability.stable-diffusion-xl-v1",
  },
  {
    provider: "Stability AI",
    modelName: "Stable Diffusion 3 Large",
    modelId: "stability.sd3-large-v1:0",
  },
  {
    provider: "Stability AI",
    modelName: "Stable Image Ultra",
    modelId: "stability.stable-image-ultra-v1",
  },
  {
    provider: "Stability AI",
    modelName: "Stability Image Core",
    modelId: "stability.stable-image-core-v1",
  },
];
