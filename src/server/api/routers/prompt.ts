import { describe } from "node:test";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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

export const PromptPackageCreateInput = z.object({
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
});

export const PromptPackageDeleteInput = z.object({
  id: z.string(),
});

export const promptPackageRouter = createTRPCRouter({

  getAll: publicProcedure
  .meta({
    openapi: {
      method: 'GET',
      path: '/packages',
      tags: ['packages'],
      summary: 'Read all packages',
    },
  })
  .input(
    z.object({
      userId: z.string().uuid().optional(),
    }),
  )
  .output(
    z.object({
      packages: z.array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          description: z.string(),
        }),
      ),
    }),
  )
  .query(({ input, ctx }) => {
    console.log(input);
    return ctx.prisma.promptPackage.findMany({
      where: {
        userId: ctx.session?.user.id,
      },
    });
    
  }),

  getById: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(({ ctx, input }) => {
    return ctx.prisma.promptPackage.findFirst({
      where: {
        userId: ctx.session?.user.id,
        id: input.id
      },
    });
    
  }),

  createPromptPackage: publicProcedure
  .input(PromptPackageCreateInput)
  .mutation(async ({ ctx, input }) => {
    // const validatedInput = PromptPackageCreateInput.parse(input);
    const promptPackage = await ctx.prisma.promptPackage.create({data: input});
    return promptPackage;
  }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),

});
