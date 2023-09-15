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
        completion: z.string(),
        performance: z.object({
            latency: z.number(),
            prompt_tokens: z.number(),
            completion_tokens: z.number(),
            total_tokens: z.number(),
        })
    }).or(z.null())
export type CompletionOutput = z.infer<typeof completionOutput>;

