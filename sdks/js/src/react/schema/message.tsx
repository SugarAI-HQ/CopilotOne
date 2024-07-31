import { z } from "zod";
import { languageCode } from "@sugar-ai/core";

export const langTranslation = z.record(languageCode, z.string());
export type LangTranslation = z.infer<typeof langTranslation>;

export const translations = z.record(z.string(), langTranslation);
export type Translations = z.infer<typeof translations>;

export const i18nMessageSchema = z.object({
  mode: z.enum(["manual", "ai"]).optional().default("manual"),
  lang: langTranslation,
  // lang: z.object({
  //   en: z.string(),
  //   hi: z.string(),
  // }),
  voice: z.boolean(),
  output: z.enum(["none", "answer"]).optional().default("none"),
});

export type i18nMessage = z.infer<typeof i18nMessageSchema>;
