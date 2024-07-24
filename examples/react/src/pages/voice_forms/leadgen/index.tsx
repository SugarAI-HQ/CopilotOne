// pages/voice_forms/leadgen/index.tsx

import { useEffect } from "react";
import { useRouter } from "next/router";

const RedirectToHealthfix: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to `/voice_forms/leadgen/healthfix`

    if (!router.isReady) return;
    router.replace({
      pathname: "/voice_forms/leadgen/healthfix",
      query: router.query,
    });
  }, [router]);

  return null; // No UI to render
};

export default RedirectToHealthfix;
