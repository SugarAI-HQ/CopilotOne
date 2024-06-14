import type { AppProps } from "next/app";
import Provider from "@/ provider";
import "../app/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
