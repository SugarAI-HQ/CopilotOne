import BaseVendor from "~/services/vendors/base_vendor";
import { fetchWithRetry } from "~/services/vendors/base_vendor";
import { logLLMResponse } from "~/utils/log";
import { GPTResponseType } from "~/validators/openaiResponse";
class XylemVendor extends BaseVendor {
  private provider: string;
  private model: string;

  constructor(
    provider: string,
    model: string,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ) {
    const xylemEndPoint = "https://api.xylem.ai/api/v0";
    super(
      provider === "WizardCoder"
        ? `${xylemEndPoint}/completions`
        : `${xylemEndPoint}/chat/completions`,
      maxRetries,
      retryDelay,
    );

    this.provider = provider;
    this.model = model;
  }

  protected createHeaders(): Headers {
    const token =
      this.provider === "WizardCoder"
        ? process.env.XYLEM_WIZARDCODER_34B_API_KEY
        : process.env.XYLEM_MISTRAL_7B_API_KEY;
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    return myHeaders;
  }

  public createChatResponse(response: any) {
    const newResponse: GPTResponseType = {
      warning: "",
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      choices: [
        {
          index: 0,
          text: response.choices["0"]?.message.content,
          logprobs: null,
          finish_reason: "stop",
        },
      ],
      usage: response.usage,
      system_fingerprint: response.system_fingerprint,
    };
    return newResponse;
  }
  protected parsePromptChat(prompt: string) {
    return JSON.parse(prompt).map(
      (item: { id: string; role: string; content: string }) => {
        return {
          role: item.role,
          content: item.content,
        };
      },
    );
  }

  protected createRequestOptions(prompt: string): RequestInit {
    let requestBody;

    if (this.provider === "WizardCoder") {
      requestBody = {
        model: `${this.model}`,
        prompt: prompt,
      };
    } else {
      requestBody = {
        model: `${this.model}`,
        messages: [...this.parsePromptChat(prompt)],
      };
    }

    return {
      method: "POST",
      headers: this.createHeaders(),
      body: JSON.stringify(requestBody),
    };
  }
}

export default XylemVendor;
