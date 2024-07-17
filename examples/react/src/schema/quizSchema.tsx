import { z } from "zod";

export const voiceConfig = z.object({
  characterPerSec: z.number().optional().default(40),
  lang: z.string().optional().default("auto"),
  defaultLang: z.string().optional().default("en"),
});
export type VoiceConfig = z.infer<typeof voiceConfig>;

export const VoiceConfigDefault = {
  characterPerSec: 40,
  lang: "auto",
  defaultLang: "en",
};

export const i18MessageSchema = z.object({
  mode: z.enum(["manual", "ai"]).optional().default("manual"),
  lang: z.object({
    en: z.string(),
    hi: z.string(),
  }),
  voice: z.boolean().optional().default(true),
  output: z.enum(["none", "answer"]).optional().default("none"),
});
export type i18Message = z.infer<typeof i18MessageSchema>;

export const QuestionSchema = z.object({
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
});
export type Streamingi18TextProps = z.infer<typeof streamingi18TextSchema>;

// Define the Streamingi18TextRef schema
export const StreamingTextRefSchema = z.object({
  startStreaming: z.function().returns(z.void()),
  focusElement: z.function().returns(z.void()),
});

// Define the TypeScript type based on the Zod schema
export type Streamingi18TextRef = z.infer<typeof StreamingTextRefSchema>;
