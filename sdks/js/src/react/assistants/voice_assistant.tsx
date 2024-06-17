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
  const sessionKey = "sai_session";

  const getSessionKey = (): string => {
    const sessionData = localStorage.getItem(sessionKey);
    let sessionObj: { key: string; timestamp: number } = {
      key: "",
      timestamp: 0,
    };

    // Check if session data exists and not expired
    if (sessionData) {
      sessionObj = JSON.parse(sessionData);
      if (Date.now() - sessionObj.timestamp <= 30 * 60 * 1000) {
        return sessionObj.key; // Return existing session key if not expired
      }
    }

    // Generate new session key
    const newSessionKey = generateSessionKey();
    sessionObj = { key: newSessionKey, timestamp: Date.now() };
    localStorage.setItem(sessionKey, JSON.stringify(sessionObj));
    return newSessionKey;
  };

  const generateSessionKey = (): string => {
    // Generate a random alphanumeric session key
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 10; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return sessionKey + "_" + key;
  };

  const getKeyInSession = (key: string): string | null => {
    const sessionKey = getSessionKey();
    DEV: console.log("sessionKey", sessionKey);
    const sessionData = localStorage.getItem(sessionKey);
    if (sessionData) {
      const sessionObj = JSON.parse(sessionData);
      return sessionObj[key] || null;
    }
    return null;
  };

  const setKeyInSession = (key: string, value: string): void => {
    const sessionKey = getSessionKey();
    DEV: console.log("sessionKey", sessionKey);
    let sessionObj: { [key: string]: string } = {};
    const sessionData = localStorage.getItem(sessionKey);
    if (sessionData) {
      sessionObj = JSON.parse(sessionData);
    }
    sessionObj[key] = value;
    localStorage.setItem(sessionKey, JSON.stringify(sessionObj));
  };

  const resetSession = (): void => {
    localStorage.removeItem(sessionKey);
  };

  // const setKeyInSession = (key: string, value: string): void => {
  //   let sessionObj: { [key: string]: string } = {};
  //   const sessionData = localStorage.getItem(sessionKey);
  //   if (sessionData) {
  //     sessionObj = JSON.parse(sessionData);
  //   }
  //   sessionObj[key] = value;
  //   localStorage.setItem(sessionKey, JSON.stringify(sessionObj));
  // };

  const triggerNudgeOncePerSession = async (action, config) => {
    const actionKey = `last${action}NudgeAt`;
    DEV: console.log(`${action} nudge message`, config.text);

    if (!getKeyInSession(actionKey)) {
      // Perform the action
      await triggerNudge(config);
      // Set the flag in local storage
      setKeyInSession(actionKey, Date.now());
    } else {
      console.log(`Already shown ${action} nudge.`);
    }
  };

  const welcomeNudge = async () => {
    triggerNudgeOncePerSession("Welcome", currentNudgeConfig?.welcome);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const idleNudge = async () => {
    triggerNudgeOncePerSession("Idle", currentNudgeConfig?.idle);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const stuckNudge = async () => {
    triggerNudgeOncePerSession("Stuck", currentNudgeConfig?.stuck);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const exitNudge = async () => {
    triggerNudgeOncePerSession("Exit", currentNudgeConfig?.exit);
    // await triggerNudge(currentNudgeConfig?.exit);
    // await processSpeechToText(currentNudgeConfig?.exit?.text, false, true);
  };

  // Define the thresholds for different pages
  // const pageThresholds: { [key: string]: number } = {
  //   '/home': 30, // Home page threshold in seconds
  //   '/about': 45, // About page threshold in seconds
  //   // Add more pages as needed
  // };

  // // Function to get the current page path
  // function getCurrentPagePath(): string {
  //   return window.location.pathname;
  // }

  let timeSpentTimer: number | null = null;
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
            onStuck(window.location.pathname);
          }
        }, threshold);
      } else {
        debugger;
        if (timeSpentTimer !== null) {
          clearTimeout(timeSpentTimer);
          timeSpentTimer = null;
          elapsedTime += (Date.now() - startTime) / 1000;
        }
      }
    };

    checkTime(); // Initial check
  }

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
    config?.voiceEnabled && (await speak(config?.text));
  };

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
    // trackTimeSpentOnPage();
    if (timeSpentTimer !== null) {
      clearTimeout(timeSpentTimer);
      elapsedTime += (Date.now() - startTime) / 1000;
    }
    // onStuck(window.location.pathname);

    currentNudgeConfig?.exit?.enabled && (await exitNudge());

    // Clear timespent timer
    if (timeSpentTimer !== null) {
      DEV: console.log(`clearing timeSpentTimer: ${timeSpentTimer}`);
      clearTimeout(timeSpentTimer);
    }

    const message =
      "Are you sure you want to leave? Changes you made may not be saved.";
    event.returnValue = message; // Standard message for all modern browsers
    return message; // Some older browsers require this return statement
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
    root.addEventListener("load", trackTimeSpentOnPage);
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

      if (
        currentNudgeConfig?.exit?.enabled ||
        currentNudgeConfig?.stuck?.enabled
      ) {
        root.removeEventListener("beforeunload", handleBeforeUnload);
      }
    };
  }, [currentNudgeConfig?.exit?.enabled, currentNudgeConfig?.stuck?.enabled]);

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
