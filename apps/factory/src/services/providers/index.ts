// Import individual providers
import * as llama2 from "./llama2";
import * as ph from "./prompthero";
import * as runwayml from "./runwayml";
import * as stabilityai from "./stabilityai";

import * as openai from "./openai";
import * as mistral from "./mistral";

// Export all providers
// export { llama2Run, run };

const providers: Record<string, Function> = {
  mistral: mistral.run,
  llama2: llama2.run,
  openai: openai.run,
  prompthero: ph.run,
  runwayml: runwayml.run,
  stabilityai: stabilityai.run,
};

export function getProvider(providerName: string) {
  const runMethod = providers[providerName];
  if (!runMethod) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return runMethod;
}

export const ChooseTemplate = (provider: string) => {
  switch (provider) {
    case "openai":
      return openai.template;
    case "mistral":
      return mistral.template;
    default:
      return { v: "", data: [] };
  }
};
