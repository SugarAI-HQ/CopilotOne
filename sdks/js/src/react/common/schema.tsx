import {
  type CopilotStylePositionType,
  type CopilotSyleKeyboardPositionSchema,
  type EmbeddingScopeType,
  type PromptTemplateType,
  type PromptVariablesType,
} from "../../core/schema";

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
  keyboardPostion: string;
}

export const shouldForwardProp = (prop: string) =>
  prop !== "container" && prop !== "position";
