import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
function getAuthOptions(): NextAuthOptions {
  let options: NextAuthOptions = {
    callbacks: {
      session: ({ session, user }) => ({
        ...session,
        user: {
          ...session.user,
          // id: user.id,
        },
      }),
      redirect: ({ url, baseUrl }: { url: string; baseUrl: string }) => {
        console.log(url, baseUrl);
        return "/dashboard";
      },

      jwt({ token, user, account, profile, session }) {
        let newToken = token;
        // Persist the OAuth access_token and or the user id to the token right after signin

        // console.log(`---------- auth callback: jwt------`);
        // console.log(token, account, profile);
        // console.log(`---------- auth callback------`);
        if (account) {
          console.log(`---------- jwt callback:------`);
          console.log(token);
          console.log(account, user);

          // token.accessToken = account.access_token;
          token.id = user.id;
          const newToken = {
            v: 1,
            sub: token.sub,
            id: user.id,
          };
          console.log(newToken);
          console.log(`---------- jwt callback------`);
        }
        return newToken;
      },
      // async session({ session, token, user }) {
      //   // Send properties to the client, like an access_token and user id from a provider.
      //   console.log(`---------- auth callback: session------`);
      //   console.log(session, token, user);
      //   console.log(`---------- auth callback------`);

      //   return session;
      // },
    },
    adapter: PrismaAdapter(prisma),
    session: {
      strategy: "jwt",
    },
    providers: [
      GithubProvider({
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_SECRET,
      }),
      GoogleProvider({
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      }),

      /**
       * ...add more providers here.
       *
       * Most other providers require a bit more work than the Discord provider. For example, the
       * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
       * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
       *
       * @see https://next-auth.js.org/providers/github
       */
    ],
  };

  if (process.env.NODE_ENV == "development") {
    options.providers.push(
      DiscordProvider({
        clientId: env.DISCORD_CLIENT_ID,
        clientSecret: env.DISCORD_CLIENT_SECRET,
      }),
    );
  }

  return options;
}

export const authOptions: NextAuthOptions = getAuthOptions();

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
