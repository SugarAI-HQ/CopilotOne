import React, { useState, useEffect } from "react";
import {
  type EmbeddingScopeWithUserType,
  type EmbeddingScopeType,
  type PromptTemplateType,
  type PromptVariablesType,
  type CopilotStylePositionType,
  type CopilotSytleType,
  copilotStyleDefaults,
  type CopilotSyleKeyboardPositionSchema,
  copilotAiDefaults,
} from "../../schema";
import { useCopilot } from "../CopilotContext";
import root from "window-or-global";

import { StyleSheetManager } from "styled-components";

import {
  CopilotContainer,
  VoiceButton,
  ChatMessage,
  Message,
  ToolTipContainer,
  TootTipMessage,
  KeyboardButton,
  TextBoxContainer,
  TextBoxButton,
  TextBox,
  KeyboardEmptyContainer,
} from "../assistants/base_assistant";
import Mic from "../icons/mic";
import Keyboard from "../icons/keyboard";
import Spinner from "../icons/spinner";

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
  keyboardPostion = copilotStyleDefaults.keyboardButton.position,
}: {
  id: string | null;
  promptTemplate: PromptTemplateType | null;
  groupId?: EmbeddingScopeType["groupId"];
  scope1?: EmbeddingScopeType["scope1"];
  scope2?: EmbeddingScopeType["scope2"];
  promptVariables?: PromptVariablesType;
  style?: any;
  voiceButtonStyle?: any;
  keyboardButtonStyle?: any;
  messageStyle?: any;
  toolTipContainerStyle?: any;
  toolTipMessageStyle?: any;
  position?: CopilotStylePositionType;
  keyboardPostion?: CopilotSyleKeyboardPositionSchema;
}) => {
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
      ...config?.style.toolTip,
    },
  };

  const currentAiConfig = {
    ...copilotAiDefaults,
    ...config?.ai,
  };

  const [tipMessage, setTipMessage] = useState(
    currentStyle.toolTip.welcomeMessage,
  );

  DEV: console.log(
    `copilotStyleDefaults ---> ${JSON.stringify(copilotStyleDefaults)}`,
  );

  DEV: console.log(`config?.style ---> ${JSON.stringify(config?.style)}`);

  DEV: console.log(`default Style ---> ${JSON.stringify(currentStyle)}`);

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
    // Check if microphone permission is granted
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true })
    //   .then(() => {
    //     setIspermissiongranted(true);
    //   })
    //   .catch(() => {
    //     setIspermissiongranted(false);
    //   });

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

  const shouldForwardProp = (prop: string) =>
    prop !== "container" && prop !== "position";

  const keyboardPosition = () => {
    return (
      <KeyboardButton
        className="sugar-ai-copilot-keyboard-button"
        style={keyboardButtonStyle}
        button={currentStyle?.keyboardButton}
        onClick={enableKeyboard}
      >
        <Keyboard
          width={"20"}
          height={"14"}
          color={currentStyle?.keyboardButton?.bgColor}
        />
      </KeyboardButton>
    );
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
      <CopilotContainer
        id={`sugar-ai-copilot-${buttonId}`}
        className="sugar-ai-copilot-container"
        container={currentStyle?.container}
        position={position as CopilotStylePositionType}
        style={style}
      >
        {!hideVoiceButton && (
          <>
            {isUserEngaged &&
              currentStyle.keyboardButton.position === "left" &&
              keyboardPostion === "left" &&
              keyboardPosition()}
            {isUserEngaged &&
              (currentStyle.keyboardButton.position === "right" ||
                keyboardPostion === "right") && (
                <KeyboardEmptyContainer></KeyboardEmptyContainer>
              )}
            <VoiceButton
              id={`sugar-ai-voice-button-${buttonId}`}
              className="sugar-ai-copilot-voice-button"
              style={voiceButtonStyle}
              onClick={(e) => {
                void startListening(e);
              }}
              button={currentStyle?.voiceButton}
              ispermissiongranted={ispermissiongranted.toString()}
              isprocessing={isprocessing.toString()}
              islistening={islistening.toString()}
            >
              <Mic
                color={currentStyle?.voiceButton.color}
                size={currentStyle?.voiceButton?.iconSize}
              />
              {isprocessing && (
                <Spinner
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    left: "54px",
                    opacity: "0.4",
                  }}
                  size={"72"}
                  color={currentStyle?.voiceButton.bgColor}
                />
              )}
            </VoiceButton>
            {isUserEngaged &&
              currentStyle.keyboardButton.position === "left" &&
              keyboardPostion === "left" && (
                <KeyboardEmptyContainer></KeyboardEmptyContainer>
              )}
            {isUserEngaged &&
              (currentStyle.keyboardButton.position === "right" ||
                keyboardPostion === "right") &&
              keyboardPosition()}
            {!hideToolTip && currentStyle.toolTip.disabled && (
              <ToolTipContainer
                container={currentStyle?.container}
                config={currentStyle?.toolTip}
                position={position as CopilotStylePositionType}
                style={toolTipContainerStyle}
                id={`sugar-ai-tool-tip-${buttonId}`}
                className="sugar-ai-tool-tip"
              >
                <TootTipMessage
                  theme={currentStyle?.theme}
                  id={`sugar-ai-tool-tip-message-${buttonId}`}
                  style={toolTipMessageStyle}
                  className="sugar-ai-tool-tip-message"
                >
                  {tipMessage}
                </TootTipMessage>
              </ToolTipContainer>
            )}
          </>
        )}

        {(aiResponse || finalOutput || interimOutput) && (
          <ChatMessage
            container={currentStyle?.container}
            position={position as CopilotStylePositionType}
            style={messageStyle}
            id={`sugar-ai-chat-message-${buttonId}`}
            className="sugar-ai-chat-message"
          >
            {(interimOutput || finalOutput) && (
              <Message
                theme={currentStyle?.theme}
                id={`sugar-ai-message-${buttonId}`}
                className="sugar-ai-message"
              >
                {interimOutput || finalOutput}
              </Message>
            )}
            {aiResponse && (
              <Message
                theme={currentStyle?.theme}
                id={`sugar-ai-message-${buttonId}`}
                className="sugar-ai-message"
                role="assistant"
              >
                {aiResponse}
              </Message>
            )}
          </ChatMessage>
        )}
      </CopilotContainer>
      {hideVoiceButton && (
        <TextBoxContainer
          container={currentStyle?.container}
          position={position}
          id={`sugar-ai-text-box-container-${buttonId}`}
          className="sugar-ai-text-box-container"
        >
          <TextBox
            type="text"
            placeholder={currentStyle?.keyboardButton?.placeholder}
            value={textMessage}
            color={currentStyle?.keyboardButton?.bgColor}
            onChange={(e) => {
              setTextMessage(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") void startSending();
            }}
            id={`sugar-ai-text-box-${buttonId}`}
            className="sugar-ai-text-box"
          />
          <TextBoxButton onClick={enableKeyboard}>
            <Mic
              color={currentStyle?.keyboardButton?.bgColor}
              size={currentStyle?.keyboardButton?.iconSize}
              width={"26"}
              height={"30"}
            />
          </TextBoxButton>
        </TextBoxContainer>
      )}
    </StyleSheetManager>
  );
};
