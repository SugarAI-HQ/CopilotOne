
export const fakeResponse = {
  warning:
    "This model version is deprecated. Migrate before January 4, 2024 to avoid disruption of service. Learn more https://platform.openai.com/docs/deprecations",
  id: "cmpl-7y3qfAWwoy9nQ1JgTrxlC6reNDv8P",
  object: "text_completion",
  created: 1694548829,
  model: "text-davinci-003",
  choices: [
    {
      text: " {@RESPONSE}",
      index: 0,
      logprobs: null,
      finish_reason: "stop",
    },
  ],
  usage: { prompt_tokens: 127, completion_tokens: 7, total_tokens: 134 },
};

export function generateOutput(response: any) {
  if (response?.choices?.length > 0) {
    return {
      completion: response.choices[0]?.text || "",
      performance: {
        latency: response.performance?.latency || 0,
        ...response.usage,
      },
    };
  }
  return null;
}