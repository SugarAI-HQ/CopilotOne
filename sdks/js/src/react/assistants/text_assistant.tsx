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

  const welcomeNudge = async () => {
    DEV: console.log("welcome nudge message", currentNudgeConfig.welcome.text);
    await triggerNudge(currentNudgeConfig?.welcome);
  };

  const idleNudge = async () => {
    DEV: console.log("Idle nudge message", currentNudgeConfig.idle.text);
    await triggerNudge(currentNudgeConfig?.idle);
  };

  const exitNudge = async () => {
    DEV: console.log("exit nudge message", currentNudgeConfig.exit.text);
    await triggerNudge(currentNudgeConfig?.exit);
  };

  // const successNudge = async () => {
  //   DEV: console.log("success nudge message", currentNudgeConfig.success.text);
  //   await triggerNudge(currentNudgeConfig?.success);
  // };

  const triggerNudge = async (config: any) => {
    setHideToolTip(false);
    setTipConfig({
      isEnabled: config?.enabled,
      text: config?.text,
      duration: config?.duration,
    });
    await processNudgeToText(config?.text);
  };

  const resetTimer = () => {
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
      root.addEventListener("mousemove", resetTimer);
      root.addEventListener("keydown", resetTimer);
    }
    return () => {
      if (currentNudgeConfig?.idle?.enabled) {
        root.removeEventListener("mousemove", resetTimer);
        root.removeEventListener("keydown", resetTimer);
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentNudgeConfig?.idle?.enabled]);

  const processNudgeToText = async (input: string) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    setIsprocessing(true);
    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
    };
    await textToAction(
      promptTemplate as string,
      input,
      currentPromptVariables,
      newScope,
      false,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });
  };

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
