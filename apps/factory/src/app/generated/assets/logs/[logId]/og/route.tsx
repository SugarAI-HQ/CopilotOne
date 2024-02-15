import { prisma } from "~/server/db";
import { ImageResponse, type NextRequest } from "next/server";
import { env } from "~/env.mjs";
import { resizeBase64Image } from "~/utils/images";
import { ResponseType } from "openai/_shims/auto/types";
import { LlmResponse, processLlmResponse } from "~/validators/llm_respose";

export async function GET(
  req: NextRequest,
  { params }: { params: { logId: string } },
) {
  // Load the log
  const pl = await prisma.promptLog.findFirst({
    where: {
      id: params.logId,
    },
  });

  // If log not found
  if (!pl) {
    return new Response(`Not Found`, {
      status: 404,
    });
  }

  // Generate the image response
  const searchParams = req.nextUrl.searchParams;
  const defaultWidth = "630";
  const w = parseInt(searchParams.get("w") || defaultWidth);
  const h = parseInt(searchParams.get("h") || w.toString());

  const base64Image =
    pl?.completion ||
    (processLlmResponse(pl?.llmResponse as LlmResponse) as string);

  const b64resized = await resizeBase64Image(base64Image, w, h, 50);
  return ogImageResponse(b64resized);
}

function ogImageResponse(base64Image: string) {
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
          background: "black",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: "630px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            width="100%"
            src={`data:image/png;base64,${base64Image}`}
            style={{ display: "block" }}
          ></img>

          <img
            height={40}
            src={env.NEXT_PUBLIC_APP_LOGO}
            style={{
              position: "absolute",
              top: "0px",
              // opacity: "0.8",
            }}
          ></img>
        </div>
      </div>
    ),
    options,
  );
}
