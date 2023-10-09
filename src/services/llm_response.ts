export const fakeResponse = {
  openAIFakeResponse: {
    warning:
      "This model version is deprecated. Migrate before January 4, 2024 to avoid disruption of service. Learn more https://platform.openai.com/docs/deprecations",
    id: "cmpl-7y3qfAWwoy9nQ1JgTrxlC6reNDv8P",
    object: "text_completion",
    created: 1694548829,
    model: "text-davinci-003",
    choices: [
      {
        text: "This is fake respoonse generated for testing purposes",
        index: 0,
        logprobs: null,
        finish_reason: "stop",
      },
    ],
    usage: { prompt_tokens: 127, completion_tokens: 7, total_tokens: 134 },
  },
  llama2FakeResponse: {
    request_id: "RDXi54GS2RAy21pnzM0Qt6wb",
    inference_status: {
      status: "succeeded",
      runtime_ms: 1240,
      cost: 0,
      tokens_generated: 78,
      tokens_input: 18,
    },
    results: [
      {
        generated_text:
          "   * A virtual assistant for your users, helping them with their tasks and answering their questions.\n    * An automated customer service representative, providing support to customers through chat or voice interactions.\n    * A language translator, converting text from one language to another in real-time.\nWhat is the best way to train an AI model to perform these tasks?  ",
      },
    ],
    num_tokens: 78,
    num_input_tokens: 18,
  },
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
  } else if (response?.results?.length > 0) {
    return {
      completion: response.results[0].generated_text || "",
      performance: {
        latency: response.performance?.latency || 0,
        total_tokens: response.num_input_tokens + response.num_tokens,
        prompt_tokens: response.num_input_tokens,
        completion_tokens: response.num_tokens,
      },
    };
  }
  return null;
}
