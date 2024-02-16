import BaseVendor from "~/services/vendors/base_vendor";
import {
  LlmErrorResponse,
  LlmResponse,
  PerformanceMetrics,
  ResponseType,
  RunResponse,
  getCodeResponseV1,
  getImageResponseV1,
  getTextResponseV1,
  getLlmErrorResponseV1,
} from "~/validators/llm_respose";
import { GPTResponseType } from "~/validators/openaiResponse";
import { errorCodes } from "./error_handling";

const engine = "sdxl1.0-txt2img";

class SegmindVendor extends BaseVendor {
  private provider: string;
  private model: string;

  constructor(
    provider: string,
    model: string,
    maxRetries: number = 3,
    retryDelay: number = 1000,
  ) {
    super(`https://api.segmind.com/v1/${engine}`, maxRetries, retryDelay);
    this.provider = provider;
    this.model = model;
  }

  protected createHeaders(): Headers {
    const myHeaders = super.createHeaders();
    myHeaders.append("x-api-key", process.env.SEGMIND_API_KEY as string);

    return myHeaders;
  }

  protected createRequestOptions(prompt: string): RequestInit {
    return this.createSegMindOptions(prompt);
  }

  protected createSegMindOptions(prompt: string): RequestInit {
    const dimension = 1024;
    return {
      method: "POST",
      headers: this.createHeaders(),
      body: JSON.stringify({
        prompt,
        // negative_prompt:
        //   "ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, extra limbs, disfigured, deformed, body out of frame, blurry, bad anatomy, blurred, watermark, grainy, signature, cut off, draft",
        style: "base",
        samples: 1,
        scheduler: "UniPC",
        num_inference_steps: 25,
        guidance_scale: 8,
        strength: 0.2,
        high_noise_fraction: 0.8,
        seed: 468685,
        img_width: dimension,
        img_height: dimension,
        refiner: true,
        base64: true,
      }),
    };
  }

  protected parseResponse(response: any, latency: number): RunResponse {
    let lr: LlmResponse | null = null;

    try {
      if (response?.image?.length > 0) {
        const image = response.image;

        lr = getImageResponseV1(`data:image/png;base64,${image}`);
      } else {
        throw new SegmindError("Unhandled response format");
      }

      const performance: PerformanceMetrics = {
        latency: latency || 0,
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        extra: response.infer_time,
      };
      return { response: lr, performance };
    } catch (error) {
      if (error instanceof SegmindError) {
        const responseCode = response.status;
        const errorDetails = errorCodes[responseCode];
        const errorResponse: LlmErrorResponse = {
          code: responseCode,
          message: errorDetails?.message || `Unknown Error: ${responseCode}`,
          vendorCode: response.status,
          vendorMessage:
            response.statusText || `Unknown Error: ${responseCode}`,
        };

        lr = getLlmErrorResponseV1(errorResponse);
        return { response: lr, performance: { latency: latency || 0 } };
      } else {
        throw error; // Re-throw other exceptions
      }
    }
  }
}

export default SegmindVendor;

class SegmindError extends Error {
  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = SegmindError.name;
  }
}
