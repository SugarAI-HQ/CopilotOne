import React, { useState, useEffect, useRef } from "react";
import {
  type EmbeddingScopeWithUserType,
  type CopilotStylePositionType,
  type BaseAssistantProps,
  type CopilotSyleContainerType,
  copilotStyleDefaults,
  scopeDefaults,
  determinePreferredLang,
  getGender,
  getPreferredVoiceAndLang,
  shouldForwardProp,
  loadCurrentConfig,
  useCopilot,
} from "@sugar-ai/core";

import root from "window-or-global";

import { StyleSheetManager } from "styled-components";

import { CopilotContainer, KeyboardEmptyContainer } from "./base_styled";

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
  scope = scopeDefaults,
  style = {},
  voiceButtonStyle = {},
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tipConfig, setTipConfig] = useState({
    isEnabled: false,
    text: "",
    duration: 7,
  });

  const { config, clientUserId, textToAction } = useCopilot();

  const {
    actions,
    actionCallbacks,
    currentStyle,
    currentAiConfig,
    currentNudgeConfig,
  } = loadCurrentConfig(config, actionsFn, actionCallbacksFn);

  const isRightPositioned =
    currentStyle?.keyboardButton?.position === "right" ||
    keyboardPosition === "right";
  const isLeftPositioned =
    currentStyle?.keyboardButton?.position === "left" &&
    keyboardPosition === "left";
  const isCenterPositioned =
    ["bottom-center", "top-center"].includes(position) ||
    ["bottom-center", "top-center"].includes(
      currentStyle?.container?.position as CopilotStylePositionType,
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
    void checkIfAudioPermissionGranted();
    setButtonName(id ?? (position as string));
    const timer = setTimeout(async () => {
      await welcomeNudge();
    }, currentNudgeConfig?.welcome?.delay * 1000);
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
      setTipConfig({
        isEnabled: currentNudgeConfig?.welcome?.enabled,
        text: "Please enable Mic permission",
        duration: currentNudgeConfig?.welcome?.duration,
      });
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
    const lang = determinePreferredLang(currentAiConfig.lang);
    recognition.continuous = false;
    recognition.lang = lang;
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

  const speak = async (text) => {
    const synth = root.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    const { voice, lang } = await getPreferredVoiceAndLang(
      currentAiConfig.voice,
      currentAiConfig.lang,
      synth,
    );
    console.log("Voice found", voice);
    console.log("Lang found", lang);
    utterance.lang = lang;
    utterance.voice = voice as any;
    const stopSpeakingOnPageUnload = () => {
      synth.cancel();
    };
    utterance.onend = () => {
      root.removeEventListener("unload", stopSpeakingOnPageUnload);
    };
    root.addEventListener("unload", stopSpeakingOnPageUnload);
    // const voices = synth.getVoices();
    // const selectedVoice = voices.find((v) => {
    //   return v.lang.startsWith(lang) && v.name.includes(voice);
    // });
    // if (selectedVoice) {
    //   utterance.voice = selectedVoice;
    // }

    synth.speak(utterance);
  };

  const enableKeyboard = () => {
    setHideVoiceButton(!hideVoiceButton);
  };

  scope = { ...scopeDefaults, ...scope };

  const processSpeechToText = async (
    input: string,
    isSpeak: boolean = true,
  ) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    setIsprocessing(true);

    const { voice, lang } = await getPreferredVoiceAndLang(
      currentAiConfig.voice,
      currentAiConfig.lang,
      root.speechSynthesis,
    );
    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
    };
    const aiResponse = await textToAction(
      promptTemplate as string,
      input,
      {
        ...currentPromptVariables,
        "#GENDER": getGender(voice!),
        "#LANGUAGE": lang,
      },
      newScope,
      false,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });
    if (typeof aiResponse === "string") {
      setAiResponse(aiResponse);
      isSpeak && (await speak(aiResponse));
      recognition.stop();
    }
  };

  const processNudgeToText = async (input: string) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    const { voice, lang } = await getPreferredVoiceAndLang(
      currentAiConfig.voice,
      currentAiConfig.lang,
      root.speechSynthesis,
    );
    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
    };
    await textToAction(
      promptTemplate as string,
      input,
      {
        ...currentPromptVariables,
        "#GENDER": getGender(voice!),
        "#LANGUAGE": lang,
      },
      newScope,
      true,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });
  };

  const startSending = async () => {
    const newTextMessage = textMessage;
    setTextMessage("");
    setAiResponse("");
    setFinalOutput(newTextMessage);
    await processSpeechToText(newTextMessage, false);
  };

  const welcomeNudge = async () => {
    DEV: console.log("Idle nudge message", currentNudgeConfig.idle.text);
    await triggerNudge(currentNudgeConfig?.welcome);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const idleNudge = async () => {
    DEV: console.log("Idle nudge message", currentNudgeConfig.idle.text);
    await triggerNudge(currentNudgeConfig?.idle);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const exitNudge = async () => {
    DEV: console.log("exit nudge message", currentNudgeConfig.exit.text);
    await triggerNudge(currentNudgeConfig?.exit);
    // await processSpeechToText(currentNudgeConfig?.exit?.text, false, true);
  };

  const successNudge = async () => {
    DEV: console.log("success nudge message", currentNudgeConfig.success.text);
    await triggerNudge(currentNudgeConfig?.success);
  };

  const triggerNudge = async (config: any) => {
    setHideToolTip(false);
    setTipConfig({
      isEnabled: config?.enabled,
      text: config?.text,
      duration: config?.duration,
    });
    await processNudgeToText(config?.text);
    config?.voiceEnabled && (await speak(config?.text));
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

  const handleBeforeUnload = async (event) => {
    await exitNudge();
    const message =
      "Are you sure you want to leave? Changes you made may not be saved.";
    event.returnValue = message; // Standard message for all modern browsers
    return message; // Some older browsers require this return statement
  };

  useEffect(() => {
    if (currentNudgeConfig?.exit?.enabled) {
      root.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      if (currentNudgeConfig?.exit?.enabled) {
        root.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, [currentNudgeConfig?.exit?.enabled]);

  // useEffect(() => {
  //   const handleBooleanChange = () => {
  //     if (currentNudgeConfig?.exit?.enabled) {
  //       console.log("Boolean is true, perform actions here.");

  //       const event = new Event("booleanTrue");
  //       root.dispatchEvent(event);
  //     }
  //   };

  //   handleBooleanChange();
  // }, [currentNudgeConfig?.exit?.enabled]);

  // useEffect(() => {
  //   const handleBooleanTrue = () => {
  //     console.log("Event: Boolean became true");
  //     successNudge();
  //   };

  //   root.addEventListener("booleanTrue", handleBooleanTrue);

  //   return () => {
  //     root.removeEventListener("booleanTrue", handleBooleanTrue);
  //   };
  // }, []);

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
