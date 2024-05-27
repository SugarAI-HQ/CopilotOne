import * as z from "zod";
import root from "window-or-global";

export const promptTemplateSchema = z.string();
export type PromptTemplateType = z.infer<typeof promptTemplateSchema>;

export const primaryColor = "#8000FF";
export const secondaryColor = "#FFFFFF";

export const copilotSylePositionSchema = z.enum([
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "top-center",
  "bottom-center",
]);

export const copilotSyleKeyboardPositionSchema = z.enum([
  "left",
  "right",
  "bottom",
  "top",
]);

export const stringOptional = z.string().optional();

export const messageRoleEnum = z.enum(["assistant", "system", "tool"]);

export type MessageRoleType = z.infer<typeof messageRoleEnum>;

export type CopilotStylePositionType = z.infer<
  typeof copilotSylePositionSchema
>;

export type CopilotSyleKeyboardPositionSchema = z.infer<
  typeof copilotSyleKeyboardPositionSchema
>;

export const copilotSyleContainerSchema = z.object({
  position: copilotSylePositionSchema,
  margin: stringOptional,
});

export type CopilotSyleContainerType = z.infer<
  typeof copilotSyleContainerSchema
>;

export const copilotSyleThemeSchema = z.object({
  primaryColor: stringOptional,
  secondaryColor: stringOptional,
  fontFamily: stringOptional,
  fontSize: stringOptional,
  textColor: stringOptional,
});

export type CopilotSyleThemeType = z.infer<typeof copilotSyleThemeSchema>;

// export const copilotThemeProps = z.object({});

export const copilotStyleVoiceButtonSchema = z.object({
  bgColor: stringOptional,
  color: stringOptional,
  width: stringOptional,
  height: stringOptional,
  iconSize: stringOptional,
});

export const copilotStyleKeyboardButtonSchema = z.object({
  bgColor: stringOptional,
  color: stringOptional,
  position: copilotSyleKeyboardPositionSchema,
  iconSize: stringOptional,
  placeholder: stringOptional,
});

export type CopilotSyleButtonType = z.infer<
  typeof copilotStyleVoiceButtonSchema
>;

export const copilotAssistantVoiceType = z.enum([
  "auto",
  "Google हिन्दी",
  "Lekha",
  "Nicky",
]);
export const copilotAssistantLangType = z.enum(["auto", "hi-IN", "en-US"]);

export type CopilotAssistantVoiceSchema = z.infer<
  typeof copilotAssistantVoiceType
>;
export type copilotAssistantLangSchema = z.infer<
  typeof copilotAssistantLangType
>;

export const copilotAiSchema = z.object({
  defaultPromptTemplate: promptTemplateSchema.optional(),
  defaultPromptVariables: z.record(z.any()).optional(),
  successResponse: z.string(),
  successSound: z.object({ android: z.number(), ios: z.number() }),
  failureResponse: z.string(),
  lang: z.string().optional(),
  voice: z.string().optional(),
});

export const copilotToolTipSchema = z.object({
  welcomeMessage: stringOptional,
  delay: z.number().optional(),
  duration: z.number().optional(),
  disabled: z.boolean(),
});

export type CopilotSyleTooltipType = z.infer<typeof copilotToolTipSchema>;

export const copilotSytleSchema = z.object({
  container: copilotSyleContainerSchema,
  theme: copilotSyleThemeSchema,
  voiceButton: copilotStyleVoiceButtonSchema,
  keyboardButton: copilotStyleKeyboardButtonSchema,
  toolTip: copilotToolTipSchema,
});

export type CopilotSytleType = z.infer<typeof copilotSytleSchema>;
export type CopilotAiType = z.infer<typeof copilotAiSchema>;
// export type CopilotContainerPropsType = z.infer<typeof copilotContainerProps>;
// export type CopilotThemePropsType = z.infer<typeof copilotThemeProps>;

export const copilotAiDefaults: CopilotAiType = {
  defaultPromptTemplate: "",
  defaultPromptVariables: {},
  successResponse: "Done",
  successSound: {
    android: 24,
    ios: 1256,
  },
  failureResponse: "Something went wrong",
  lang: "auto",
  voice: "auto",
};

export const copilotStyleDefaults: CopilotSytleType = {
  container: {
    position: "bottom-right",
    margin: "0px",
  },

  theme: {
    primaryColor,
    secondaryColor,
    fontFamily: "inherit",
    fontSize: "14px",
    textColor: "inherit",
  },
  voiceButton: {
    bgColor: primaryColor,
    color: secondaryColor,
    width: "60px",
    height: "60px",
    iconSize: "25",
  },
  keyboardButton: {
    bgColor: primaryColor,
    color: secondaryColor,
    position: "left",
    iconSize: "25",
    placeholder: "Start typing...",
  },
  toolTip: {
    welcomeMessage: "Tap & Speak: Let AI Guide Your Journey!",
    disabled: true,
    delay: 3000,
    duration: 7,
  },
};

export const copilotConfigSchema = z.object({
  copilotId: z.string(), // No validation on appId itself

  server: z.object({
    endpoint: z.string().url(), // Ensure valid URL format
    token: z.string(), // No validation on token itself
    // headers: z.record(z.any()),
  }),

  ai: copilotAiSchema.default(copilotAiDefaults).optional(),

  style: copilotSytleSchema.default(copilotStyleDefaults),

  client: z
    .object({
      userId: z.string().or(z.null()),
    })
    .optional(),
});

export type CopilotConfigType = z.infer<typeof copilotConfigSchema>;

export const DEFAULT_GROUP_ID: string = "DEFAULT_GROUP_ID";

export const scopeDefaults = {
  scope1: "",
  scope2: "",
  groupId: DEFAULT_GROUP_ID,
};

export const embeddingScopeSchema = z.object({
  // clientUserId: z.string(),
  // copilotId: z.string(),
  scope1: z.string().optional().default(""),
  scope2: z.string().optional().default(""),
  groupId: z.string().default(DEFAULT_GROUP_ID),
});
export type EmbeddingScopeType = z.infer<typeof embeddingScopeSchema>;

export const embeddingScopeWithUserSchema = embeddingScopeSchema.extend({
  clientUserId: z.string(),
});

export type EmbeddingScopeWithUserType = z.infer<
  typeof embeddingScopeWithUserSchema
>;

// export interface EmbeddingScopeType {
//   projectId: string;
//   scope1?: string; // Optional string with default value ""
//   scope2?: string; // Optional string with default value ""
//   clientUserId?: string; // Optional string
//   identifier: string;
// }

export const promptVariablesSchema = z.record(z.any());
export type PromptVariablesType = z.infer<typeof promptVariablesSchema>;

export const actionParameterDataTypeSchema = z.enum([
  "boolean",
  "string",
  "integer",
  "float",
  "number",
  "array",
  "object",
]);
export type ActionParameterDataTypeSchema = z.infer<
  typeof actionParameterDataTypeSchema
>;

export const actionParameterSchema = z.object({
  type: actionParameterDataTypeSchema,
  enum: z.array(z.string()).optional(),
  description: z.string().min(10),
});
export type ActionParameterType = z.infer<typeof actionParameterSchema>;

export const actionParametersSchema = z.object({
  type: z.literal("object"),
  properties: z.record(z.string(), actionParameterSchema),
  required: z.array(z.string()),
});
export type ActionParametersType = z.infer<typeof actionParametersSchema>;

export const actionDefinitionSchema = z.object({
  type: z.literal("function"),
  function: z.object({
    name: z.string().min(5).max(50),
    description: z.string().min(10),
    parameters: actionParametersSchema,
  }),
});
export type ActionDefinitionType = z.infer<typeof actionDefinitionSchema>;

export const actionRegistrationParameterSchema = z.object({
  name: z.string(),
  type: actionParameterDataTypeSchema,
  enum: z.array(z.string()).optional(),
  description: z.string().min(10),
  required: z.boolean(),
});
export type ActionRegistrationParameterType = z.infer<
  typeof actionRegistrationParameterSchema
>;

export const actionRegistrationParametersSchema = z.object({
  type: z.literal("object"),
  properties: z.record(z.string(), actionParameterSchema),
});
export type ActionRegistrationParametersType = z.infer<
  typeof actionRegistrationParametersSchema
>;

export const actionRegistrationSchema = z.object({
  // type: z.literal("function"),
  // function: z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(10),
  parameters: z.array(actionRegistrationParameterSchema),
  // required: z.array(z.string()),
  // }),
});
export type ActionRegistrationType = z.infer<typeof actionRegistrationSchema>;

export function defaultGroupId() {
  return root?.location?.pathname;
}

export interface BaseAssistantProps {
  id?: string | null;
  promptTemplate?: PromptTemplateType | null;
  promptVariables?: PromptVariablesType;
  scope?: EmbeddingScopeType;
  style?: any;
  keyboardButtonStyle?: any;
  messageStyle?: any;
  voiceButtonStyle?: any;
  toolTipContainerStyle?: any;
  toolTipMessageStyle?: any;
  position?: CopilotStylePositionType;
  keyboardPosition?: CopilotSyleKeyboardPositionSchema;
  actionsFn?: Function;
  actionCallbacksFn?: Function;
}

export const shouldForwardProp = (prop: string) =>
  prop !== "container" && prop !== "position";
