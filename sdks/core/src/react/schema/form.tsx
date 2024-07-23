import { z } from "zod";
import { i18MessageSchema } from "./message";

export const listenConfig = z.object({
  maxAnswerLength: z.number().optional().default(-1),
  userNoSpeechTimeout: z.number().optional().default(30000), // User have not spoken any single word
  // userNoSpeechNudgeAfter: z.number().optional().default(2), // no of retries in case of no speech
  userPauseTimeout: z.number().optional().default(5000), // User is speaking but take a pause in between
});

export type ListenConfig = z.infer<typeof listenConfig>;

export const ListenConfigDefaults = {
  maxAnswerLength: -1,
  userNoSpeechTimeout: 30000, // User have not spoken any single word
  userNoSpeechRetry: 2,
  userPauseTimeout: 5000, // User is speaking but take a pause in between
};

export const formConfig = z.object({
  characterPerSec: z.number().optional().default(40),
  // lang: z.string().optional().default("auto"),
  // defaultLang: z.string().optional().default("en"),
  listen: listenConfig.optional(),
});
export type FormConfig = z.infer<typeof formConfig>;

export const FormConfigDefaults: FormConfig = {
  characterPerSec: 40,

  // maxAnswerLength
  listen: ListenConfigDefaults,
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
  validation: z
    .object({
      max_length: z.number().optional().default(120),
    })
    .passthrough(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const streamingi18TextSchema = z.object({
  message: i18MessageSchema,
  formConfig: formConfig.optional(),
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
