import { z } from "zod";
import { languageCode } from "~/schema/lang";

export const i18MessageSchema = z.object({
  mode: z.enum(["manual", "ai"]).optional().default("manual"),
  lang: z.record(languageCode, z.string()),
  // lang: z.object({
  //   en: z.string(),
  //   hi: z.string(),
  // }),
  voice: z.boolean().optional().default(true),
  output: z.enum(["none", "answer"]).optional().default("none"),
});

export type i18Message = z.infer<typeof i18MessageSchema>;
