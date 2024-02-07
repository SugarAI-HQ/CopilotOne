import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { GoogleAnalytics, event } from "nextjs-google-analytics";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value), // values must be integers
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}
const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <SessionProvider session={session as Session}>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics
          gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
      )}
      {getLayout(<Component {...pageProps} />)}
      <Toaster position="top-right" />
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
