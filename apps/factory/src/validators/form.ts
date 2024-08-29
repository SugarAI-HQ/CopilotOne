import { z, ZodType } from "zod";
import {
  formMessages,
  formMessageType,
  i18nMessageSchema,
  languageCode,
  questionAnswer,
  questionSchema,
} from "@sugar-ai/core";
import { JsonValue, JsonValueType } from "~/generated/prisma-client-zod.ts";

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

  messages: formMessages,
  // formConfig: z.object({}).passthrough(),
});

export type UpdateFormInput = z.infer<typeof updateFormInput>;

export const getFormInput = z.object({
  // userId: z.string().optional(),
  formId: z.string(),
});
export type GetFormInput = z.infer<typeof getFormInput>;

export const metadata = JsonValue;

export const createSubmission = z.object({
  formId: z.string(),
  clientUserId: z.string(),
  metadata: metadata,
});

export type CreateSubmission = z.infer<typeof createSubmission>;

export const createSubmissionResponse = z.object({
  // formId: z.string(),
  // clientUserId: z.string(),
  submissionId: z.string(),
});

export type CreateSubmissionResponse = z.infer<typeof createSubmissionResponse>;

export const completeSubmissionInput = z.object({
  formId: z.string(),
  submissionId: z.string(),
});

export type CompleteSubmissionInput = z.infer<typeof completeSubmissionInput>;

export const completeSubmissionResponse = z.object({
  submissionId: z.string(),
  message: z.string(),
});

export type CompleteSubmissionResponse = z.infer<
  typeof completeSubmissionResponse
>;

export const submitAnswer = z.object({
  clientUserId: z.string(),
  formId: z.string(),
  submissionId: z.string(),
  questionId: z.string(),
  answer: questionAnswer,
  metadata: metadata,
  // answers: z.array(questionAnswerSchema),
});
export type SubmitAnswer = z.infer<typeof submitAnswer>;

export const submitAnswerResponse = z.object({
  // submissionId: z.string().cuid(),
  id: z.string(),
});

export const getAnswersInput = z.object({
  formId: z.string(),
  submissionId: z.string(),
});
export type GetAnswersInput = z.infer<typeof getAnswersInput>;

export const getSubmissionsInput = z.object({ formId: z.string() });
export type GetSubmissionsInput = z.infer<typeof getSubmissionsInput>;

export const getSubmissionsResponse = z.any();
export type GetSubmissionsResponse = z.infer<typeof getSubmissionsResponse>;

export const submittedAnswer = z.object({
  questionId: z.string(),
  answer: z.any(),
  metadata: metadata,
  updatedAt: z.date(),
  createdAt: z.date(),
});

export type SubmittedAnswer = z.infer<typeof submittedAnswer>;

export const getSubmissionResponse = z.object({
  id: z.string(),
  formId: z.string(),
  userId: z.string(),
  clientUserId: z.string(),
  metadata: metadata,
  submittedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  answers: z.array(submittedAnswer),
});
export type GetSubmissionResponse = z.infer<typeof getSubmissionResponse>;

/**
 * Utility function to parse and validate Prisma JSONB data.
 * @param rawData - The raw JSONB data from the Prisma database.
 * @param schema - The Zod schema to validate the data against.
 * @returns - Parsed and validated data according to the provided Zod schema.
 * @throws - Will throw an error if the data does not match the schema.
 */
export function parsePrismaJsonb<T extends ZodType<any, any>>(
  rawData: any,
  schema: T,
): z.infer<T> {
  const preprocessDates = (data: any) => {
    if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          if (
            typeof data[key] === "string" &&
            /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/.test(data[key])
          ) {
            data[key] = new Date(data[key]);
          } else if (typeof data[key] === "object") {
            preprocessDates(data[key]);
          }
        }
      }
    }
  };

  preprocessDates(rawData);

  return schema.parse(rawData);
}

// Input schema for bulk question creation or update
export const createOrUpdateQuestionsInput = z.object({
  formId: z.string(),
  questions: z.array(questionSchema),
});

// Input schema for bulk question creation or update
export const createOrUpdateQuestionsResponse = z.array(questionSchema);

export const updateQuestionOrderInput = z.object({
  formId: z.string(),
  orderedQuestions: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    }),
  ),
});

export type UpdateQuestionOrderInput = z.infer<typeof updateQuestionOrderInput>;
