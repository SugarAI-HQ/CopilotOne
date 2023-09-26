import { z } from "zod";

export const promptEnvironment = z.enum(["DEV", "PREVIEW", "RELEASE"]);
export type PromptEnvironment = z.infer<typeof promptEnvironment>;

export const packageVisibility = z.enum(["PUBLIC", "PRIVATE"])
export type PackageVisibility = z.infer<typeof packageVisibility>;


export const publicUserSchem = z.object({
    name: z.string(),
    image: z.string().optional()
})
export type PublicUserSchem = z.infer<typeof publicUserSchem>;