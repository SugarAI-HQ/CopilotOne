import * as z from "zod";
import root from "window-or-global";

export const promptTemplateSchema = z.string();
export type PromptTemplateType = z.infer<typeof promptTemplateSchema>;

export const primaryColor = "#8d00ff";
export const secondaryColor = "#FFFFFF";

export const copilotSylePositionSchema = z.enum([
  "top-left",
  "top-right",
  "bottom-left",
  "bottom-right",
  "top-center",
  "bottom-center",
]);
export type CopilotStylePositionType = z.infer<
  typeof copilotSylePositionSchema
>;

export const copilotSyleContainerSchema = z.object({
  position: copilotSylePositionSchema.default("bottom-right"),
  margin: z.string().default("0px"),
});

export type CopilotSyleContainerType = z.infer<
  typeof copilotSyleContainerSchema
>;

export const copilotSyleThemeSchema = z.object({
  primaryColor: z.string().default(primaryColor),
  secondaryColor: z.string().default(secondaryColor),
  fontFamily: z.string().default("inherit"),
  fontSize: z.string().default("16px"),
  textColor: z.string().optional(),
});

export type CopilotSyleThemeType = z.infer<typeof copilotSyleThemeSchema>;

// export const copilotThemeProps = z.object({});

export const copilotSyleButtonSchema = z.object({
  bgColor: z.string().default(primaryColor),
  color: z.string().default(secondaryColor),
  width: z.string().default("60px"),
  height: z.string().default("60px"),
  iconSize: z.string().default("20"),
});

export type CopilotSyleButtonType = z.infer<typeof copilotSyleButtonSchema>;

export const copilotSytleSchema = z.object({
  container: copilotSyleContainerSchema,
  theme: copilotSyleThemeSchema,
  button: copilotSyleButtonSchema,
});

export type CopilotSytleType = z.infer<typeof copilotSytleSchema>;
// export type CopilotContainerPropsType = z.infer<typeof copilotContainerProps>;
// export type CopilotThemePropsType = z.infer<typeof copilotThemeProps>;

export const copilotStyleDefaults: CopilotSytleType = {
  container: {
    position: "bottom-right",
    margin: "0px",
  },

  theme: {
    primaryColor,
    secondaryColor,
    fontFamily: "inherit",
    fontSize: "16px",
    textColor: undefined, // or any default value you want
  },
  button: {
    bgColor: primaryColor,
    color: secondaryColor,
    width: "60px",
    height: "60px",
    iconSize: "20",
  },
};

export const copilotConfigSchema = z.object({
  copilotId: z.string(), // No validation on appId itself

  server: z.object({
    endpoint: z.string().url(), // Ensure valid URL format
    token: z.string(), // No validation on token itself
    // headers: z.record(z.any()),
  }),

  ai: z
    .object({
      defaultPromptTemplate: promptTemplateSchema.optional(),
      defaultPromptVariables: z.record(z.any()).optional(),

      successResponse: z.string().default("Done"),
      failureResponse: z.string().default("Something went wrong"),
    })
    .optional(),

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

export const skillParameterDataTypeSchema = z.enum([
  "boolean",
  "string",
  "integer",
  "float",
  "number",
  "array",
  "object",
]);
export type SkillParameterDataTypeSchema = z.infer<
  typeof skillParameterDataTypeSchema
>;

export const skillParameterSchema = z.object({
  type: skillParameterDataTypeSchema,
  enum: z.array(z.string()).optional(),
  description: z.string().min(10),
});
export type SkillParameterType = z.infer<typeof skillParameterSchema>;

export const skillParametersSchema = z.object({
  type: z.literal("object"),
  properties: z.record(z.string(), skillParameterSchema),
  required: z.array(z.string()),
});
export type SkillParametersType = z.infer<typeof skillParametersSchema>;

export const skillDefinitionSchema = z.object({
  type: z.literal("function"),
  function: z.object({
    name: z.string().min(5).max(50),
    description: z.string().min(10),
    parameters: skillParametersSchema,
  }),
});
export type SkillDefinitionType = z.infer<typeof skillDefinitionSchema>;

export const skillRegistrationParameterSchema = z.object({
  name: z.string(),
  type: skillParameterDataTypeSchema,
  enum: z.array(z.string()).optional(),
  description: z.string().min(10),
  required: z.boolean(),
});
export type SkillRegistrationParameterType = z.infer<
  typeof skillRegistrationParameterSchema
>;

export const skillRegistrationParametersSchema = z.object({
  type: z.literal("object"),
  properties: z.record(z.string(), skillParameterSchema),
});
export type SkillRegistrationParametersType = z.infer<
  typeof skillRegistrationParametersSchema
>;

export const skillRegistrationSchema = z.object({
  // type: z.literal("function"),
  // function: z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(10),
  parameters: z.array(skillRegistrationParameterSchema),
  // required: z.array(z.string()),
  // }),
});
export type SkillRegistrationType = z.infer<typeof skillRegistrationSchema>;

export const DEFAULT_GROUP_ID: string = "DEFAULT_GROUP_ID";

export function defaultGroupId() {
  return root?.location?.pathname;
}
