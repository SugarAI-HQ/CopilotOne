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
import CredentialsProvider from "next-auth/providers/credentials";

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

      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        // `credentials` is used to generate a form on the sign in page.
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: {
            label: "Username",
            type: "text",
            placeholder: "username",
          },
          password: { label: "Password", type: "password" },
        },

        authorize(credentials, req) {
          // Add logic here to look up the user from the credentials supplied
          const user = {
            id: env.DEMO_USER_ID as string,
            name: "Demo",
            email: "demo@demo.com",
          };

          if (
            user &&
            credentials &&
            credentials.username == "demo" &&
            credentials.password == "demo123"
          ) {
            // Any object returned will be saved in `user` property of the JWT
            return user;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            return null;

            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        },
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
