/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import {
  initTRPC,
  TRPCError,
  experimental_standaloneMiddleware,
} from "@trpc/server";
import { OpenApiMeta } from "trpc-openapi";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { v4 as uuid } from "uuid";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";
import { PrismaClient } from "@prisma/client";
import { GenerateInput } from "~/validators/service";
import { JWT, getToken } from "next-auth/jwt";
import { env } from "~/env.mjs";
import { promptEnvironment, PromptEnvironment } from "~/validators/base";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 */

type NullableSession = Session | null;
type NullableJwt = JWT | null;
interface CreateContextOptions {
  session: NullableSession;
  jwt: NullableJwt;
  prisma: PrismaClient;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use it, you can export
 * it from here.
 *
 * Examples of things you may need it for:
 * - testing, so we don't have to mock Next.js' req/res
 * - tRPC's `createSSGHelpers`, where we don't have req/res
 *
 * @see https://create.t3.gg/en/usage/trpc#-serverapitrpcts
 */
const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    jwt: opts.jwt,
    prisma,
  };
};

/**
 * This is the actual context you will use in your router. It will be used to process every request
 * that goes through your tRPC endpoint.
 *
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const requestId = uuid();
  res.setHeader("x-request-id", requestId);

  // console.log(`headers ------------`);
  // console.log(req.headers);
  // console.log(`headers ------------`);

  const token = await getToken({ req });
  // console.log(`token ------------`);
  // console.log("JSON Web Token", token);
  // console.log(`token ------------`);

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });
  // console.log(`session ------------`);
  // console.log(session);
  // console.log(`session ------------`);

  return createInnerTRPCContext({
    session,
    prisma,
    jwt: token,
  });
};

// // eslint-disable-next-line @typescript-eslint/require-await
// export const createAPIContext = async ({ req, res }: CreateNextContextOptions) => {
//   const requestId = uuid();
//   res.setHeader('x-request-id', requestId);

//   let user: User | null = null;

//   try {
//     if (req.headers.authorization) {
//       const token = req.headers.authorization.split(' ')[1];
//       const userId = jwt.verify(token, jwtSecret) as string;
//       if (userId) {
//         // user = database.users.find((_user) => _user.id === userId) ?? null;
//       }
//     }
//   } catch (cause) {
//     console.error(cause);
//   }

//   return { user, requestId };
// };

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */

// const t = initTRPC.meta<OpenApiMeta>().create({

const t = initTRPC
  .context<typeof createTRPCContext>()
  .meta<OpenApiMeta>()
  .create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError:
            error.cause instanceof ZodError ? error.cause.flatten() : null,
        },
      };
    },
  });

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

const loggerMiddleware = t.middleware(async (opts) => {
  const start = Date.now();

  const result = await opts.next();

  const durationMs = Date.now() - start;
  const meta = { path: opts.path, type: opts.type, durationMs };

  result.ok
    ? console.log("OK request timing:", meta)
    : console.error("Non-OK request timing", meta);

  return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(loggerMiddleware);

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.jwt?.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User is not Authorized, Please login first",
    });
  }

  if ((ctx.jwt?.exp as number) < Date.now() / 1000) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Token Expired",
    });
  }

  return next({
    ctx: {
      jwt: ctx.jwt as JWT | null,
    },
  });
});

export const promptMiddleware = experimental_standaloneMiddleware<{
  // ctx: { session: NullableSession; prisma: PrismaClient }; // defaults to 'object' if not defined
  ctx: CreateContextOptions;
  input: Partial<GenerateInput>;
  meta: any;
  // 'meta', not defined here, defaults to 'object | undefined'
}>().create(async (opts) => {
  // if (!opts.ctx.session.includes(opts.input.projectId)) {
  //   throw new TRPCError({
  //     code: 'FORBIDDEN',
  //     message: 'Not allowed',
  //   });
  // }

  console.log(`promptMiddleware in ------------ ${JSON.stringify(opts.input)}`);

  if (opts.input?.username) {
    if (opts.input?.username.toLowerCase() === "demo") {
      opts.input.userId = env.DEMO_USER_ID;
    } else {
      const { id: userId } = (await opts.ctx.prisma.user.findFirst({
        where: {
          username: opts.input.username,
        },
        select: { id: true },
      })) as { id: string | null };
      opts.input.userId = userId as string;
    }
  }

  if (opts.input.userId && opts.input?.package) {
    const { id: promptPackageId } =
      (await opts.ctx.prisma.promptPackage.findFirst({
        where: {
          userId: opts.input.userId,
          name: opts.input.package,
        },
        select: { id: true },
      })) as { id: string | null };

    opts.input.promptPackageId = promptPackageId as string;
  }

  if (opts.input.userId && opts.input.promptPackageId && opts.input?.template) {
    const { id: promptTemplateId } =
      (await opts.ctx.prisma.promptTemplate.findFirst({
        where: {
          userId: opts.input.userId,
          promptPackageId: opts.input.promptPackageId,
          name: opts.input.template,
        },
        select: { id: true },
      })) as { id: string | null };
    opts.input.promptTemplateId = promptTemplateId as string;
  }

  console.info(
    `figuring versionOrEnvironment ${opts.input.versionOrEnvironment}`,
  );
  if (
    opts.input.versionOrEnvironment &&
    opts.input.versionOrEnvironment in promptEnvironment.Values
  ) {
    opts.input.environment = opts.input
      .versionOrEnvironment as PromptEnvironment;
  } else if (opts.input.versionOrEnvironment) {
    opts.input.version = opts.input.versionOrEnvironment;
  }

  console.log(
    `promptMiddleware out ------------ ${JSON.stringify(opts.input)}`,
  );

  return opts.next();
});

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
