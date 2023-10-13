import { NextApiRequest, NextApiResponse } from "next";

import { openApiDocument } from "~/server/api/openai";

// export const runtime = 'edge';

// Respond with our OpenAPI schema
const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).send(openApiDocument);
};

export default handler;
