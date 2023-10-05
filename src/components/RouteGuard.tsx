// RouteGuard.tsx

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add a loading state
  const isPromptPackageRoute = router.pathname.startsWith(
    "/dashboard/prompts/",
  );
  useEffect(() => {
    if (isPromptPackageRoute) {
      return;
    }
    if (session === null) {
      router.push("/");
    }
    if (session) {
      setLoading(false);
    }
  }, [session, router]);

  if (isPromptPackageRoute) {
    return <>{children}</>;
  }
  console.log();
  if (loading) {
    return <PageLoader />;
  }

  if (session) {
    return <>{children}</>;
  }
}
