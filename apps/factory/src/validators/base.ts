import { string, z } from "zod";
import { OverridableStringUnion } from "@mui/types";
import { ChipPropsColorOverrides } from "@mui/material/Chip";

export const promptEnvironment = z.enum(["DEV", "PREVIEW", "RELEASE"]);
export type PromptEnvironment = z.infer<typeof promptEnvironment>;

export type Model = {
  name: string;
  label: string;
  enabled: boolean;
  role: boolean;
};

export type Provider = Model;

type ModelType = {
  label: string;
  enabled: boolean;
  providers: Provider[];
  models: Record<string, Model[]>;
};

type ProviderModels = {
  TEXT2TEXT: ModelType;
  TEXT2IMAGE: ModelType;
};

export const providerModels: ProviderModels = {
  TEXT2TEXT: {
    label: "Text-to-Text",
    enabled: true,
    providers: [
      { name: "llama2", label: "Llama2", enabled: true, role: false },
      { name: "mistral", label: "Mistral", enabled: true, role: false },
      { name: "openai", label: "OpenAI", enabled: true, role: false },
      { name: "falcon", label: "Falcon", enabled: false, role: false },
      { name: "mpt", label: "MPT", enabled: false, role: false },
    ],
    models: {
      openai: [
        // { name: "davinci", label: "Davinci", enabled: false, role: false },
        {
          name: "gpt-3.5-turbo",
          label: "Gpt 3.5 Turbo",
          enabled: true,
          role: true,
        },
        { name: "gpt-4", label: "Gpt 4", enabled: true, role: true },
      ],
      llama2: [
        { name: "7b", label: "7B", enabled: true, role: false },
        { name: "13b", label: "13B", enabled: true, role: false },
        { name: "70b", label: "70B", enabled: true, role: false },
      ],
      falcon: [
        { name: "7b", label: "7B", enabled: false, role: false },
        { name: "40b", label: "40B", enabled: false, role: false },
        { name: "180b", label: "180B", enabled: false, role: false },
      ],
      mpt: [
        { name: "7b", label: "7B", enabled: false, role: false },
        { name: "30b", label: "30B", enabled: false, role: false },
      ],
      mistral: [
        {
          name: "7b-instruct-v01  ",
          label: "7B Instruct v0.1",
          enabled: true,
          role: false,
        },
      ],
    },
  },

  TEXT2IMAGE: {
    label: "Text-to-Image",
    enabled: true,
    providers: [
      { name: "openai", label: "OpenAI", enabled: true, role: false },
      { name: "runwayml", label: "RunwayMl", enabled: true, role: false },
      { name: "prompthero", label: "PromptHero", enabled: true, role: false },
      {
        name: "stabilityai",
        label: "StabilityAI",
        enabled: false,
        role: false,
      },
    ],
    models: {
      openai: [
        {
          name: "dall-e",
          label: "Dall-E",
          enabled: true,
          role: false,
        },
        // {
        //   name: "dall-e-2",
        //   label: "Dall-E-2",
        //   enabled: true,
        //   role: false,
        // },
      ],
      runwayml: [
        {
          name: "stable-diffusion-v1-5",
          label: "Stable Diffusion V1-5",
          enabled: true,
          role: false,
        },
      ],
      prompthero: [
        {
          name: "openjourney",
          label: "Open Journey",
          enabled: true,
          role: false,
        },
      ],
      stabilityai: [
        { name: "sdxl", label: "SDXL", enabled: false, role: false },
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

export const promptRole = z.enum(["user", "assistant"]);

export const providerWithoutRoleType = z.enum([""]);
