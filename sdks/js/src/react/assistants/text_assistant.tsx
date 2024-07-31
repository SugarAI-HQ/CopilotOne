import React, { useState, useEffect, useRef } from "react";
import {
  type EmbeddingScopeWithUserType,
  type CopilotStylePositionType,
  type BaseAssistantProps,
  type CopilotSyleContainerType,
  copilotStyleDefaults,
  scopeDefaults,
  shouldForwardProp,
  loadCurrentConfig,
  useCopilot,
} from "@sugar-ai/core";

import { StyleSheetManager } from "styled-components";

import { CopilotContainer } from "./base_styled";
import { GlobalStyle } from "./reset_css";
import Keyboard from "./components/keyboard";
import Message from "./components/message";
import ToolTip from "./components/tooltip";
import TextBox from "./components/textbox";

import root from "window-or-global";
import { getKeyInSession, setKeyInSession } from "../session";

export const TextAssistant = ({
  id = null,
  promptTemplate = null,
  promptVariables = {},
  scope = scopeDefaults,
  style = {},
  keyboardButtonStyle = {},
  messageStyle = {},
  toolTipContainerStyle = {},
  toolTipMessageStyle = {},
  position = copilotStyleDefaults?.container?.position ?? "bottom-right",
  keyboardPosition = copilotStyleDefaults?.keyboardButton?.position,
  actionsFn,
  actionCallbacksFn,
}: BaseAssistantProps) => {
  const [buttonId, setButtonName] = useState<string>(position as string);

  const [hideToolTip, setHideToolTip] = useState(true);
  const [isprocessing, setIsprocessing] = useState(false);

  const [finalOutput, setFinalOutput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");

  const [hideTextButton, setHideTextButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");

  const { config, clientUserId, textToAction } = useCopilot();

  const {
    actions,
    actionCallbacks,
    currentStyle,
    currentAiConfig,
    currentNudgeConfig,
  } = loadCurrentConfig(config, actionsFn, actionCallbacksFn);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tipConfig, setTipConfig] = useState({
    isEnabled: false,
    text: "",
    duration: 7,
  });

  if (promptTemplate == null && config?.ai?.defaultPromptTemplate == null) {
    throw new Error(
      "Both promptTemplate and config.prompt.defaultTemmplate are null. Set atleast one of them",
    );
  }
  if (!promptTemplate && config?.ai?.defaultPromptTemplate) {
    promptTemplate = config?.ai?.defaultPromptTemplate;
  }

  useEffect(() => {
    setButtonName(id ?? (position as string));
    const timer = setTimeout(async () => {
      await welcomeNudge();
    }, currentNudgeConfig?.welcome?.delay * 1000);
    setHideToolTip(true);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const enableKeyboard = () => {
    setHideTextButton(!hideTextButton);
  };

  scope = { ...scopeDefaults, ...scope };

  const processTextToText = async (input: string) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    setIsprocessing(true);
    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
    };
    const aiResponse = await textToAction(
      promptTemplate as string,
      input,
      currentPromptVariables,
      newScope,
      false,
      4,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });
    if (typeof aiResponse === "string") {
      setAiResponse(aiResponse);
    }
  };

  const startSending = async () => {
    const newTextMessage = textMessage;
    setTextMessage("");
    setAiResponse("");
    setFinalOutput(newTextMessage);
    await processTextToText(newTextMessage);
  };

  const triggerNudgeOncePerSession = async (action, config) => {
    const actionKey = `last${action}NudgeAt`;

    if (!config.enabled) {
      console.log(`[nudge] ${action} Not enabled`);
      return;
    }

    const isAlreadyShown = getKeyInSession(actionKey);

    if (isAlreadyShown) {
      console.log(`[nudge ] ${action} Already shown`);
      return;
    }

    // Perform the action
    await triggerNudge(action, config);

    // Set the flag in local storage
    setKeyInSession(actionKey, Date.now().toString());
  };

  const welcomeNudge = async () => {
    triggerNudgeOncePerSession("Welcome", currentNudgeConfig?.welcome);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const idleNudge = async () => {
    triggerNudgeOncePerSession("Idle", currentNudgeConfig?.idle);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  // const stuckNudge = async () => {
  //   triggerNudgeOncePerSession("Stuck", currentNudgeConfig?.stuck);
  //   // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  // };

  const exitNudge = async () => {
    console.log("[nudge] called exit nudge");

    // triggerNudgeOncePerSession("Exit", currentNudgeConfig?.exit);
    triggerNudge("Exit", currentNudgeConfig?.exit);

    // await triggerNudge(currentNudgeConfig?.exit);
    // await processSpeechToText(currentNudgeConfig?.exit?.text, false, true);
  };

  // const successNudge = async () => {
  //   DEV: console.log("success nudge message", currentNudgeConfig.success.text);
  //   await triggerNudge(currentNudgeConfig?.success);
  // };

  let timeSpentTimer: any | null = null;
  let startTime: number = Date.now();
  let elapsedTime: number = 0;

  // Function to handle threshold exceeded
  function onStuck(page: string): void {
    console.log(
      `Time spent on ${page} : ${elapsedTime} exceeded the threshold.`,
    );
    triggerNudgeOncePerSession("Stuck", currentNudgeConfig?.stuck);
    // Add your custom logic here (e.g., send data to server, display message, etc.)
  }
  // Function to track time spent on page
  function trackTimeSpentOnPage(): void {
    const threshold = currentNudgeConfig?.stuck?.timeout * 1000 || 30000;

    if (threshold === 0) {
      return; // No threshold set for this page
    }

    const checkTime = () => {
      if (document.visibilityState === "visible") {
        startTime = Date.now();
        timeSpentTimer = setTimeout(() => {
          elapsedTime += (Date.now() - startTime) / 1000;
          console.log(`Time spent on page: ${elapsedTime} seconds`);
          if (elapsedTime * 1000 >= threshold) {
            onStuck(root.location.pathname);
          }
        }, threshold);
      } else {
        if (timeSpentTimer !== null) {
          clearTimeout(timeSpentTimer);
          timeSpentTimer = null;
          elapsedTime += (Date.now() - startTime) / 1000;
        }
      }
    };

    checkTime(); // Initial check
  }

  const triggerNudge = async (action: string, config: any) => {
    if (!config.enabled) {
      DEV: console.log(`[nudge] ${action} not enabled`);
      return;
    }

    let nudgeText = config?.text;

    // Load text if in "ai" mode
    if (config?.textMode === "ai") {
      const aiNudgeText = await upsertNudgeText(action, config, true);

      // only override if able to generate response, else fallback to manual
      if (aiNudgeText) {
        nudgeText = aiNudgeText;
      }
    } else {
      await upsertNudgeText(action, config, false);
    }

    DEV: console.log(`[nudge] ${action} message:`, nudgeText);
    // Speak

    // if (config?.voiceEnabled) {
    //   return speak(nudgeText);
    // }

    setHideToolTip(false);

    // Set tooltip
    setTipConfig({
      isEnabled: config?.enabled,
      text: nudgeText,
      duration: config?.duration,
    });
  };

  const upsertNudgeText = async (
    action: string,
    nudgeConfig: any,
    create: boolean,
  ): Promise<string | boolean> => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    setIsprocessing(true);

    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
      ...nudgeConfig.promptVariables,
    };

    await textToAction(
      (nudgeConfig.promptTemplate || promptTemplate) as string,
      create ? "" : nudgeConfig.text,
      {
        ...currentPromptVariables,
        "#ACTION": action,
      },
      newScope,
      true,
      nudgeConfig.chatHistorySize,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });

    return false;
  };

  // const resetTimer = () => {
  //   if (timeoutRef.current) {
  //     clearTimeout(timeoutRef.current);
  //   }
  //   timeoutRef.current = setTimeout(
  //     idleNudge,
  //     currentNudgeConfig.idle.timeout * 1000,
  //   );
  // };

  // useEffect(() => {
  //   if (currentNudgeConfig?.idle?.enabled) {
  //     root.addEventListener("mousemove", resetTimer);
  //     root.addEventListener("keydown", resetTimer);
  //   }
  //   return () => {
  //     if (currentNudgeConfig?.idle?.enabled) {
  //       root.removeEventListener("mousemove", resetTimer);
  //       root.removeEventListener("keydown", resetTimer);
  //     }

  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }
  //   };
  // }, [currentNudgeConfig?.idle?.enabled]);

  const trackIdle = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(
      idleNudge,
      currentNudgeConfig.idle.timeout * 1000,
    );
  };

  useEffect(() => {
    if (currentNudgeConfig?.idle?.enabled) {
      root.addEventListener("mousemove", trackIdle);
      root.addEventListener("keydown", trackIdle);
    }
    return () => {
      if (currentNudgeConfig?.idle?.enabled) {
        root.removeEventListener("mousemove", trackIdle);
        root.removeEventListener("keydown", trackIdle);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentNudgeConfig?.idle?.enabled]);

  const handleBeforeUnload = async (event) => {
    // Recommended
    event.preventDefault();
    const message =
      "Hola, Are you sure you want to leave? Changes you made may not be saved.";
    event.returnValue = message; // Standard message for all modern browsers

    // Included for legacy support, e.g. Chrome/Edge < 119
    // event.returnValue = true;

    if (currentNudgeConfig?.exit?.enabled) {
      exitNudge();
    }

    // trackTimeSpentOnPage();
    if (timeSpentTimer !== null) {
      clearTimeout(timeSpentTimer);
      elapsedTime += (Date.now() - startTime) / 1000;
    }
    // Return false to keep the page from being unloaded
    return false;
  };

  const handleVisibilityChanged = async (event) => {
    if (root.document.visibilityState === "hidden" && timeSpentTimer !== null) {
      clearTimeout(timeSpentTimer);
      elapsedTime += (Date.now() - startTime) / 1000;
    } else {
      trackTimeSpentOnPage();
    }
  };

  useEffect(() => {
    // resetSession();
    // root.addEventListener("load", trackTimeSpentOnPage);
    trackTimeSpentOnPage();
    root.document.addEventListener("visibilitychange", handleVisibilityChanged);

    if (
      currentNudgeConfig?.exit?.enabled ||
      currentNudgeConfig?.stuck?.enabled
    ) {
      root.addEventListener("beforeunload", handleBeforeUnload);
      root.addEventListener("visibilitychange", handleVisibilityChanged);
    }

    return () => {
      root.removeEventListener("load", trackTimeSpentOnPage);
    };
  }, [currentNudgeConfig?.exit?.enabled, currentNudgeConfig?.stuck?.enabled]);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <GlobalStyle />
      <CopilotContainer
        id={`sugar-ai-copilot-${buttonId}`}
        className="sugar-ai-copilot-container"
        container={currentStyle?.container as CopilotSyleContainerType}
        position={position as CopilotStylePositionType}
        style={style}
      >
        {!hideTextButton && (
          <>
            <Keyboard
              style={keyboardButtonStyle}
              currentStyle={currentStyle?.keyboardButton}
              enableKeyboard={enableKeyboard}
            />

            {!hideToolTip && tipConfig?.isEnabled && (
              <ToolTip
                currentStyle={currentStyle}
                position={position}
                buttonId={buttonId}
                toolTipContainerStyle={toolTipContainerStyle}
                toolTipMessageStyle={toolTipMessageStyle}
                tipMessage={tipConfig?.text}
                config={tipConfig}
              />
            )}
          </>
        )}

        {(aiResponse || finalOutput) && (
          <Message
            finalOutput={finalOutput}
            aiResponse={aiResponse}
            currentStyle={currentStyle}
            position={position}
            buttonId={buttonId}
            messageStyle={messageStyle}
          />
        )}
      </CopilotContainer>
      {hideTextButton && (
        <TextBox
          currentStyle={currentStyle}
          position={position}
          buttonId={buttonId}
          setTextMessage={setTextMessage}
          textMessage={textMessage}
          startSending={startSending}
          enableKeyboard={enableKeyboard}
          isprocessing={isprocessing}
          iskeyboard={true}
        />
      )}
    </StyleSheetManager>
  );
};
