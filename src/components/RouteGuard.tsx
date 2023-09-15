// RouteGuard.tsx

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PageLoader from './PageLoader';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
 
    if (session === null) {
      router.push('/auth/login');
    }
    if(session) {
      setLoading(false)
    }
  }, [session, router]);

  if(loading){
    return <PageLoader/>
  }

  if(session){
    return <>{children}</>
  }
}
