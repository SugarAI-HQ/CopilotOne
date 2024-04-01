import { z } from "zod";

export const createKeyInput = z
  .object({
    name: z.string(),
    isActive: z.boolean().default(true),
    // Legth 51 pk prefix
    apiKey: z
      .string()
      .transform((val) => {
        return val.startsWith("pk-") ? val : "pk-" + val;
      })
      .refine(
        (val) => {
          return val.length === 51;
        },
        {
          message:
            "apiKey must be 51 characters long including the prefix 'pk-'",
        },
      ),
    userId: z.string(),
    lastUsedAt: z.date().optional().nullable(),
  })
  .strict();

export const getKeyInput = z
  .object({
    id: z.string(),
  })
  .strict()
  .required();

export const getKeysInput = z
  .object({
    userId: z.string(),
  })
  .strict();

export const keySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    isActive: z.boolean().default(true),
    apiKey: z.string(),
    userId: z.string(),
    createdAt: z.coerce.date(),
    lastUsedAt: z.date().nullable(),
    updatedAt: z.coerce.date(),
  })
  .strict();

export const updateKeyInput = z
  .object({
    id: z.string(),
    name: z.string(),
  })
  .strict();

export type CreateKeyInput = z.infer<typeof createKeyInput>;
export type GetKeyInput = z.infer<typeof getKeyInput>;
export type GetKeysInput = z.infer<typeof getKeysInput>;
export const keyOutput = keySchema.or(z.null());
export type KeyOutput = z.infer<typeof keyOutput>;
export type UpdateKeyInput = z.infer<typeof updateKeyInput>;

export const keyListOutput = z.array(keySchema);
export type KeyListOutput = z.infer<typeof keyListOutput>;
