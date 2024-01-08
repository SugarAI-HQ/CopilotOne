// RouteGuard.tsx

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PageLoader from "./PageLoader";

export default function RouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathName = usePathname();
  const [loading, setLoading] = useState(true); // Add a loading state
  const isPromptPackageRoute = pathName?.startsWith("/dashboard/prompts/");
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
