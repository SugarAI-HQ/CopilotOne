// Import individual providers
import * as llama2 from "./llama2";
import * as ph from "./prompthero";
import * as runwayml from "./runwayml";
import * as stabilityai from "./stabilityai";

import * as openai from "./openai";
import * as mistral from "./mistral";
import { PromptDataSchemaType } from "~/validators/prompt_version";

// Export all providers
// export { llama2Run, run };

interface Provider {
  run: Function;
  template: any;
}

const providers: Record<string, Provider> = {
  mistral: mistral,
  llama2: llama2,
  openai: openai,
  prompthero: ph,
  runwayml: runwayml,
  stabilityai: stabilityai,
};

export function getProvider(providerName: string) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return provider.run;
}

export function getTemplate(providerName: string, model: string) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return provider.template[model];
}
