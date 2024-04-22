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
  margin: z.string(),
});

export type CopilotSyleContainerType = z.infer<
  typeof copilotSyleContainerSchema
>;

export const copilotSyleThemeSchema = z.object({
  primaryColor: z.string(),
  secondaryColor: z.string(),
  fontFamily: z.string(),
  fontSize: z.string(),
  textColor: z.string(),
});

export type CopilotSyleThemeType = z.infer<typeof copilotSyleThemeSchema>;

// export const copilotThemeProps = z.object({});

export const copilotStyleVoiceButtonSchema = z.object({
  bgColor: z.string(),
  color: z.string(),
  width: z.string(),
  height: z.string(),
  iconSize: z.string(),
});

export const copilotStyleKeyboardButtonSchema = z.object({
  bgColor: z.string(),
  color: z.string(),
  position: copilotSyleKeyboardPositionSchema,
  iconSize: z.string().optional(),
  placeholder: z.string(),
});

export type CopilotSyleButtonType = z.infer<
  typeof copilotStyleVoiceButtonSchema
>;

export const copilotAiSchema = z.object({
  defaultPromptTemplate: promptTemplateSchema.optional(),
  defaultPromptVariables: z.record(z.any()).optional(),

  successResponse: z.string(),
  failureResponse: z.string(),
});

export const copilotToolTipSchema = z.object({
  welcomeMessage: z.string().optional(),
  delay: z.number().optional(),
  duration: z.number().optional(),
  disabled: z.boolean().default(true),
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
  failureResponse: "Something went wrong",
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
    textColor: "", // or any default value you want
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

export const embeddingScopeSchema = z.object({
  // clientUserId: z.string(),
  // copilotId: z.string(),
  scope1: z.string().optional().default(""),
  scope2: z.string().optional().default(""),
  groupId: z.string(),
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

export const DEFAULT_GROUP_ID: string = "DEFAULT_GROUP_ID";

export function defaultGroupId() {
  return root?.location?.pathname;
}
