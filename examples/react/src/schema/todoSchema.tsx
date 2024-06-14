import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number(),
  task: z.string().min(1),
  completed: z.boolean(),
});

export const FilterTypeSchema = z.enum(["all", "remaining", "done"]);

export const SettingsSchema = z.object({
  isOpen: z.boolean(),
  onClose: z.function().args().returns(z.void()),
  highlightedSetting: z.string().nullable(),
});

export type TodoSchemaType = z.infer<typeof TodoSchema>;
export type FilterType = z.infer<typeof FilterTypeSchema>;
export type SettingsType = z.infer<typeof SettingsSchema>;
