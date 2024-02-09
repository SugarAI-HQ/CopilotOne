import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";

export function generateOutput(
  response: any,
  llmModelType: ModelTypeType,
  latency: number,
) {
  if (llmModelType !== ModelTypeSchema.Enum.TEXT2IMAGE) {
    if (response?.choices?.length > 0) {
      return {
        completion: response.choices[0]?.text || "",
        performance: {
          latency: latency || 0,
          ...response.usage,
        },
      };
    } else if (response?.results?.length > 0) {
      return {
        completion: response.results[0].generated_text || "",
        performance: {
          latency: latency || 0,
          total_tokens: response.num_input_tokens + response.num_tokens,
          prompt_tokens: response.num_input_tokens,
          completion_tokens: response.num_tokens,
        },
      };
    }
  } else {
    if (response?.images?.length > 0) {
      return {
        completion: response.images[0] || "",
        performance: {
          latency: latency || 0,
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          extra: response.inference_status,
        },
      };
    }

    if (response?.artifacts?.length > 0) {
      const image = response.artifacts[0]?.base64;
      return {
        completion: `data:image/png;base64,${image}`,
        performance: {
          latency: latency || 0,
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          extra: response.inference_status,
        },
      };
    }

    // Stability AI
    if (response?.output) {
      return {
        completion: response.output[0],
        performance: {
          latency: latency || 0,
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
          extra: response.inference_status,
        },
      };
    }
  }
  return null;
}
