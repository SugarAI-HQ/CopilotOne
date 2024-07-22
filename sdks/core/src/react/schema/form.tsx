import { z } from "zod";
import { i18MessageSchema } from "./message";

export const voiceConfig = z.object({
  characterPerSec: z.number().optional().default(40),
  // lang: z.string().optional().default("auto"),
  // defaultLang: z.string().optional().default("en"),
});
export type VoiceConfig = z.infer<typeof voiceConfig>;

export const VoiceConfigDefault: VoiceConfig = {
  characterPerSec: 40,
  // lang: "auto",
  // defaultLang: "en",
};

export const QuestionSchema = z.object({
  id: z.string(),
  question_type: z.enum(["multiple_choice", "single_choice", "text", "number"]),
  question_text: i18MessageSchema,
  question_params: z
    .object({
      options: z.array(i18MessageSchema).optional(),
    })
    .passthrough(),
  validation: z.object({}).passthrough(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const streamingi18TextSchema = z.object({
  message: i18MessageSchema,
  voiceConfig: voiceConfig.optional(),
  // beforeSpeak: z.function().optional(),
  // afterSpeak: z.function().optional(),
  beforeSpeak: z.function().args().returns(z.promise(z.any())).optional(),
  afterSpeak: z.function().args().returns(z.promise(z.any())).optional(),
});
export type Streamingi18TextProps = z.infer<typeof streamingi18TextSchema>;

// Define the Streamingi18TextRef schema
export const StreamingTextRefSchema = z.object({
  startStreaming: z.function().returns(z.void()),
  focusElement: z.function().returns(z.void()),
});

// Define the TypeScript type based on the Zod schema
export type Streamingi18TextRef = z.infer<typeof StreamingTextRefSchema>;

export const evaluationResponse = z.object({
  answer: z.string(),
  followupQuestion: z.string().nullable(),
});

export type EvaluationResponse = z.infer<typeof evaluationResponse>;

export const voiceFormStates = z.enum([
  "none",
  "listening",
  "evaluating",
  "speaking",
  "waiting",
]);
export type VoiceFormStates = z.infer<typeof voiceFormStates>;
