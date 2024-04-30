import React, { useState, useEffect } from "react";
import {
  type EmbeddingScopeWithUserType,
  type CopilotStylePositionType,
  type CopilotSytleType,
  copilotStyleDefaults,
  copilotAiDefaults,
} from "../../schema";
import { useCopilot } from "../CopilotContext";
import root from "window-or-global";

import { StyleSheetManager } from "styled-components";

import { CopilotContainer, KeyboardEmptyContainer } from "./base_styled";
import {
  shouldForwardProp,
  type BaseAssistantProps,
} from "./components/schema";
import { GlobalStyle } from "./reset_css";
import Keyboard from "./components/keyboard";
import Message from "./components/message";
import ToolTip from "./components/tooltip";
import TextBox from "./components/textbox";
import Voice from "./components/voice";

export const VoiceAssistant = ({
  id = null,
  promptTemplate = null,
  promptVariables = {},
  scope1 = "",
  scope2 = "",
  groupId = root?.location?.pathname as string,
  style = {},
  voiceButtonStyle = {},
  keyboardButtonStyle = {},
  messageStyle = {},
  toolTipContainerStyle = {},
  toolTipMessageStyle = {},
  position = copilotStyleDefaults.container.position || "bottom-right",
  keyboardPosition = copilotStyleDefaults.keyboardButton.position,
  actionsFn,
  actionCallbacksFn,
}: BaseAssistantProps) => {
  const [buttonId, setButtonName] = useState<string>(position as string);
  const [islistening, setIslistening] = useState(false);
  const [hideToolTip, setHideToolTip] = useState(true);
  const [isprocessing, setIsprocessing] = useState(false);
  const [ispermissiongranted, setIspermissiongranted] = useState(false);
  const [interimOutput, setInterimOutput] = useState<string>("");
  const [finalOutput, setFinalOutput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [recognition, setRecognition] = useState<any>();
  const [hideVoiceButton, setHideVoiceButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [isUserEngaged, setIsUserEngaged] = useState(false);

  const { config, clientUserId, textToAction } = useCopilot();

  const currentTheme = {
    ...copilotStyleDefaults.theme,
    ...config?.style?.theme,
  };

  const actions = typeof actionsFn === "function" ? actionsFn() : [];
  const actionCallbacks =
    typeof actionCallbacksFn === "function" ? actionCallbacksFn() : [];

  DEV: console.log(`currentTheme ---> ${JSON.stringify(currentTheme)}`);

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
    toolTip: {
      ...copilotStyleDefaults.toolTip,
      ...config?.style?.toolTip,
    },
  };

  const isRightPositioned =
    currentStyle.keyboardButton.position === "right" ||
    keyboardPosition === "right";
  const isLeftPositioned =
    currentStyle.keyboardButton.position === "left" &&
    keyboardPosition === "left";
  const isCenterPositioned =
    ["bottom-center", "top-center"].includes(position) ||
    ["bottom-center", "top-center"].includes(currentStyle.container.position);

  const currentAiConfig = {
    ...copilotAiDefaults,
    ...config?.ai,
  };

  DEV: console.log(currentAiConfig);

  const [tipMessage, setTipMessage] = useState(
    currentStyle.toolTip.welcomeMessage,
  );

  DEV: console.log(
    `copilotStyleDefaults ---> ${JSON.stringify(copilotStyleDefaults)}`,
  );

  DEV: console.log(`config?.style ---> ${JSON.stringify(config?.style)}`);

  DEV: console.log(`current Style ---> ${JSON.stringify(currentStyle)}`);

  if (promptTemplate == null && config?.ai?.defaultPromptTemplate == null) {
    throw new Error(
      "Both promptTemplate and config.prompt.defaultTemmplate are null. Set atleast one of them",
    );
  }
  if (!promptTemplate && config?.ai?.defaultPromptTemplate) {
    promptTemplate = config?.ai?.defaultPromptTemplate;
  }

  useEffect(() => {
    void checkIfAudioPermissionGranted();
    setButtonName(id ?? (position as string));
    const timer = setTimeout(() => {
      setHideToolTip(false); // Hide the tooltip after 5000 ms (5 seconds)
    }, currentStyle?.toolTip?.delay);
    setHideToolTip(true);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (islistening) {
      PROD: console.log("[Audio] listening");
    } else {
      PROD: console.log("[Audio] Not listening");
    }
  }, [islistening]);

  const checkIfAudioPermissionGranted = async () => {
    if (!ispermissiongranted) {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      if (result.state === "granted") {
        DEV: console.log("[Audio] Permission already granted");
        setIspermissiongranted(true);
      }
    }
  };

  const startListening = async (e: any) => {
    let haveMicPermission = false;
    setIsUserEngaged(true);
    if (!ispermissiongranted) {
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          haveMicPermission = true;
          setIspermissiongranted(true);
        })
        .catch(() => {
          setIspermissiongranted(false);
        });
      // return;
    } else {
      haveMicPermission = true;
    }
    if (!haveMicPermission) {
      // TODO: Show error tooltip with message
      PROD: console.warn("[Audio] haven't got mic permissions");
      setTipMessage("Please enable Mic permission");
      return;
    }

    // Listening Success
    setIslistening(true);
    setHideToolTip(true);

    try {
      if (recognition) {
        PROD: console.log("[Audio] Starting speech recognition");
        initRecognition(recognition);
        recognition?.start();

        // Empty the previous response
        setAiResponse("");
      }
    } catch (e: any) {
      // TODO: Show error tooltip with message
      PROD: console.warn(`[Audio] Error starting recognition ${e.message}`);
    }
  };

  function initRecognition(recognition: any) {
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIslistening(true);
    };

    recognition.onresult = async (event) => {
      let interimTranscript = "";
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript = event.results[i][0].transcript;
          DEV: console.log(`[Audio] Final: ${finalTranscript}`);

          // Take care of it
          setIslistening(false);
          setFinalOutput(finalTranscript);

          await processSpeechToText(finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setInterimOutput(interimTranscript);
      setFinalOutput(finalTranscript);
    };

    recognition.onend = (event) => {
      setIslistening(false);
    };

    recognition.onerror = function (event) {
      setIslistening(false);
      PROD: console.error(`recognition.onerror ${JSON.stringify(event)}`);
    };
  }

  useEffect(() => {
    let srx: any = null;
    let recognition: any = null;
    if (
      !recognition &&
      typeof root !== "undefined" &&
      (typeof root.SpeechRecognition !== "undefined" ||
        typeof root.webkitSpeechRecognition !== "undefined")
    ) {
      srx = root.SpeechRecognition || root.webkitSpeechRecognition;
      recognition = new srx();
      setRecognition(recognition);
    }

    // if (recognition) {
    //   setRecognition(recognition);
    // }
  }, []);

  const speak = (text) => {
    const synth = root.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const enableKeyboard = () => {
    setHideVoiceButton(!hideVoiceButton);
  };

  const processSpeechToText = async (
    input: string,
    isSpeak: boolean = true,
  ) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      scope1,
      scope2,
      groupId,
    };

    setIsprocessing(true);

    const aiResponse = await textToAction(
      promptTemplate as string,
      input,
      promptVariables,
      newScope,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });
    if (typeof aiResponse === "string") {
      setAiResponse(aiResponse);
      isSpeak && speak(aiResponse);
      recognition.stop();
    }
  };

  const startSending = async () => {
    const newTextMessage = textMessage;
    setTextMessage("");
    setAiResponse("");
    setFinalOutput(newTextMessage);
    await processSpeechToText(newTextMessage, false);
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
        {!hideVoiceButton && (
          <>
            {isUserEngaged && isLeftPositioned && (
              <Keyboard
                style={keyboardButtonStyle}
                currentStyle={currentStyle?.keyboardButton}
                enableKeyboard={enableKeyboard}
              />
            )}
            {isUserEngaged && isRightPositioned && isCenterPositioned && (
              <KeyboardEmptyContainer></KeyboardEmptyContainer>
            )}
            <Voice
              currentStyle={currentStyle}
              voiceButtonStyle={voiceButtonStyle}
              startListening={startListening}
              buttonId={buttonId}
              ispermissiongranted={ispermissiongranted}
              isprocessing={isprocessing}
              islistening={islistening}
            />
            {isUserEngaged && isLeftPositioned && isCenterPositioned && (
              <KeyboardEmptyContainer></KeyboardEmptyContainer>
            )}
            {isUserEngaged && isRightPositioned && (
              <Keyboard
                style={keyboardButtonStyle}
                currentStyle={currentStyle?.keyboardButton}
                enableKeyboard={enableKeyboard}
              />
            )}
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

        {(aiResponse || finalOutput || interimOutput) && (
          <Message
            finalOutput={interimOutput || finalOutput}
            aiResponse={aiResponse}
            currentStyle={currentStyle}
            position={position}
            buttonId={buttonId}
            messageStyle={messageStyle}
          />
        )}
      </CopilotContainer>
      {hideVoiceButton && (
        <TextBox
          currentStyle={currentStyle}
          position={position}
          buttonId={buttonId}
          setTextMessage={setTextMessage}
          textMessage={textMessage}
          startSending={startSending}
          enableKeyboard={enableKeyboard}
          iskeyboard={false}
        />
      )}
    </StyleSheetManager>
  );
};
