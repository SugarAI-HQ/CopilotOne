import React, { useState, useEffect } from "react";
import {
  type EmbeddingScopeWithUserType,
  type CopilotStylePositionType,
  copilotStyleDefaults,
  scopeDefaults,
} from "../../../core/schema";
import { useCopilot } from "../../common/copilot_context";

import { StyleSheetManager } from "styled-components";

import { CopilotContainer } from "./base_styled";
import { GlobalStyle } from "./reset_css";
import Keyboard from "./components/keyboard";
import Message from "./components/message";
import ToolTip from "./components/tooltip";
import AssistantTextBox from "./components/textbox";
import {
  shouldForwardProp,
  type BaseAssistantProps,
} from "../../common/schema";
import { loadCurrentConfig } from "../../common/base_config";

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
  position = copilotStyleDefaults.container.position || "bottom-right",
  // @ts-ignore
  keyboardPostion = copilotStyleDefaults.keyboardButton.position,
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

  const { actions, actionCallbacks, currentStyle, currentAiConfig } =
    loadCurrentConfig(config, actionsFn, actionCallbacksFn);

  DEV: console.log(isprocessing);

  const [tipMessage, setTipMessage] = useState(
    currentStyle.toolTip.welcomeMessage,
  );

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
    }, currentStyle?.toolTip?.delay);
    setHideToolTip(true);
    setTipMessage(currentStyle.toolTip.welcomeMessage);
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
        container={currentStyle?.container}
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

            {!hideToolTip && !currentStyle.toolTip.disabled && (
              <ToolTip
                currentStyle={currentStyle}
                position={position}
                buttonId={buttonId}
                toolTipContainerStyle={toolTipContainerStyle}
                toolTipMessageStyle={toolTipMessageStyle}
                tipMessage={tipMessage}
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
