import { z } from "zod";

export const completionInput = z
    .object({
        userId: z.string().optional(),
        promptPackageId: z.string(),
        promptTemplateId: z.string(),
        id: z.string(),

        data: z.record(z.any()),
    })
    .strict()
export type CompletionInput = z.infer<typeof completionInput>;


export const completionOutput = z
    .object({
        id: z.string(),
        prompt: z.string(),
        completion: z.string(),

        latency: z.number(),
        prompt_tokens: z.number(),
        completion_tokens: z.number(),
        total_tokens: z.number(),

        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),

    }).or(z.null())
export type CompletionOutput = z.infer<typeof completionOutput>;

