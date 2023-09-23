
import { z } from "zod";

const versionNameInput = z.string()

export const getVersionsInput = z
    .object({
        userId: z.string().optional(),
        promptPackageId: z.string(),
        promptTemplateId: z.string(),
    })
    .strict()
export type GetVersionsInput = z.infer<typeof getVersionsInput>;

export const getVersionInput = z
    .object({
        id: z.string()
    })
    .strict()
    .required()
export type GetVersionInput = z.infer<typeof getVersionInput>;

export const createVersionInput = z
    .object({
        promptPackageId: z.string(),
        promptTemplateId: z.string(),
        version: z.string(),
        forkedFromId: z.null().or(z.string().uuid()),
    })
    .strict()
    .required();

export type CreateVersionInput = z.infer<typeof createVersionInput>;

export const updateVersionInput = z
    .object({
        id: z.string(),
        promptPackageId: z.string(),
        promptTemplateId: z.string(),

        version: z.string(),
        template: z.string(),
        // changelog: z.string().optional(),
        llmProvider: z.string(),
        llmModel: z.string(),
        llmConfig: z.record(z.any())
    })
    .strict()
    .required();

export type UpdateVersionInput = z.infer<typeof updateVersionInput>;


export const deleteVersionInput = z
    .object({
        id: z.string(),
    })
    .strict();
export type DeleteVersionInput = z.infer<typeof deleteVersionInput>;


const versionSchema = z.object({
    id: z.string(),
    userId: z.string(),
    promptPackageId: z.string(),
    promptTemplateId: z.string(),
    version: z.string(),
    template: z.string(),
    
    llmProvider: z.string(),
    llmModel: z.string(),
    llmConfig: z.record(z.any()),

    publishedAt: z.null().or(z.coerce.date()),
    changelog: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
})

export const versionOutput = versionSchema.or(z.null())
export type VersionOutput = z.infer<typeof versionOutput>;

export const versionListOutput = z.array(versionSchema)
export type VersionListOutput = z.infer<typeof versionListOutput>;


// const dd = {
//     "id": "clmq7ranr0001sgpp3l6qou92",
//     "userId": "clmpdlyre0000sgj58t3yilf8", 
//     "version": "0.0.1", 
//     "template": "\nYou a bot name {#BOT_NAME} trained by {#PROVIDER}\nYou act as {@C_ROLE}, {@C_DESCRIPTION}\n", 
    
//     "inputFields": [], 
//     "templateFields": [], 
//     "changelog": "TTD", 
//     "llmProvider": "openai", 
//     "llmModel": "gpt-3.5-turbo", 
//     "llmConfig": {}, 
//     "lang": [], 
//     "outAccuracy": null, 
//     "outLatency": null, 
//     "outCost": null, 
//     "promptPackageId": 
//     "clmpdm6jm0006sgj59s49k8nv", 
//     "promptTemplateId": "clmpzzla20003sg6fku7k5qtv"
// }