// Import individual providers
import * as llama2 from "./llama2";
import * as ph from "./prompthero";
import * as runwayml from "./runwayml";
import * as stabilityai from "./stabilityai";

import * as openai from "./openai";
import * as mistral from "./mistral";
import * as wizardCoder from "./wizardcoder";
import * as segmind from "./segmind";
import { PromptDataSchemaType } from "~/validators/prompt_version";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";

// Export all providers
// export { llama2Run, run };

interface Provider {
  run: Function;
  template: any;
}

export interface FileObject {
  base64: string;
  fileList:
    | FileList
    | {
        name: string;
        size: number;
        type: string;
      }[]
    | null;
}

const providers: Record<string, Provider> = {
  mistral: mistral,
  llama2: llama2,
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

export function getTemplate(providerName: string, model: string) {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider "${providerName}" not found`);
  }

  return provider.template[model];
}

export function setDefaultTemplate(moduleType: string) {
  let template;
  if (moduleType === ModelTypeSchema.Enum.TEXT2TEXT) {
    template = `Tell me a joke on topic "{@topic}"`;
  } else if (moduleType === ModelTypeSchema.Enum.TEXT2IMAGE) {
    template = `A photo of an astronaut riding a horse on {@OBJECT}`;
  } else if (moduleType === ModelTypeSchema.Enum.IMAGE2IMAGE) {
    template = `A vibrant, oil-painted handmade portrait featuring a {@OBJECT} scene with a beautiful house nestled next to a meandering river, teeming with lively fish. The idyllic setting is surrounded by lush trees, and the scene is bathed in the warm glow of a bright, sunny day.`;
  } else {
    template = `A photo of an astronaut riding a horse on {@OBJECT}`;
  }
  return template;
}

export function imageModels(llmModelType: ModelTypeType) {
  return (
    llmModelType === ModelTypeSchema.Enum.TEXT2IMAGE ||
    llmModelType === ModelTypeSchema.Enum.IMAGE2IMAGE
  );
}

export async function url2ImageBase64Url(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const base64String = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    const fileObject: FileObject = {
      base64: base64String,
      fileList: [
        {
          name: imageUrl.substring(imageUrl.lastIndexOf("/") + 1),
          size: blob.size,
          type: blob.type,
        },
      ],
    };
    return fileObject;
  } catch (error) {
    console.error("Error fetching or converting image to base64:", error);
  }
}
