import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import Head from "next/head";
import Link from "next/link";
import { env } from "~/env.mjs";

const Hero = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="w-full">
      <Head>
        <title>Sugarcane AI</title>
        <meta
          name="description"
          content="Supercharge your cross LLM App development by decoupling your prompts from the Application Layer"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#040306] to-[#494952]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Sugarcane <span className="text-[hsl(280,100%,70%)]">AI</span>
          </h1> */}
          <Image
            src={env.NEXT_PUBLIC_APP_LOGO}
            width={600}
            height={600}
            alt="Logo"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              href={sessionData ? "/dashboard/prompts" : "/api/auth/signin"}
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Sugar Factory →</h3>
              <div className="text-lg">
                Build, Version, Train and Ship Prompt Packages over APIs.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/marketplace/packages"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Sugar Hub →</h3>
              <div className="text-lg">
                Discover and Integrate Prompt Packages built by the community.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://sugarcaneai.dev/docs"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              {/* <div className="text-lg">
                Learn more about Sugarcane AI, architecture, problem it solves,
                and how to deploy it.
              </div> */}
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://github.com/sugarcane-ai"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Contribute →</h3>
              {/* <div className="text-lg">
                Checkout the code and make your first contribution.
              </div> */}
            </Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </main>
    </div>
  );
};

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.username}</span>}
      </p>
      <button
        className="text-xlg rounded-full bg-white/10 px-10 py-6 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in / Sign up"}
      </button>
    </div>
  );
}

export default Hero;
