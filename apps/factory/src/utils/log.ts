import { env } from "next-runtime-env";
export function truncateObj(
  obj: Record<string, any>,
  maxLength: number = 40,
): Record<string, any> {
  const truncatedObj: Record<string, any> = {};

  for (const key in obj) {
    if (typeof obj[key] === "string" && obj[key].length > maxLength) {
      truncatedObj[key] =
        obj[key].substring(0, maxLength) + `...[truncated](${obj[key].length})`;
    } else if (typeof obj[key] === "object") {
      truncatedObj[key] = truncateObj(obj[key], maxLength);
    } else {
      truncatedObj[key] = obj[key];
    }
  }

  return truncatedObj;
}

export function logLLMResponse(llm: string, response: any): void {
  const str = JSON.stringify(truncateObj(response), null, 2);
  console.log(`LLM response for ${llm}: ${str}`);
}

export const getLogoImage = () => {
  // return env("NEXT_PUBLIC_APP_LOGO") as string;
  return "/logos/sugarai-logo-3.svg";
};

export const getAppUrl = () => {
  return env("NEXT_PUBLIC_APP_URL") as string;
};

export const getAPIEndPoint = () => {
  return env("NEXT_PUBLIC_API_ENDPOINT") as string;
};

export const getSentryDsn = () => {
  return env("NEXT_PUBLIC_SENTRY_DSN") as string;
};

export const getSentryOrg = () => {
  return env("NEXT_PUBLIC_SENTRY_ORG") as string;
};

export const getSentryProject = () => {
  return env("NEXT_PUBLIC_SENTRY_PROJECT") as string;
};
