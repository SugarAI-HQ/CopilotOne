import BaseVendor from "~/services/vendors/base_vendor";
import { fetchWithRetry } from "~/services/vendors/base_vendor";
import { logLLMResponse } from "~/utils/log";
import { GPTResponseType } from "~/validators/openaiResponse";
class XylemVendor extends BaseVendor {
  private provider: string;
  private model: string;
  private maxRetriesXylem = 3;
  private retryDelayXylem = 1000;
  constructor(
    provider: string,
    model: string,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ) {
    super(
      `https://api.xylem.ai/api/v0/chat/completions`,
      maxRetries,
      retryDelay,
    );
    this.provider = provider;
    this.model = model;
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append(
      "Authorization",
      `Bearer ${process.env.XYLEM_MISTRAL_7B_API_KEY}`,
    );
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
    const requestBody = {
      model: `${this.model}`,
      messages: [...this.parsePromptChat(prompt)],
    };

    return {
      method: "POST",
      headers: this.createHeaders(),
      body: JSON.stringify(requestBody),
    };
  }

  // async makeApiCallWithRetry(
  //   prompt: string,
  //   dryRun: boolean,
  // ): Promise<{ response: Response; latency: number }> {
  //   const requestOptions = this.createRequestOptions(prompt);
  //   const startTime = new Date();

  //   let resp;
  //   if (!dryRun) {
  //     console.log(this.getUrl(), JSON.stringify(requestOptions));
  //     resp = await fetchWithRetry(
  //       this.getUrl(),
  //       requestOptions,
  //       this.maxRetriesXylem,
  //       this.retryDelayXylem,
  //     );
  //   } else {
  //     resp = this.createFakeResponse();
  //   }

  //   const endTime = new Date();
  //   const latency: number = endTime.getTime() - startTime.getTime();
  //   const response = this.createChatResponse(resp);
  //   logLLMResponse(this.constructor.name, response);
  //   return { response, latency };
  // }
}

export default XylemVendor;
