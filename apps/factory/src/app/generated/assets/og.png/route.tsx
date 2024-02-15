import { ImageResponse } from "next/server";
import { env } from "~/env.mjs";

export function GET(req: Request) {
  return ogImageResponse();
}

function ogImageResponse() {
  const options = {
    width: 1200,
    height: 630,
  };
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          // justifyContent: "center",
          letterSpacing: "-.04em",
          // fontWeight: 700,
          background: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            flexDirection: "column",
            // justifyContent: "center",
            padding: "10px 10px",
            margin: "20px 10px",
            fontSize: 30,
            width: "auto",
            // maxWidth: 550,
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
            lineHeight: "0.5em",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              marginTop: "40px",
              marginBottom: "40px",
            }}
          >
            Promptathon 1.0
          </h1>
          <h2
            style={{
              textAlign: "center",
              marginTop: "80px",
              marginBottom: "20px",
            }}
          >
            Learn & Build your First AI App
          </h2>

          <div
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              // justifyContent: "center",
              textAlign: "center",
              letterSpacing: ".1em",
              fontSize: 25,
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
              No Coding Skills Needed
            </h3>
            <h4 style={{ textAlign: "center", marginBottom: "100px" }}>
              50+ Job & Internship Opportunities
            </h4>

            <img
              width={500}
              // src={"https://sugarcaneai.dev/images/sugar/logo-transparent.png"}
              src={env.NEXT_PUBLIC_APP_LOGO}
            ></img>
          </div>
        </div>
      </div>
    ),
    options,
  );
}
