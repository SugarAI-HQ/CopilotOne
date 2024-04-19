import React, { useState, useEffect } from "react";
import {
  type EmbeddingScopeWithUserType,
  type EmbeddingScopeType,
  type PromptTemplateType,
  type PromptVariablesType,
  type CopilotStylePositionType,
  type CopilotSytleType,
  copilotStyleDefaults,
} from "../../schema";
import { useCopilot } from "../CopilotContext";
// import { WindowObj } from "../schema";
import root from "window-or-global";

import { StyleSheetManager } from "styled-components";

import {
  ChatContainer,
  ChatButton,
  ChatMessage,
  Message,
  ToolTipWindow,
  TootTipMessage,
} from "../assistants/base_assistant";
import Mic from "../icons/mic";

export const VoiceAssistant = ({
  id = null,
  promptTemplate = null,
  promptVariables = {},
  scope1 = "",
  scope2 = "",
  groupId = root?.location?.pathname as string,
  style = {},
  buttonStyle = {},
  messageStyle = {},
  position = copilotStyleDefaults.container.position,
}: {
  id: string | null;
  promptTemplate: PromptTemplateType | null;
  groupId?: EmbeddingScopeType["groupId"];
  scope1?: EmbeddingScopeType["scope1"];
  scope2?: EmbeddingScopeType["scope2"];
  promptVariables?: PromptVariablesType;
  style?: any;
  buttonStyle?: any;
  messageStyle?: any;
  position?: CopilotStylePositionType;
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

  const { config, clientUserId, textToAction } = useCopilot();

  const defaultStyle: CopilotSytleType = {
    ...config?.style,
    ...copilotStyleDefaults,
  };

  DEV: console.log(`default Style ---> ${JSON.stringify(defaultStyle)}`);

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
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        setIspermissiongranted(true);
      })
      .catch(() => {
        setIspermissiongranted(false);
      });

    setButtonName(id ?? (position as string));
  }, []);

  const startListening = () => {
    if (!ispermissiongranted) {
      alert(
        "Microphone permission not granted. Please allow microphone access.",
      );
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

          const newScope: EmbeddingScopeWithUserType = {
            clientUserId: clientUserId!,
            scope1,
            scope2,
            groupId,
          };

          // Generate the response
          const aiResponse = await textToAction(
            promptTemplate as string,
            finalTranscript,
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

  const shouldForwardProp = (prop: string) =>
    prop !== "container" && prop !== "position";

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ChatContainer
        id={`sugar-ai-copilot-${buttonId}`}
        className="sugar-ai-copilot-container"
        container={defaultStyle?.container}
        position={position as CopilotStylePositionType}
        style={style}
      >
        <ChatButton
          style={buttonStyle}
          onClick={startListening}
          button={defaultStyle?.button}
          ispermissiongranted={ispermissiongranted.toString()}
          isprocessing={isprocessing.toString()}
          islistening={islistening.toString()}
        >
          <Mic
            color={defaultStyle?.button.color}
            size={defaultStyle?.button?.iconSize}
          />
        </ChatButton>
        {!hideToolTip && (
          <ToolTipWindow
            container={defaultStyle?.container}
            position={position as CopilotStylePositionType}
            style={messageStyle}
          >
            <TootTipMessage theme={defaultStyle?.theme}>
              Tap & Speak: Let AI Guide Your Journey!
            </TootTipMessage>
          </ToolTipWindow>
        )}
        {(aiResponse || finalOutput || interimOutput) && (
          <ChatMessage
            container={defaultStyle?.container}
            position={position as CopilotStylePositionType}
            style={messageStyle}
          >
            {(interimOutput || finalOutput) && (
              <Message theme={defaultStyle?.theme}>
                {interimOutput || finalOutput}
              </Message>
            )}
            {aiResponse && (
              <Message theme={defaultStyle?.theme}>{aiResponse}</Message>
            )}
          </ChatMessage>
        )}
      </ChatContainer>
    </StyleSheetManager>
  );
};
