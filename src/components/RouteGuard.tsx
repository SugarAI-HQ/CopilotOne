// RouteGuard.tsx

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Check if the session is undefined or null (loading or not authenticated)
 
    if (session === null) {
    //
      router.push('/auth/login');
    }else{
         setLoading(false)
    }
  }, [session, router]);

  // Render the children if authenticated, a loading indicator, or a message
  return loading ? <p>Loading...</p> : session ? <>{children}</> : <p>Not authenticated.</p>;
}
