
import { z } from "zod";

const RESERVED_NAMES = [
    "sign-up",
    "sign-in",
    "claim",
    "api",
    "actions",
    "app",
    "create-link",
    "twitter",
    "github",
    "linkedin",
    "instagram",
    "telegram",
    "discord",
    "youtube",
    "twitch",
    "about",
    "pricing",
    "contact",
    "privacy",
    "terms",
    "legal",
    "blog",
    "docs",
    "support",
    "help",
    "status",
    "jobs",
    "press",
    "partners",
    "developers",
    "security",
    "cookies",
    "settings",
    "profile",
    "account",
    "dashboard",
    "admin",
    "login",
    "logout",
    "signout",
    "auth",
    "oauth",
    "bio",
];

export const getPackagesInput = z
    .object({
        userId: z.string().optional(),
    }).optional()
    // .strict()
export type GetPackagesInput = z.infer<typeof getPackagesInput>;

export const getPackageInput = z
    .object({
        id: z.string().uuid()
    })
    .strict()
    .required()
export type GetPackageInput = z.infer<typeof getPackageInput>;

export const createPackageInput = z
    .object({
        name: z.string()
        .min(3, {
            message: "Name must be at least 3 characters long.",
        })
        .max(30, {
            message: "Name must be at most 30 characters long.",
        })
        .regex(/^[a-z0-9-]+$/, {
            message: "Name must only contain lowercase letters, numbers, and dashes.",
        })
        .transform((value) => value.toLowerCase())
        .refine((value) => !RESERVED_NAMES.includes(value), {
            message: "This name is reserved.",
        }),
        description: z.string() 
    })
    .strict()
    .required();

export type CreatePackageInput = z.infer<typeof createPackageInput>;


export const createTemplateInput = z
    .object({
        name: z.string()
        .min(3, {
            message: "Name must be at least 3 characters long.",
        })
        .max(30, {
            message: "Name must be at most 30 characters long.",
        })
        .regex(/^[a-z0-9-]+$/, {
            message: "Name must only contain lowercase letters, numbers, and dashes.",
        })
        .transform((value) => value.toLowerCase())
        .refine((value) => !RESERVED_NAMES.includes(value), {
            message: "This name is reserved.",
        }),
        description: z.string() 
    })
    .strict()
    .required();

export type CreateTemplateInput = z.infer<typeof createTemplateInput>;



export const deletePackageInput = z
    .object({
        id: z.string(),
    })
    .strict();
export type DeletePackageInput = z.infer<typeof deletePackageInput>;
  

export const packageSchema = z
.object({
    id: z.string(),
    userId: z.string(),
    name: z.string(),
    description: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const packageOutput = packageSchema.or(z.null())
export type PackageOutput = z.infer<typeof packageOutput>;

export const packageListOutput = z.array(packageOutput)
export type PackageListOutput = z.infer<typeof packageListOutput>;

