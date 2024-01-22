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
