import { prisma } from "~/server/db";
import { type NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { env } from "~/env.mjs";
import { resizeBase64Image } from "~/utils/images_backend";
import { LlmResponse, processLlmResponse } from "~/validators/llm_respose";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";
import { response404 } from "~/services/api_helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: { logId: string } },
) {
  // Load the log
  const pl = await prisma.promptLog.findFirst({
    where: {
      id: params.logId,
      llmModelType: {
        in: [ModelTypeSchema.Enum.TEXT2IMAGE, ModelTypeSchema.Enum.IMAGE2IMAGE],
      },
    },
  });

  // If log not found
  if (!pl) {
    return response404();
  }

  // Generate the image response
  const searchParams = req.nextUrl.searchParams;
  const defaultWidth = "128";
  const w = parseInt(searchParams.get("w") || defaultWidth);
  const h = parseInt(searchParams.get("h") || w.toString());

  const base64Image =
    pl?.completion ||
    (processLlmResponse(pl?.llmResponse as LlmResponse) as string);

  let b64resized;
  if (base64Image) {
    b64resized = await resizeBase64Image(base64Image, w, h, 50);
  } else {
    return response404();
  }

  const options = {
    width: w,
    height: h,
  };
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          width={w}
          height={h}
          src={`data:image/png;base64,${b64resized}`}
          style={{ display: "block" }}
        />
      </div>
    ),
    options,
  );
}
