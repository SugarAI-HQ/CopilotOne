import { ImageResponse } from "next/server";
import { env } from "~/env.mjs";

export const runtime = "edge";
// export const contentType = "image/png";
// export const size = {
//   width: 1200,
//   height: 630,
// };

export function GET() {
  const options = {
    width: 1200,
    height: 630,

    // Options that will be passed to the HTTP response
    // status?: number = 200
    // statusText?: string
  };
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-.02em",
          fontWeight: 700,
          background: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            padding: "20px 50px",
            margin: "0 10px",
            fontSize: 40,
            width: "auto",
            // maxWidth: 550,
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            lineHeight: 1.4,
          }}
        >
          <img
            width={300}
            src={env.NEXT_PUBLIC_APP_LOGO}
            style={{ margin: "10px 50px 75px 20px" }}
          ></img>
          <h2>Ready to build your first AI Application?</h2>
          <h4 style={{ textAlign: "center" }}>No Coding Skills Needed 🥳</h4>
        </div>
      </div>
    ),
    options,
  );
}
