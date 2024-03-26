import { string, z } from "zod";
import { OverridableStringUnion } from "@mui/types";
import { ChipPropsColorOverrides } from "@mui/material/Chip";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";

export const promptEnvironment = z.enum(["DEV", "PREVIEW", "RELEASE"]);
export type PromptEnvironment = z.infer<typeof promptEnvironment>;

export type Model = {
  name: string;
  label: string;
  enabled: boolean;
  editorVersion: number;
  toolEnabled: boolean;
};

export type Provider = Model;

type ModelType = {
  label: string;
  enabled: boolean;
  defaultProvider: string;
  defaultModel: string;
  providers: Provider[];
  models: Record<string, Model[]>;
  toolEnabled: boolean;
};

type ProviderModels = {
  TEXT2TEXT: ModelType;
  TEXT2IMAGE: ModelType;
  TEXT2CODE: ModelType;
  IMAGE2IMAGE: ModelType;
};

export const providerModels: ProviderModels = {
  TEXT2TEXT: {
    label: "Text-to-Text",
    enabled: true,
    defaultProvider: "llama2",
    defaultModel: "7b",
    toolEnabled: true,
    providers: [
      {
        name: "llama2",
        label: "Llama2",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
      {
        name: "mistral",
        label: "Mistral",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
      {
        name: "openai",
        label: "OpenAI",
        enabled: true,
        editorVersion: 0,
        toolEnabled: true,
      },
      {
        name: "falcon",
        label: "Falcon",
        enabled: false,
        editorVersion: 0,
        toolEnabled: false,
      },
      {
        name: "mpt",
        label: "MPT",
        enabled: false,
        editorVersion: 0,
        toolEnabled: false,
      },
    ],
    models: {
      openai: [
        // { name: "davinci", label: "Davinci", enabled: false, editorVersion: false },
        {
          name: "gpt-3.5-turbo",
          label: "Gpt 3.5 Turbo",
          enabled: true,
          editorVersion: 1,
          toolEnabled: true,
        },
        {
          name: "gpt-4",
          label: "Gpt 4",
          enabled: true,
          editorVersion: 1,
          toolEnabled: false,
        },
      ],
      llama2: [
        {
          name: "7b",
          label: "7B",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
        {
          name: "13b",
          label: "13B",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
        {
          name: "70b",
          label: "70B",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
      falcon: [
        {
          name: "7b",
          label: "7B",
          enabled: false,
          editorVersion: 0,
          toolEnabled: false,
        },
        {
          name: "40b",
          label: "40B",
          enabled: false,
          editorVersion: 0,
          toolEnabled: false,
        },
        {
          name: "180b",
          label: "180B",
          enabled: false,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
      mpt: [
        {
          name: "7b",
          label: "7B",
          enabled: false,
          editorVersion: 0,
          toolEnabled: false,
        },
        {
          name: "30b",
          label: "30B",
          enabled: false,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
      mistral: [
        {
          name: "Mistral-7B",
          label: "Mistral-7B",
          enabled: true,
          editorVersion: 2,
          toolEnabled: false,
        },
        // {
        //   name: "WizardCoder-34B",
        //   label: "WizardCoder-34B",
        //   enabled: true,
        //   editorVersion: false,
        // },
        {
          name: "Mistral-7B-Instruct-v0.1",
          label: "Mistral-7B-Instruct",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
    },
  },

  TEXT2IMAGE: {
    label: "Text-to-Image",
    enabled: true,
    defaultProvider: "stabilityai",
    defaultModel: "sdxl",
    toolEnabled: false,
    providers: [
      {
        name: "openai",
        label: "Open AI",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
      {
        name: "runwayml",
        label: "Runway ML",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
      {
        name: "prompthero",
        label: "Prompt Hero",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
      {
        name: "stabilityai",
        label: "Stability AI",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
    ],
    models: {
      stabilityai: [
        {
          name: "sdxl",
          label: "Stable Diffusion XL 1.0",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
      openai: [
        {
          name: "dall-e",
          label: "Dall-E-3",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
      runwayml: [
        {
          name: "stable-diffusion-v1-5",
          label: "Stable Diffusion V1-5",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
      prompthero: [
        {
          name: "openjourney",
          label: "Open Journey",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
    },
  },

  TEXT2CODE: {
    label: "Text-to-Code",
    enabled: true,
    defaultProvider: "WizardCoder",
    defaultModel: "WizardCoder-34B",
    toolEnabled: false,
    providers: [
      {
        name: "WizardCoder",
        label: "Wizard Coder",
        enabled: true,
        editorVersion: 0,
        toolEnabled: false,
      },
    ],
    models: {
      WizardCoder: [
        {
          name: "WizardCoder-34B",
          label: "WizardCoder-34B",
          enabled: true,
          editorVersion: 0,
          toolEnabled: false,
        },
      ],
    },
  },

  IMAGE2IMAGE: {
    label: "Image-to-Image",
    enabled: true,
    defaultProvider: "segmind",
    defaultModel: "sd1.5-img2img",
    toolEnabled: false,
    providers: [
      {
        name: "segmind",
        label: "Segmind",
        enabled: true,
        editorVersion: 3,
        toolEnabled: false,
      },
    ],
    models: {
      segmind: [
        {
          name: "sd1.5-img2img",
          label: "Stable Diffusion img2img",
          enabled: true,
          editorVersion: 3,
          toolEnabled: false,
        },
      ],
    },
  },
};

export const packageVisibility = z.enum(["PUBLIC", "PRIVATE"]);
export type PackageVisibility = z.infer<typeof packageVisibility>;

// export const stringOpt = z.union([z.string(), z.undefined()]);
export const stringOpt = z.string().optional();
export type StringOpt = z.infer<typeof stringOpt>;

export const publicUserSchema = z.object({
  name: z.string().nullable(),
  image: z.string().nullable(),
  username: z.string().nullable(),
});
export type PublicUserSchem = z.infer<typeof publicUserSchema>;

export type colorType = OverridableStringUnion<
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning",
  ChipPropsColorOverrides
>;

export const displayModes = z.enum(["EDIT", "VIEW"]);
export type DisplayModes = z.infer<typeof displayModes>;

enum PromptRole {
  USER = "user",
  ASSISTANT = "assistant",
  SYSTEM = "system",
}

export const PromptRoleEnum = z.nativeEnum(PromptRole);

export const providerWithoutRoleType = z.enum([""]);

export const llm = z.object({
  modelType: ModelTypeSchema.default(ModelTypeSchema.Enum.TEXT2TEXT),
  model: z.string(),
  provider: z.string(),
});
export type LLM = z.infer<typeof llm>;

export const getDefaultLLM = (modelType: ModelTypeType): LLM => {
  return {
    modelType: modelType,
    provider: providerModels[modelType].defaultProvider,
    model: providerModels[modelType].defaultModel,
  };
};
