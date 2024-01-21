// Import individual providers
import { run as llama2Run } from "./llama2";
import { run as mistralRun } from "./mistral";
import { run as openaiRun } from "./openai";
import { run as phRun } from "./prompthero";
import { run as runwaymlRun } from "./runwayml";
import { run as stabilityaiRun } from "./stabilityai";

// Export all providers
// export { llama2Run, run };

const providers: Record<string, Function> = {
  mistral: mistralRun,
  llama2: llama2Run,
  openai: openaiRun,
  prompthero: phRun,
  runwayml: runwaymlRun,
  stabilityai: stabilityaiRun,
};

export function getProvider(providerName: string) {
  const runMethod = providers[providerName];
  if (!runMethod) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return runMethod;
}
