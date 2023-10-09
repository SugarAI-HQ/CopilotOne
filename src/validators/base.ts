import { z } from "zod";
import { OverridableStringUnion } from "@mui/types";
import { ChipPropsColorOverrides } from "@mui/material/Chip";

export const promptEnvironment = z.enum(["DEV", "PREVIEW", "RELEASE"]);
export type PromptEnvironment = z.infer<typeof promptEnvironment>;

export const providers = [
  ["openai", "OpenAI"],
  ["llama2", "Llama2"],
  ["falcon", "Falcon"],
  ["mpt", "MPT"],
];

export const models = {
  openai: [
    ["davinci", "Davinci"],
    ["gpt-3.5-turbo", "Gpt 3.5 Turbo"],
    ["gpt-4", "Gpt 4"],
  ],
  llama2: [
    ["7b", "7B"],
    // ["13b", "13B"],
    // ["70b", "70B"],
  ],
  falcon: [
    ["7b", "7B"],
    ["40b", "40B"],
    ["180b", "180B"],
  ],
  mpt: [
    ["7b", "7B"],
    ["30b", "30B"],
  ],
};
export const packageVisibility = z.enum(["PUBLIC", "PRIVATE"]);
export type PackageVisibility = z.infer<typeof packageVisibility>;

// export const stringOpt = z.union([z.string(), z.undefined()]);
export const stringOpt = z.string().optional();
export type StringOpt = z.infer<typeof stringOpt>;

export const publicUserSchema = z.object({
  name: z.string().nullable(),
  image: z.string().nullable(),
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
