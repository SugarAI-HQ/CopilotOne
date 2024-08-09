import { z } from "zod";
import {
  formMessageType,
  voiceForm,
  i18nMessageSchema,
  languageCode,
} from "@sugar-ai/core";

export const getFormsInput = z.object({});
export type GetFormsInput = z.infer<typeof getFormsInput>;

export const form = z.any();
export type Form = z.infer<typeof form>;

export const transalationWithRules = z
  .string()
  .min(1, {
    message: "must be at least 1 characters long.",
  })
  .max(255, {
    message: "must be at most 30 characters long.",
  });

export type TransalationWithRules = z.infer<typeof transalationWithRules>;

export const langTranslationWithRules = z.record(
  languageCode,
  transalationWithRules,
);

export type LangTranslationWithRules = z.infer<typeof langTranslationWithRules>;
export const i18nMessageWithRules = i18nMessageSchema.extend({
  lang: langTranslationWithRules,
});
export type I18nMessageWithRules = z.infer<typeof i18nMessageWithRules>;

export const formList = z.array(form);
export type FormList = z.infer<typeof formList>;

export const createFormInput = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters long.",
    })
    .max(30, {
      message: "Name must be at most 30 characters long.",
    }),
});
export type CreateFormInput = z.infer<typeof createFormInput>;

export const updateFormInput = createFormInput.extend({
  id: z.string(),
  description: i18nMessageWithRules.passthrough().optional(),
  languages: z.array(z.string()),
  startButtonText: i18nMessageWithRules.passthrough(),

  // messages: z.record(formMessageType, z.string()),
  // formConfig: z.object({}).passthrough(),
});

export type UpdateFormInput = z.infer<typeof updateFormInput>;

export const getFormInput = z.object({
  // userId: z.string().optional(),
  id: z.string(),
});
export type GetFormInput = z.infer<typeof getFormInput>;

export const createSubmission = z.object({
  formId: z.string(),
  clientUserId: z.string(),
});

export type CreateSubmission = z.infer<typeof createSubmission>;

export const createSubmissionResponse = z.object({
  // formId: z.string(),
  // clientUserId: z.string(),
  submissionId: z.string(),
});

export type CreateSubmissionResponse = z.infer<typeof createSubmissionResponse>;

// export const questionAnswerSchema = z.object({
//   questionId: z.string().cuid(),
//   response: z.string(),
// });

export const submitAnswer = z.object({
  formId: z.string(),
  submissionId: z.string(),
  questionId: z.string(),
  answer: z.string(),
  // answers: z.array(questionAnswerSchema),
});
export type SubmitAnswer = z.infer<typeof submitAnswer>;

export const submitAnswerResponse = z.object({
  // submissionId: z.string().cuid(),
  id: z.string(),
});
