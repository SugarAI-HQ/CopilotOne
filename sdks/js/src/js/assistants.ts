import { createElement } from "react";
// import { createRoot } from "react-dom/client";
import { TextAssistant } from "../react/assistants/text_assistant";
import { VoiceAssistant } from "../react/assistants/voice_assistant";
import { CopilotProvider } from "~/react/hooks/useCopilot";

export const predefindedAssistants = { VoiceAssistant, TextAssistant };

export const addAssistant = (
  containerId: string,
  assistant: string,
  assistantConfig: any,
  assistants: Array<Record<string, {}>> = [],
) => {
  assistants.push({
    containerId: containerId,
    assistant: assistant,
    assistantConfig: assistantConfig,
  });
  return assistants;
};
export const removeAssistant = (containerId: string, assistants: [any]) => {
  const index = assistants.findIndex(
    (assistant) => assistant.containerId === containerId,
  );
  if (index !== -1) {
    assistants.splice(index, 1);
  }
};

export const App = (assistant, copilotConfig, actions, actionCallbacks) => {
  const { assistant: assistantType, assistantConfig } = assistant;
  const assistantComponent = predefindedAssistants[assistantType];

  if (assistantComponent) {
    return createElement(CopilotProvider, {
      config: copilotConfig,
      children: createElement(assistantComponent, {
        actionsFn: () => actions,
        actionCallbacksFn: () => actionCallbacks,
        ...assistantConfig,
      }),
    });
  } else {
    PROD: console.error(
      `Assistant '${assistantType}' not found in preDefinedAssistants`,
    );
    return null;
  }
};
