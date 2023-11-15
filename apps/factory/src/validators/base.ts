import { string, z } from "zod";
import { OverridableStringUnion } from "@mui/types";
import { ChipPropsColorOverrides } from "@mui/material/Chip";

export const promptEnvironment = z.enum(["DEV", "PREVIEW", "RELEASE"]);
export type PromptEnvironment = z.infer<typeof promptEnvironment>;

export type Model = {
  name: string;
  label: string;
  enabled: boolean;
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
      { name: "llama2", label: "Llama2", enabled: true },
      { name: "openai", label: "OpenAI", enabled: false },
      { name: "falcon", label: "Falcon", enabled: false },
      { name: "mpt", label: "MPT", enabled: false },
    ],
    models: {
      openai: [
        { name: "davinci", label: "Davinci", enabled: false },
        { name: "gpt-3.5-turbo", label: "Gpt 3.5 Turbo", enabled: false },
        { name: "gpt-4", label: "Gpt 4", enabled: false },
      ],
      llama2: [
        { name: "7b", label: "7B", enabled: true },
        { name: "13b", label: "13B", enabled: true },
        { name: "70b", label: "70B", enabled: true },
      ],
      falcon: [
        { name: "7b", label: "7B", enabled: false },
        { name: "40b", label: "40B", enabled: false },
        { name: "180b", label: "180B", enabled: false },
      ],
      mpt: [
        { name: "7b", label: "7B", enabled: false },
        { name: "30b", label: "30B", enabled: false },
      ],
    },
  },
  TEXT2IMAGE: {
    label: "Text-to-Image",
    enabled: true,
    providers: [
      { name: "runwayml", label: "RunwayMl", enabled: true },
      { name: "prompthero", label: "PromptHero", enabled: true },
      { name: "stabilityai", label: "StabilityAI", enabled: false },
    ],
    models: {
      runwayml: [
        {
          name: "stable-diffusion-v1-5",
          label: "Stable Diffusion V1-5",
          enabled: true,
        },
      ],
      prompthero: [
        { name: "openjourney", label: "Open Journey", enabled: true },
      ],
      stabilityai: [{ name: "sdxl", label: "SDXL", enabled: false }],
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
