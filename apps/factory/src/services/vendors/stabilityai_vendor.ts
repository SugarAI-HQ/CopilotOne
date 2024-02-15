import BaseVendor from "~/services/vendors/base_vendor";
import { fakeResponse } from "~/services/llm_response/fake_response";
import KeyManager from "~/services/vendors/keys_manager";
import {
  LlmErrorResponse,
  LlmResponse,
  PerformanceMetrics,
  RunResponse,
  getImageResponseV1,
} from "~/validators/llm_respose";
import { errorCodes } from "./error_handling";

const engine = "stable-diffusion-v1-6";
const model = "text-to-image";
const apiHost = "https://api.stability.ai";

class StabilityAIVendor extends BaseVendor {
  private provider: string;
  private model: string;

  constructor(
    provider: string,
    model: string,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ) {
    super(
      `${apiHost}/v1/generation/${engine}/${model}`,
      maxRetries,
      retryDelay,
    );
    this.provider = provider;
    this.model = model;
  }

  protected createHeaders(): Headers {
    const myHeaders = super.createHeaders();

    // myHeaders.append('Content-Type', 'application/json')
    // myHeaders.append('Accept', 'application/json')
    const tokens: string[] = (process.env.STABILITYAI_API_KEY as string).split(
      ",",
    );

    myHeaders.append(
      "Authorization",
      `Bearer ${new KeyManager(tokens).getCurrentApiKey()}`,
    );

    return myHeaders;
  }

  //   protected createFakeResponse() {
  //     const allowedModels = ["stable-diffusion-v1-5", "openjourney"];

  //     // if (allowedModels.includes(this.model)) {
  //     //   return fakeResponse.stableDiffusionFakeResponse;
  //     // } else if (this.provider === "meta-llama" || this.provider == "mistralai") {
  //     //   return fakeResponse.llama2FakeResponse;
  //     // } else {
  //       throw `Not implemented for ${this.provider}/${this.model}`;
  //     }
  //   }

  protected createRequestOptions(prompt: string): RequestInit {
    return this.createSdxlOptions(prompt);
  }

  protected createSdxlOptions(prompt: string): RequestInit {
    const dimension = 1024;
    return {
      method: "POST",
      headers: this.createHeaders(),
      //   body: JSON.stringify({ input: prompt }),
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
          },
        ],
        steps: 40,
        // seed: 0,
        cfg_scale: 5,
        samples: 1,
        style_preset: "photographic",
        height: dimension,
        width: dimension,
      }),
    };
  }

  protected parseResponse(response: any, latency: number): RunResponse {
    let lr: LlmResponse | null = null;
    let performance: PerformanceMetrics;
    if (response?.artifacts?.length > 0) {
      const image = response.artifacts[0]?.base64;

      lr = getImageResponseV1(`data:image/png;base64,${image}`);

      performance = {
        latency: latency || 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        extra: response.inference_status,
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

    return { response: lr, performance };
  }
}

export default StabilityAIVendor;
