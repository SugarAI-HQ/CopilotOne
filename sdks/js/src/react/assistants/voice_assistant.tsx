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
} from "../../schema";
import { useCopilot } from "../CopilotContext";
import root from "window-or-global";

import { StyleSheetManager } from "styled-components";

import {
  CopilotContainer,
  VoiceButton,
  ChatMessage,
  Message,
  ToolTipWindow,
  TootTipMessage,
  KeyboardButton,
  TextBoxContainer,
  TextBoxButton,
  TextBox,
} from "../assistants/base_assistant";
import Mic from "../icons/mic";
import Keyboard from "../icons/keyboard";

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
  position = copilotStyleDefaults.container.position,
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
  position?: CopilotStylePositionType;
  keyboardPostion?: CopilotSyleKeyboardPositionSchema;
}) => {
  const [buttonId, setButtonName] = useState<string>(position as string);
  const [islistening, setIslistening] = useState(false);
  const [hideToolTip, setHideToolTip] = useState(false);
  const [isprocessing, setIsprocessing] = useState(false);
  const [ispermissiongranted, setIspermissiongranted] = useState(false);
  const [interimOutput, setInterimOutput] = useState<string>("");
  const [finalOutput, setFinalOutput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [recognition, setRecognition] = useState<any>();
  const [hideVoiceButton, setHideVoiceButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");

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
      bgColor: currentTheme.primaryColor,
      color: currentTheme.secondaryColor,
    },
    keyboardButton: {
      ...copilotStyleDefaults.keyboardButton,
      bgColor: currentTheme.primaryColor,
      color: currentTheme.secondaryColor,
    },
  };

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
  }, []);

  const startListening = () => {
    if (!ispermissiongranted) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(() => {
          setIspermissiongranted(true);
        })
        .catch(() => {
          setIspermissiongranted(false);
        });
      return;
    }
    setIslistening(true);
    setHideToolTip(true);
    try {
      if (recognition) {
        PROD: console.log("Starting speech recognition");
        initRecognition(recognition);
        recognition?.start();

        // Empty the previous response
        setAiResponse("");
      }
    } catch (e: any) {
      PROD: console.warn(`Error starting recognition ${e.message}`);
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
          DEV: console.log(`Final: ${finalTranscript}`);

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
      // debugger;
      // setIslistening(false);
      // setIsprocessing(true);
      // // Simulate processing delay
      // setTimeout(() => {
      //   const response = "This is a response from your assistant.";
      //   setFinalOutput(response);
      //   speak(response);
      //   setIsprocessing(false);
      //   recognition.stop();
      // }, 1000);
    };

    recognition.onerror = function (event) {
      // setIslistening(false);
      PROD: console.error(`recognition.onerror ${JSON.stringify(event)}`);
    };
  }

  useEffect(() => {
    let srx: any = null;
    let recognition: any = null;
    DEV: console.log(`Window or global ${root}`);
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

  const processSpeechToText = async (input: string) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      scope1,
      scope2,
      groupId,
    };
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
      speak(aiResponse);
      recognition.stop();
    }
  };

  const startSending = async () => {
    const newTextMessage = textMessage;
    setTextMessage("");
    setFinalOutput(newTextMessage);
    await processSpeechToText(newTextMessage);
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
            {currentStyle.keyboardButton.position === "left" &&
              keyboardPostion === "left" &&
              keyboardPosition()}
            <VoiceButton
              className="sugar-ai-copilot-voice-button"
              style={voiceButtonStyle}
              onClick={startListening}
              button={currentStyle?.voiceButton}
              ispermissiongranted={ispermissiongranted.toString()}
              isprocessing={isprocessing.toString()}
              islistening={islistening.toString()}
            >
              <Mic
                color={currentStyle?.voiceButton.color}
                size={currentStyle?.voiceButton?.iconSize}
              />
            </VoiceButton>
            {(currentStyle.keyboardButton.position === "right" ||
              keyboardPostion === "right") &&
              keyboardPosition()}

            {!hideToolTip && (
              <ToolTipWindow
                container={currentStyle?.container}
                position={position as CopilotStylePositionType}
                style={messageStyle}
              >
                <TootTipMessage theme={currentStyle?.theme}>
                  {config?.ai?.welcomeMessage}
                </TootTipMessage>
              </ToolTipWindow>
            )}
          </>
        )}

        {hideVoiceButton && (
          <TextBoxContainer>
            <TextBox
              type="text"
              placeholder="Start typing..."
              value={textMessage}
              color={currentStyle?.keyboardButton?.bgColor}
              onChange={(e) => {
                setTextMessage(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") void startSending();
              }}
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

        {(aiResponse || finalOutput || interimOutput) && (
          <ChatMessage
            container={currentStyle?.container}
            position={position as CopilotStylePositionType}
            style={messageStyle}
          >
            {(interimOutput || finalOutput) && (
              <Message theme={currentStyle?.theme}>
                {interimOutput || finalOutput}
              </Message>
            )}
            {aiResponse && (
              <Message theme={currentStyle?.theme} role="assistant">
                {aiResponse}
              </Message>
            )}
          </ChatMessage>
        )}
      </CopilotContainer>
    </StyleSheetManager>
  );
};
