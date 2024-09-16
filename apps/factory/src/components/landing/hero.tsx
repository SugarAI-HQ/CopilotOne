import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

import Head from "next/head";
import Link from "next/link";
import { env } from "~/env.mjs";
import { getLogoImage } from "~/utils/log";

const Hero = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="w-full">
      <Head>
        <title>Welcome to Sugar AI</title>
        <meta
          name="description"
          content="Engage Users, Capture Voice Data & Analyse to qualify"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#040306] to-[#494952]">
        <div className="container flex flex-col items-center justify-center gap-2 px-4 py-16 ">
          {/* <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Sugarcane <span className="text-[hsl(280,100%,70%)]">AI</span>
          </h1> */}
          <Image
            src={getLogoImage()}
            width={600}
            height={300}
            alt="Logo"
            className="mb-5 border-gray-300"
          />
          <h2 className="mb-5 p-3 text-center text-4xl font-bold text-white">
            Experience the future of Forms on Voice
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href={sessionData ? "/dashboard/forms" : "/api/auth/signin"}
            >
              <h3 className="text-2xl font-bold">Create Voice Forms →</h3>
              <div className="text-lg">
                Create and manage voice forms to collect user data.
              </div>
            </Link>

            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://youtu.be/t2e0CThWZUE"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Copilot Demo →</h3>
              <div className="text-lg">
                Learn what kind of Experiences you can build.
              </div>
            </Link> */}

            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href={sessionData ? "/dashboard/copilots" : "/api/auth/signin"}
            >
              <h3 className="text-2xl font-bold">Build Copilot →</h3>
              <div className="text-lg">
                Add and go live with Voice/Text enabled AI Assitants
              </div>
            </Link>

            <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://youtu.be/t2e0CThWZUE"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Copilot Demo →</h3>
              <div className="text-lg">
                Learn what kind of Experiences you can build.
              </div>
            </Link> */}

            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://sugarai.page.link/whatsapp"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Promptathon 1.0 →</h3>
            </Link> */}

            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              // href="https://youtu.be/5oeRkHOqW28"
              href="/university"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">View Demo →</h3>
            </Link> */}

            {/* <Link
              href={sessionData ? "/dashboard/prompts" : "/api/auth/signin"}
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
            >
              <h3 className="text-2xl font-bold">Prompts Packages →</h3>
              <div className="text-lg">
                Build, Version, Train and Ship Prompt Packages over APIs.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href="/marketplace/packages"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Sugar Hub →</h3>
              <div className="text-lg">
                Discover and Integrate Prompt Packages built by the community.
              </div>
            </Link> */}
            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://sugarcaneai.dev/docs"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
            </Link> */}
            {/* <Link
              className="flex max-w-xs flex-col gap-4 rounded-md bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://github.com/sugarcane-ai/sugarcane-ai"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Contribute →</h3>
            </Link> */}
          </div>

          <div className="m-2 flex flex-col items-center gap-2">
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
    <div className="mt-4 flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.username}</span>}
      </p>
      <button
        className="rounded-md bg-white/10 px-10 py-4 text-2xl font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        <h3 className="w-48">
          {sessionData ? "Sign out" : "Sign in / Sign up"}
        </h3>
      </button>
    </div>
  );
}

export default Hero;
