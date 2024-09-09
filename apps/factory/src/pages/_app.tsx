import { type Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps, NextWebVitalsMetric } from "next/app";
import { GoogleAnalytics, event } from "nextjs-google-analytics";
import React from "react";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  isPublic?: boolean;
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

  const theme = useTheme(); // Access the MUI theme

  // console.log("theme", theme);

  // Toast options
  const toastOptions = {
    style: {
      background:
        theme.palette.mode !== "dark"
          ? theme.palette.background.default // Better matches dark mode background
          : theme.palette.background.paper, // Matches light mode surface
      color: theme.palette.text.primary, // Keeps text readable in both modes
      border: `1px solid ${theme.palette.divider}`, // Adds a subtle divider for better contrast
      boxShadow: theme.shadows[3], // MUI-style shadow for depth
    },
    success: {
      duration: 4000,
      iconTheme: {
        primary: theme.palette.success.main, // Success icon matches MUI success color
        secondary:
          theme.palette.mode !== "dark"
            ? theme.palette.background.paper // Better contrast for dark mode icons
            : theme.palette.grey[200], // Subtle for light mode
      },
    },
    error: {
      duration: 4000,
      iconTheme: {
        primary: theme.palette.error.main, // Error icon matches MUI error color
        secondary:
          theme.palette.mode !== "dark"
            ? theme.palette.background.paper // Better contrast for dark mode icons
            : theme.palette.grey[200], // Light contrast for error icon
      },
    },
  };

  console.log("toastOptions", toastOptions);

  return (
    <SessionProvider session={session as Session}>
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics
          gaMeasurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        />
      )}
      <Auth isPublic={(Component as any).isPublic ?? false}>
        {getLayout(<Component {...pageProps} />)}
      </Auth>
      <Toaster position="top-right" toastOptions={toastOptions} />
    </SessionProvider>
  );
};

interface AuthProps {
  children: React.ReactNode;
  isPublic?: boolean;
}

const Auth: React.FC<AuthProps> = ({ children, isPublic }) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  React.useEffect(() => {
    if (status === "loading") return;
    if (!isUser && !isPublic) signIn();
  }, [isUser, status, isPublic]);

  if (isUser || isPublic) {
    return <>{children}</>;
  }
  return null;
};

export default api.withTRPC(MyApp);
