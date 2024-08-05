import { z } from "zod";
import { formMessageType, voiceForm, i18nMessageSchema } from "@sugar-ai/core";

export const getFormsInput = z.object({});
export type GetFormsInput = z.infer<typeof getFormsInput>;

export const form = z.any();
export type Form = z.infer<typeof form>;

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

export const editFormInput = createFormInput.extend({
  description: i18nMessageSchema.passthrough().optional(),
  startButtonText: i18nMessageSchema.passthrough(),

  messages: z.record(formMessageType, z.string()),
  languages: z.array(z.string()),
  formConfig: z.object({}).passthrough(),
});

export type EditFormInput = z.infer<typeof editFormInput>;
