import React from "react";
import { useSearchParams } from "next/navigation";
import PromptTemplateView from "~/components/prompt_template_view";
import { createServerSideHelpers } from "@trpc/react-query/server";

import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { prisma } from "~/server/db";

const TemplateWithVersion = () => {
  // const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams?.get("username") as string;
  const packageName = searchParams?.get("packageName") as string;
  const template = searchParams?.get("template") as string;
  const versionOrEnvironment = searchParams?.get(
    "versionOrEnvironment",
  ) as string;

  return (
    <>
      <PromptTemplateView
        username={username}
        packageName={packageName}
        template={template}
        versionOrEnvironment={versionOrEnvironment}
      />
    </>
  );
};

export default TemplateWithVersion;

// export async function getStaticProps(
//   context: GetStaticPropsContext<{ id: string }>,
// ) {
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {
//       prisma: prisma,
//       session: null,
//       jwt: null,
//     },
//     transformer: superjson, // optional - adds superjson serialization
//   });
//   const id = context.params?.id as string;
//   await helpers.prompt.getTemplate.prefetch({ id });
//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//       id,
//     },
//     // Next.js will attempt to re-generate the page:
//     // - When a request comes in
//     // - At most once every 10 seconds
//     revalidate: 1, // In seconds
//   };
// }
// export const getStaticPaths: GetStaticPaths = async () => {
//   const templates = await prisma.promptTemplate.findMany({
//     include: {
//       promptPackage: {
//         include: {
//           User: true,
//         },
//       },
//       releaseVersion: true, // Include comments related to each post
//       previewVersion: true,
//     },
//   });

//   return {
//     paths: templates.map((template) => ({
//       params: {
//         username: template.promptPackage.User.username,
//         packageName: template.promptPackage.name,
//         template: template.name,
//         versionOrEnvironment: "release",
//       },
//     })),
//     // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
//     fallback: "blocking",
//   };
// };
