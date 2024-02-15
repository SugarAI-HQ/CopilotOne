import BaseVendor from "~/services/vendors/base_vendor";
import { fetchWithRetry } from "~/services/vendors/base_vendor";
import { logLLMResponse } from "~/utils/log";
import {
  LlmErrorResponse,
  LlmResponse,
  PerformanceMetrics,
  RunResponse,
  getCodeResponseV1,
  getTextResponseV1,
} from "~/validators/llm_respose";
import { GPTResponseType } from "~/validators/openaiResponse";
import { errorCodes } from "./error_handling";
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

  protected parseResponse(response: any, latency: number): RunResponse {
    let lr: LlmResponse | null = null;
    let performance: PerformanceMetrics;
    if (response?.choices?.length > 0) {
      let responseMessage = response?.choices[0];
      lr = getCodeResponseV1(
        responseMessage.text
          ? responseMessage.text
          : responseMessage.message.content,
      );
      performance = {
        latency: latency || 0,
        total_tokens: response.usage.total_tokens,
        prompt_tokens: response.usage.completion_tokens,
        completion_tokens: response.usage.total_tokens,
      };
    } else {
      const responseCode = response.status;
      const errorDetails = errorCodes[responseCode];
      const errorResponse: LlmErrorResponse = {
        code: responseCode,
        message: errorDetails?.message || `Unknown Error: ${responseCode}`,
        vendorCode: response.status,
        vendorMessage: response.statusText || `Unknown Error: ${responseCode}`,
      };

      lr = { data: null, error: errorResponse };
      performance = {};
    }

    return { response: lr, performance: performance };
  }
}

export default XylemVendor;
