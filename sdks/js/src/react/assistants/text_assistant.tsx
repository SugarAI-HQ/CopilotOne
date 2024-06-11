import React, { useState, useEffect } from "react";
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
import AssistantTextBox from "./components/textbox";

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

  DEV: console.log(isprocessing);

  const [tipMessage, setTipMessage] = useState(currentAiConfig.welcome.text);

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
    const timer = setTimeout(() => {
      setHideToolTip(false); // Hide the tooltip after 5000 ms (5 seconds)
    }, currentNudgeConfig?.welcome?.delay);
    setHideToolTip(true);
    setTipMessage(currentNudgeConfig?.welcome?.text);
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

            {!hideToolTip && currentNudgeConfig?.welcome?.enabled && (
              <ToolTip
                currentStyle={currentStyle}
                position={position}
                buttonId={buttonId}
                toolTipContainerStyle={toolTipContainerStyle}
                toolTipMessageStyle={toolTipMessageStyle}
                tipMessage={tipMessage}
                config={currentNudgeConfig?.welcome}
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
        <AssistantTextBox
          currentStyle={currentStyle}
          position={position}
          buttonId={buttonId}
          setTextMessage={setTextMessage}
          textMessage={textMessage}
          startSending={startSending}
          enableKeyboard={enableKeyboard}
          iskeyboard={true}
        />
      )}
    </StyleSheetManager>
  );
};
