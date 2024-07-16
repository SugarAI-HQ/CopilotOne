import { z } from "zod";

const MessageSchema = z.object({
  mode: z.enum(["manual", "ai"]),
  lang: z.object({
    en: z.string(),
    hi: z.string(),
  }),
  voice: z.boolean(),
  output: z.enum(["none", "answer"]),
});

const QuestionSchema = z.object({
  question_type: z.enum(["multiple_choice", "single_choice", "text", "number"]),
  question_text: MessageSchema,
  question_params: z.object({}).passthrough(),
  validation: z.object({}).passthrough(),
});

type Message = z.infer<typeof MessageSchema>;
type Question = z.infer<typeof QuestionSchema>;
