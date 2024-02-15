import { GPTResponseType } from "~/validators/openaiResponse";
import { fakeResponse } from "../llm_response/fake_response";
import { logLLMResponse, truncateObj } from "~/utils/log";
import { RunResponse } from "~/validators/llm_respose";

class BaseVendor {
  private endpoint: string;
  private maxRetries: number;
  private retryDelay: number;

  constructor(
    endpoint: string,
    maxRetries: number = 1,
    retryDelay: number = 1000,
  ) {
    this.endpoint = endpoint;
    this.maxRetries = maxRetries;
    this.retryDelay = retryDelay;
  }

  protected getUrl(): string {
    return this.endpoint;
  }

  protected createHeaders(): Headers {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "application/json");
    return myHeaders;
  }

  protected parseResponse(response: any, latency: number): RunResponse {
    throw "To be implemented";
  }

  protected createRequestOptions(prompt: string): RequestInit {
    const formdata = new FormData();
    formdata.append("prompt", `${prompt}`);

    return {
      method: "POST",
      headers: this.createHeaders(),
      body: formdata,
      redirect: "follow",
    };
  }

  protected createFakeResponse() {
    throw "To be implemented";
  }

  async makeApiCallWithRetry(
    prompt: string,
    dryRun: boolean,
  ): Promise<RunResponse> {
    const requestOptions = this.createRequestOptions(prompt);
    const startTime = new Date();
    let response;
    if (!dryRun) {
      console.log(this.getUrl(), JSON.stringify(requestOptions));
      const fetchResult = await fetchWithRetry(
        this.getUrl(),
        requestOptions,
        this.maxRetries,
        this.retryDelay,
      );

      response = fetchResult;
    } else {
      response = this.createFakeResponse();
    }

    const endTime = new Date();
    const latency: number = endTime.getTime() - startTime.getTime();

    const rr = this.parseResponse(response, latency);
    logLLMResponse(this.constructor.name, rr.response);

    return rr;
  }
}

export async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number,
  retryDelay: number,
) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response.json();
      } else {
        console.error(
          `Status ${response.status} ${response.statusText}: ${JSON.stringify(
            await truncateObj(response.text()),
          )}`,
        );
        return response;
      }
    } catch (error) {
      console.error(`Request failed: ${url}`, error);
    }

    retryCount++;
    if (retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return null;
}

export default BaseVendor;
