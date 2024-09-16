import { prisma } from "~/server/db";
import { type NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { response404 } from "~/services/api_helpers";
import { getAppUrl } from "~/utils/log";

export async function GET(
  req: NextRequest,
  { params }: { params: { formId: string } },
) {
  // Load the log
  const vf = await prisma.form.findUnique({
    where: {
      id: params.formId,
    },
  });

  // If log not found
  if (!vf) {
    return response404();
  }

  // Generate the image response
  const searchParams = req.nextUrl.searchParams;
  const defaultWidth = "630";
  const w = parseInt(searchParams.get("w") || defaultWidth);
  const h = parseInt(searchParams.get("h") || w.toString());

  return ogImageResponse();
}

function ogImageResponse() {
  const options = {
    width: 1200,
    height: 630,

    // Options that will be passed to the HTTP response
    // status?: number = 200
    // statusText?: string
  };

  const logo = `${getAppUrl()}/logos/sugarai-logo-full.png`;

  return new ImageResponse(
    (
      <div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <div tw="bg-gray-50 flex w-full">
          <div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
            <h2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
              <span>Experience the Future of Forms with Voice</span>
              <span tw="text-indigo-600">
                Complete forms using Voice in 30+ languages
              </span>
            </h2>
            <div tw="mt-8 flex md:mt-0">
              <div tw="flex rounded-md shadow">
                <a tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">
                  Get started
                </a>
              </div>
              <div tw="ml-3 flex rounded-md shadow">
                <a tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
        <img
          height={100}
          src={logo}
          style={{
            position: "absolute",
            bottom: "0px",
            // right: "0px",
            opacity: "0.8",
          }}
        ></img>
      </div>
    ),
    options,
  );
}
