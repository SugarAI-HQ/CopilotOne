import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import RootLayout from "~/app/layout";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
   
    <SessionProvider session={session}>
        <RootLayout>
          <Component {...pageProps} />
          <Toaster position="top-right"/>
        </RootLayout>
    </SessionProvider>
    
  );
};

export default api.withTRPC(MyApp);
