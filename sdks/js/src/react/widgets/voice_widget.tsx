import React, { useState, useEffect } from "react";
import { FaMicrophone } from "react-icons/fa";
import {
  type EmbeddingScopeWithUserType,
  type EmbeddingScopeType,
  type PromptTemplateType,
  type PromptVariablesType,
  type CopilotStylePositionType,
  type CopilotSyleContainerType,
  type CopilotSyleThemeType,
  type CopilotSytleType,
  copilotStyleDefaults,
  copilotSyleButtonSchema,
} from "../../schema";
import { useCopilot } from "../CopilotContext";
// import { WindowObj } from "../schema";
import root from "window-or-global";

import { styled, css, StyleSheetManager } from "styled-components";
import { z } from "zod";
import { ChatContainer, pulse } from "./base_widget";

// const ping = keyframes`
//   0% {
//     transform: scale(0);
//     opacity: 0.5;
//   }
//   100% {
//     transform: scale(3);
//     opacity: 0;
//   }
// `;

const copilotButtonProps = z.object({
  button: copilotSyleButtonSchema,
  isprocessing: z.string(),
  ispermissiongranted: z.string(),
  islistening: z.string(),
});
type CopilotButtonPropsType = z.infer<typeof copilotButtonProps>;

const ChatMessage = styled.div<{
  container: CopilotSyleContainerType;
  position: CopilotStylePositionType;
}>`
  position: fixed;
  width: 300px;
  max-height: calc(100vh - 120px);
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 20%);
  animation-duration: 0.5s;
  animation-name: d;
  animation-fill-mode: forwards;
  overflow-y: auto;
  z-index: 1000; // Ensure the chat window is above most elements

  ${({ container, position }) => {
    const positions = position
      ? position?.split("-")
      : (container?.position as CopilotStylePositionType)?.split("-") || [];
    const styles = positions?.map((position) => {
      switch (position) {
        case "top":
          return css`
            top: 90px;
          `;
        case "bottom":
          return css`
            bottom: 90px;
          `;
        case "left":
          return css`
            left: 20px;
          `;
        case "right":
          return css`
            right: 20px;
          `;
        default:
          return "";
      }
    });

    return css`
      ${styles.join(" ")}
    `;
  }}
`;

const ChatButton = styled.button<CopilotButtonPropsType>`
  background-color: ${({ button }) => button?.bgColor};
  color: ${({ button }) => button?.color};
  border: none;
  border-radius: 50%;
  width: ${({ button }) => button?.width};
  height: ${({ button }) => button?.height};
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 12px;
  text-align: -webkit-center;
  cursor: ${({ isprocessing, ispermissiongranted }) =>
    isprocessing === "true" || ispermissiongranted !== "true"
      ? "not-allowed"
      : "pointer"};
  opacity: ${({ isprocessing, ispermissiongranted }) =>
    isprocessing === "true" || ispermissiongranted !== "true" ? "0.5" : "1"};
  ${({ islistening }) =>
    islistening === "true" &&
    css`
      animation: ${pulse} 1s infinite;
    `}
  &:hover {
    background-color: ${({ isprocessing, ispermissiongranted, button }) =>
      isprocessing === "true" || ispermissiongranted !== "true"
        ? button?.bgColor
        : button?.bgColor}
`;

const Message = styled.div<{ theme: CopilotSyleThemeType }>`
  background-color: ${({ theme }) => theme?.secondaryColor};
  font-size: ${({ theme }) => theme?.fontSize};
  font-family: ${({ theme }) => theme?.fontFamily};
  padding: 10px;
  margin-bottom: 5px;
`;

// export const VoiceToSkillComponentX = ({
//   id = null,
//   promptTemplate = null,
//   promptVariables = {},
//   scope1 = "",
//   scope2 = "",
//   groupId = root?.location?.pathname as string,
//   style = {},
//   buttonStyle = {},
//   messageStyle = {},
//   position = copilotStyleDefaults.container.position,
// }: {
//   id: string | null;
//   promptTemplate: PromptTemplateType | null;
//   groupId?: EmbeddingScopeType["groupId"];
//   scope1?: EmbeddingScopeType["scope1"];
//   scope2?: EmbeddingScopeType["scope2"];
//   promptVariables?: PromptVariablesType;
//   style?: any;
//   buttonStyle?: any;
//   messageStyle?: any;
//   position?: CopilotStylePositionType;
// }) => {
//   const [buttonId, setButtonName] = useState<string>(position as string);

//   setButtonName(position);
//   return <div>Copilot xxxxxxxx {buttonId}</div>;
// };

export const VoiceToSkillComponent = ({
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
  const [isprocessing, setIsprocessing] = useState(false);
  const [ispermissiongranted, setIspermissiongranted] = useState(false);
  const [interimOutput, setInterimOutput] = useState<string>("");
  const [finalOutput, setFinalOutput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [recognition, setRecognition] = useState<any>();

  const { config, clientUserId, textToSkill } = useCopilot();

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
          const aiResponse = await textToSkill(
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
          <FaMicrophone size={defaultStyle?.button?.iconSize || 20} />
        </ChatButton>
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
