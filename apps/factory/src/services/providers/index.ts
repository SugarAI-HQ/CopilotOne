// Import individual providers
import * as llama2 from "./llama2";
import * as llama3 from "./llama3";
import * as ph from "./prompthero";
import * as runwayml from "./runwayml";
import * as stabilityai from "./stabilityai";

import * as openai from "./openai";
import * as mistral from "./mistral";
import * as wizardCoder from "./wizardcoder";
import * as segmind from "./segmind";
import { ModelDefaultValueSchemaType } from "~/validators/prompt_version";
// Export all providers
// export { llama2Run, run };

interface Provider {
  run: Function;
  template: any;
  defaults: any;
}

const providers: Record<string, Provider> = {
  mistral: mistral,
  llama2: llama2,
  llama3: llama3,
  openai: openai,
  prompthero: ph,
  runwayml: runwayml,
  stabilityai: stabilityai,
  WizardCoder: wizardCoder,
  segmind: segmind,
};

export function getProvider(providerName: string) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return provider.run;
}

// TODO: remove this and move it to defaults
export function getTemplate(providerName: string, model: string) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return provider.template[model];
}

export function getDefaults(
  providerName: string,
  model: string,
): ModelDefaultValueSchemaType {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider "${providerName}" values not found`);
  }

  return provider.defaults[model];
}
