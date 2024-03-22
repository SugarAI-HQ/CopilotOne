import { z } from "zod";

const choices = z.object({
  text: z.string(),
  index: z.number(),
  logprobs: z.null(),
  tool_calls: z.array(z.null()).optional(),
  finish_reason: z.string(),
});

type ChoicesType = z.infer<typeof choices>;

const ChoicesArray = z.array(choices).default([]);

export const gptResponseSchema = z.object({
  warning: z.string(),
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: ChoicesArray,
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
  system_fingerprint: z.null(),
});

export type GPTResponseType = z.infer<typeof gptResponseSchema>;

const dalleSchema = z.object({
  created: z.string(),
  images: z.array(z.string().optional()).default([""]),
  inference_status: z.string(),
});

export type DalleSchemaType = z.infer<typeof dalleSchema>;
