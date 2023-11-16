import BaseVendor from "~/services/vendors/base_vendor";
import { fakeResponse } from "~/services/llm_response/fake_response";
import KeyManager from "~/services/vendors/keys_manager";

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
    } else if (this.provider === "meta-llama") {
      return fakeResponse.llama2FakeResponse;
    } else {
      throw `Not implemented for ${this.provider}/${this.model}`;
    }
  }

  protected createRequestOptions(prompt: string): RequestInit {
    if (this.provider === "meta-llama") {
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
}

export default DeepInfraVendor;
