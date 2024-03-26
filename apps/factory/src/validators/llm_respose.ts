import { z, ZodError } from "zod";

export enum ResponseType {
  TEXT = 1,
  IMAGE = 2,
  CODE = 3,
  VIDEO = 4,
}

export const llmLlmErrorResponseSchema = z.object({
  code: z.number(),
  message: z.string().nullable(),
  vendorCode: z.number().nullable(),
  vendorMessage: z.string().nullable(),
});

export const textResponseV1 = z.object({
  completion: z.string(),
  v: z.number(),
  t: z.literal(ResponseType.TEXT),
});

export const textResponseV2 = z.object({
  completion: z.record(z.any()),
  v: z.number(),
  t: z.literal(ResponseType.TEXT),
});

export const imageResponseV1 = z.object({
  base64: z.string(),
  v: z.number(),
  t: z.literal(ResponseType.IMAGE),
});

export const imageResponseV2 = z.object({
  url: z.string().url(),
  v: z.number(),
  t: z.literal(ResponseType.IMAGE),
});

export const codeResponseV1 = z.object({
  completion: z.string(),
  v: z.number(),
  t: z.literal(ResponseType.CODE),
});

export const llmResponseDataSchema = z
  .union([
    textResponseV1,
    textResponseV2,
    imageResponseV1,
    imageResponseV2,
    codeResponseV1,
  ])
  .transform((data) => {
    if (data.t === ResponseType.TEXT && data.v === 1) {
      return { ...textResponseV1.parse(data), v: 1 };
    } else if (data.t === ResponseType.TEXT && data.v === 2) {
      return { ...textResponseV2.parse(data), v: 2 };
    } else if (data.t === ResponseType.IMAGE && data.v === 1) {
      return { ...imageResponseV1.parse(data), v: 1 };
    } else if (data.t === ResponseType.IMAGE && data.v === 2) {
      return { ...imageResponseV2.parse(data), v: 2 };
    } else if (data.t === ResponseType.CODE) {
      return { ...codeResponseV1.parse(data), v: 1 };
    } else {
      throw new Error("Invalid response type");
    }
  });

export const llmResponseSchema = z.object({
  data: llmResponseDataSchema.nullable(),
  error: llmLlmErrorResponseSchema.nullable(),
});

export const performanceMetrics = z.object({});

export const runResponseSchema = z.object({
  response: llmResponseSchema.nullable(),
  performance: performanceMetrics.nullable(),
});

export const getLlmErrorResponseV1 = function (
  errorResponse: LlmErrorResponse,
): LlmResponse {
  return {
    data: null,
    error: errorResponse,
  };
};

export const getTextResponseV1 = function (text: string): LlmResponse {
  return {
    data: {
      completion: text || "",
      v: 1,
      t: ResponseType.TEXT,
    },
    error: null,
  };
};

export const getTextResponseV2 = function (choices = []): LlmResponse {
  return {
    data: {
      completion: choices || [],
      v: 2,
      t: ResponseType.TEXT,
    },
    error: null,
  };
};

export const getCodeResponseV1 = function (text: string): LlmResponse {
  return {
    data: {
      completion: text || "",
      v: 1,
      t: ResponseType.CODE,
    },
    error: null,
  };
};

export const getImageResponseV1 = function (base64: string): LlmResponse {
  return {
    data: {
      base64: base64 || "",
      v: 1,
      t: ResponseType.IMAGE,
    },
    error: null,
  };
};

export const getImageResponseV2 = function (url: string): LlmResponse {
  return {
    data: {
      url: url,
      v: 2,
      t: ResponseType.IMAGE,
    },
    error: null,
  };
};

// TODO:
export const getCompletionResponse = function (data: any): string {
  return data?.completion ?? data?.base64 ?? data?.url ?? "";
};

export const processLlmResponse = (
  llmResponse: LlmResponse,
): string | null | TextResponseV2["completion"] => {
  if (!llmResponse || Object.keys(llmResponse).length === 0) {
    return null;
  }
  const lr = llmResponseSchema.parse(llmResponse);
  if (lr?.data) {
    if (lr.data.t == ResponseType.TEXT) {
      if (lr.data.v == 1) {
        return lr.data.completion;
      }
      if (lr.data.v == 2) {
        return lr.data.completion;
      }
    }
    if (lr.data.t == ResponseType.CODE) {
      return lr.data.completion;
    }
    if (lr.data.t == ResponseType.IMAGE) {
      if (lr.data.v == 2) {
        return (lr.data as ImageResponseV2).url;
      }
      if (lr.data.v == 1) {
        return (lr.data as ImageResponseV1).base64;
      }
    }
  }

  return null;
};

export const textResponseVersion = z.union([textResponseV1, textResponseV2]);

export type LlmErrorResponse = z.infer<typeof llmLlmErrorResponseSchema>;
export type LlmResponse = z.infer<typeof llmResponseSchema>;
export type RunResponse = z.infer<typeof runResponseSchema>;
export type PerformanceMetrics = z.infer<typeof performanceMetrics>;
export type TextResponseV1 = z.infer<typeof textResponseV1>;
export type TextResponseV2 = z.infer<typeof textResponseV2>;
export type CodeResponseV1 = z.infer<typeof codeResponseV1>;
export type ImageResponseV1 = z.infer<typeof imageResponseV1>;
export type ImageResponseV2 = z.infer<typeof imageResponseV2>;
export type TextResponseVersion = z.infer<typeof textResponseVersion>;
// export type LlmResponseData = z.infer<typeof llmResponseDataSchema>;
