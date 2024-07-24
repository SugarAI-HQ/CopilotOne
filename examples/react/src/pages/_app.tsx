import type { AppProps } from "next/app";
import Provider from "@/ provider";
import "../app/globals.css";
import { useEffect, useState } from "react";
import { isUnsupportedBrowser } from "@/utils/browser";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
