import {
  type CopilotSytleType,
  copilotStyleDefaults,
  copilotAiDefaults,
  copilotNudgeDefaults,
} from "./schema";

export const loadCurrentConfig = (config, actionsFn, actionCallbacksFn) => {
  const currentTheme = {
    ...copilotStyleDefaults.theme,
    ...config?.style?.theme,
  };

  DEV: console.log(`currentTheme ---> ${JSON.stringify(currentTheme)}`);

  const actions = typeof actionsFn === "function" ? actionsFn() : [];
  const actionCallbacks =
    typeof actionCallbacksFn === "function" ? actionCallbacksFn() : [];

  const currentStyle: CopilotSytleType = {
    ...copilotStyleDefaults,
    container: {
      ...copilotStyleDefaults.container,
      ...config?.style?.container,
    },
    theme: currentTheme,
    voiceButton: {
      ...copilotStyleDefaults.voiceButton,
      ...config?.style?.voiceButton,
      bgColor: currentTheme.primaryColor,
      color: currentTheme.secondaryColor,
    },
    keyboardButton: {
      ...copilotStyleDefaults.keyboardButton,
      ...config?.style?.keyboardButton,
      bgColor: currentTheme.primaryColor,
      color: currentTheme.secondaryColor,
    },
    // toolTip: {
    //   ...copilotStyleDefaults.toolTip,
    //   ...config?.style?.toolTip,
    // },
  };

  DEV: console.log(
    `copilotStyleDefaults ---> ${JSON.stringify(copilotStyleDefaults)}`,
  );

  DEV: console.log(`config?.style ---> ${JSON.stringify(config?.style)}`);

  DEV: console.log(`current Style ---> ${JSON.stringify(currentStyle)}`);

  const currentAiConfig = {
    ...copilotAiDefaults,
    ...config?.ai,
  };

  DEV: console.log(`current AI config ---> ${JSON.stringify(currentAiConfig)}`);

  const currentNudgeConfig = {
    ...copilotNudgeDefaults,
    ...config?.nudges,
  };

  DEV: console.log(
    `current voice nudge config ---> ${JSON.stringify(currentNudgeConfig)}`,
  );

  return {
    currentTheme,
    actions,
    actionCallbacks,
    currentStyle,
    currentAiConfig,
    currentNudgeConfig,
  };
};
