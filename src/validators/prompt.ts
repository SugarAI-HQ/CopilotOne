
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

export const getPackagesSchema = z
    .object({
        userId: z.string().uuid().optional(),
    })
    // .strict()
export type GetPackagesSchema = z.infer<typeof getPackagesSchema>;


export const createPackageSchema = z
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

export type CreatePackageSchema = z.infer<typeof createPackageSchema>;


export const createTemplateSchema = z
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

export type CreateTemplateSchema = z.infer<typeof createTemplateSchema>;



export const deletePackageSchema = z
    .object({
        id: z.string(),
    })
    .strict();
export type DeletePackageSchema = z.infer<typeof deletePackageSchema>;
  