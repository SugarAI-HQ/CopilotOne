import { z } from "zod";

export const getVersionInput = z
  .object({
    promptPackageId: z.string().optional(),
  })
  .strict();

const versionSchema = z.object({
  version: z.string().optional(),
});

export const logVersionOutput = z.array(versionSchema);
