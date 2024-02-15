import BaseVendor from "~/services/vendors/base_vendor";
import { fakeResponse } from "~/services/llm_response/fake_response";
import KeyManager from "~/services/vendors/keys_manager";
import {
  LlmResponse,
  PerformanceMetrics,
  getTextResponseV1,
  getImageResponseV1,
  RunResponse,
  getLlmErrorResponseV1,
} from "~/validators/llm_respose";
import { LlmErrorResponse, errorCodes } from "./error_handling";

class DeepInfraVendor extends BaseVendor {
  private provider: string;
  private model: string;

  constructor(
    provider: string,
    model: string,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ) {
    super(
      `https://api.deepinfra.com/v1/inference/${provider}/${model}`,
      maxRetries,
      retryDelay,
    );
    this.provider = provider;
    this.model = model;
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    const tokens: string[] = (process.env.DEEPINFRA_API_TOKEN as string).split(
      ",",
    );

    myHeaders.append(
      "Authorization",
      `Bearer ${new KeyManager(tokens).getCurrentApiKey()}`,
    );
    return myHeaders;
  }

  protected createFakeResponse() {
    const allowedModels = ["stable-diffusion-v1-5", "openjourney"];

    if (allowedModels.includes(this.model)) {
      return fakeResponse.stableDiffusionFakeResponse;
    } else if (this.provider === "meta-llama" || this.provider == "mistralai") {
      return fakeResponse.llama2FakeResponse;
    } else {
      throw `Not implemented for ${this.provider}/${this.model}`;
    }
  }

  protected createRequestOptions(prompt: string): RequestInit {
    if (this.provider === "meta-llama" || this.provider == "mistralai") {
      return this.createLlama2RequestOptions(prompt);
    } else {
      return super.createRequestOptions(prompt);
    }
  }

  protected createLlama2RequestOptions(prompt: string): RequestInit {
    return {
      method: "POST",
      headers: this.createHeaders(),
      body: JSON.stringify({ input: prompt }),
    };
  }

  protected parseResponse(response: any, latency: number): RunResponse {
    let lr: LlmResponse | null = null;
    try {
      if (response?.results?.length > 0) {
        lr = getTextResponseV1(response.results[0]?.generated_text);
      } else if (response?.images?.length > 0) {
        lr = getImageResponseV1(response.images[0]);
      } else {
        throw new DeepInfraError("Unhandled response format");
      }

      const performance: PerformanceMetrics = {
        latency: latency || 0,
        total_tokens:
          (response.num_input_tokens || 0) + (response.num_tokens || 0),
        prompt_tokens: response.num_input_tokens || 0,
        completion_tokens: response.num_tokens || 0,
      };

      return { response: lr, performance };
    } catch (error) {
      if (error instanceof DeepInfraError) {
        const responseCode = response?.status || 500;
        const errorDetails = errorCodes[responseCode];
        const errorMessage = error.message || "Unknown error";
        const errorResponse: LlmErrorResponse = {
          code: responseCode,
          message: errorDetails?.message || errorMessage,
          vendorCode: responseCode,
          vendorMessage: errorDetails?.message || errorMessage,
        };

        lr = getLlmErrorResponseV1(errorResponse);

        return { response: lr, performance: { latency: latency || 0 } };
      } else {
        throw error; // Re-throw other exceptions
      }
    }
  }
}

export default DeepInfraVendor;

class DeepInfraError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = DeepInfraError.name;
  }
}
