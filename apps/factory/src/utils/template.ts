import {
  ModelType,
  PromptPackage as pp,
  PromptTemplate as pt,
  PromptVersion as pv,
} from "@prisma/client";
import { PromptVariableProps } from "~/components/prompt_variables";
import { LLMConfig } from "~/services/providers/openai";
import { JsonObject } from "@prisma/client/runtime/library";
import { LlmConfigSchema } from "~/validators/prompt_version";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import { LLM, providerModels } from "~/validators/base";
import { LogSchema } from "~/validators/prompt_log";

export const getVariables = (template: string) => {
  if (!template) {
    return [];
  }
  const allVariables = template.match(/\{([#$@%].*?)\}/g);

  if (!allVariables) {
    return []; // No variables found, return an empty array.
  }

  const flattenedVariables = allVariables.map((variable) => {
    // const type = variable.charAt(1); // Get the type of variable (#, @, %, $).
    // const key = variable.substring(2, variable.length - 1); // Get the variable name.

    const obj: PromptVariableProps = {
      key: variable.substring(2, variable.length - 1), // Get the variable name.
      type: variable.charAt(1), // Get the type of variable (#, @, %, $).
      value: "",
    };
    return obj;
  });
  return flattenedVariables;
};

export const getAllTemplateVariables = (
  templates: pt[],
): Array<PromptVariableProps> => {
  if (!templates) {
    return [];
  }

  const allVariables = templates.flatMap((template) =>
    getVariables(template.description),
  );

  // Use a Set to ensure uniqueness and convert back to an array.
  // const uniqueVariables = Array.from(new Set(allVariables));
  // const uniqueVariables = Array.from(new Set(allVariables.map(item => item.key)));

  return allVariables;
};

export function getUniqueJsonArray(
  jsonArray: PromptVariableProps[],
  uniqueKey: any,
) {
  const uniqueSet = new Set();
  const uniqueArray = [];

  for (const obj of jsonArray) {
    const keyValue = obj[uniqueKey];

    if (!uniqueSet.has(keyValue)) {
      uniqueSet.add(keyValue);
      uniqueArray.push(obj);
    }
  }
  return uniqueArray;
}

export function getUniqueJsonArrayWithDefaultValues(
  jsonArray: PromptVariableProps[],
  uniqueKey: any,
  defaultJsonArray: PromptVariableProps[],
) {
  const uniqueSet = new Set();
  const uniqueArray = [];
  const defaultValues: { [key: string]: string } = {};

  defaultJsonArray.map((obj) => {
    defaultValues[obj.key as string] = obj.value;
  });

  for (const obj of jsonArray) {
    const keyValue = obj[uniqueKey] as string;

    if (!uniqueSet.has(keyValue)) {
      uniqueSet.add(keyValue);
      if (keyValue in defaultValues) {
        obj.value = defaultValues[keyValue] as string;
      }
      uniqueArray.push(obj);
    }
  }
  return uniqueArray;
}

export function generateLLmConfig(c: JsonObject): LlmConfigSchema {
  const config = {
    max_tokens: c?.max_tokens || 100,
    temperature: c?.temperature || 0,
  } as LlmConfigSchema;
  return config;
}

export function generatePrompt(
  template: string,
  data: Record<string, string>,
): string {
  let result = template;

  // Iterate through each replacement key and value
  for (const key of Object.keys(data)) {
    let placeholder = `{${key}}`;

    // TODO: $CHAT_HISTORY is not getting replaced
    if (placeholder.startsWith("$")) {
      // Add an escape character at the beginning of the string
      placeholder = "\\" + placeholder;
    }
    console.log(`key ${placeholder}`);
    const value = data[key] as string;

    // Replace all occurrences of the placeholder with the value
    result = result.replace(new RegExp(placeholder, "g"), value);
  }

  return result;
}

export function escapeStringRegexp(data: string): string {
  return data.replace(/[|\\{}()[\]^$+*?"]/g, "\\$&");
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

export function hasImageModels(llmModelType: ModelTypeType) {
  return (
    llmModelType === ModelTypeSchema.Enum.TEXT2IMAGE ||
    llmModelType === ModelTypeSchema.Enum.IMAGE2IMAGE
  );
}

export const getEditorVersion = (
  modeType: ModelTypeType,
  providerName: string,
  modelName: string,
) => {
  return providerModels[`${modeType as keyof typeof providerModels}`].models[
    `${providerName}`
  ]?.find((mod) => mod.name === modelName)?.editorVersion;
};
