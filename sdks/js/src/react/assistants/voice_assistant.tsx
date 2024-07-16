/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
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
  determinePreferredVoice,
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
import { getKeyInSession, setKeyInSession } from "../session";

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
  const [isSpeaking, setIsSpeaking] = useState(false);
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
  const [lang, setLang] = useState("");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
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

  async function setupLangageAndVoice() {
    // lang
    const lang = determinePreferredLang(currentAiConfig.lang);
    setLang(lang);

    // voice
    const voice = await determinePreferredVoice(
      currentAiConfig.voice,
      currentAiConfig.lang,
      root.speechSynthesis,
    );
    root.saiVoice = voice;
    setVoice(voice);

    PROD: console.log(`[nudge] setup lang: ${lang}, ${voice?.name}`);
  }
  useEffect(() => {
    DEV: console.log(`[nudge] voice updated ${voice?.name}`);
  }, [voice]);
  useEffect(() => {
    DEV: console.log(`[nudge] lang updated ${lang}`);
  }, [lang]);

  // welcome
  useEffect(() => {
    setupLangageAndVoice();

    void checkIfAudioPermissionGranted();
    setButtonName(id ?? (position as string));
    const welcomeTimer = setTimeout(async () => {
      await welcomeNudge();
    }, currentNudgeConfig?.welcome?.delay * 1000);
    setHideToolTip(true);

    return () => {
      clearTimeout(welcomeTimer);
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
    recognition.stop();
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
    // const lang = determinePreferredLang(currentAiConfig.lang);
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
    const voiceMessage = new SpeechSynthesisUtterance(text);

    const lVoice = voice ?? root.saiVoice;
    console.log(`[nudge] ${lVoice?.name} speaking in ${lang}: ${text}`);

    // set lang and voice
    // voiceMessage.lang = lang;
    voiceMessage.voice = lVoice as SpeechSynthesisVoice;

    const stopSpeakingOnPageUnload = () => {
      synth.cancel();
    };

    const cleanup = () => {
      setIsSpeaking(false);
      root.removeEventListener("beforeunload", stopSpeakingOnPageUnload);
    };

    voiceMessage.onerror = (event) => {
      cleanup();
      PROD: console.error(
        `[nudge] voiceMessage.onerror ${JSON.stringify(event, ["message", "arguments", "type", "name"])}`,
      );
    };

    voiceMessage.onend = () => {
      cleanup();
      // recognition?.start();
    };

    root.addEventListener("beforeunload", stopSpeakingOnPageUnload);
    // const voices = synth.getVoices();
    // const selectedVoice = voices.find((v) => {
    //   return v.lang.startsWith(lang) && v.name.includes(voice);
    // });
    // if (selectedVoice) {
    //   voiceMessage.voice = selectedVoice;
    // }

    console.log(
      `[nudge] ${lVoice?.name} paused:${synth.paused}, pending:${synth.pending}, speaking:${synth.speaking}`,
    );
    synth.speak(voiceMessage);

    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    const synth = root.speechSynthesis;
    synth.cancel();
    setIsSpeaking(false);
  };

  const enableKeyboard = () => {
    setHideVoiceButton(!hideVoiceButton);
  };

  scope = { ...scopeDefaults, ...scope };

  const upsertNudgeText = async (
    action: string,
    nudgeConfig: any,
    create: boolean,
  ): Promise<string | boolean> => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    // const { voice, lang } = await getPreferredVoiceAndLang(
    //   currentAiConfig.voice,
    //   currentAiConfig.lang,
    //   root.speechSynthesis,
    // );
    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
      ...nudgeConfig.promptVariables,
    };
    const aiResponse = await textToAction(
      (nudgeConfig.promptTemplate || promptTemplate) as string,
      create ? "" : nudgeConfig.text,
      {
        ...currentPromptVariables,
        "#GENDER": getGender(voice!),
        "#LANGUAGE": lang,
        "#ACTION": action,
      },
      newScope,
      true,
      nudgeConfig.chatHistorySize,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });

    if (typeof aiResponse === "string") {
      return aiResponse;
    } else {
      return false;
    }
  };

  const processSpeechToText = async (
    input: string,
    isSpeak: boolean = true,
  ) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    setIsprocessing(true);

    // const { voice, lang } = await getPreferredVoiceAndLang(
    //   currentAiConfig.voice,
    //   currentAiConfig.lang,
    //   root.speechSynthesis,
    // );
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
      4,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });

    if (typeof aiResponse === "string") {
      if (currentAiConfig.successResponse !== aiResponse) {
        setAiResponse(aiResponse);
        isSpeak && (await speak(aiResponse));
      } else {
        await playAudio(currentStyle.voiceButton?.audio as string);
      }
      recognition.stop();
    }
  };

  const playAudio = async (url: string) => {
    try {
      const audio = new Audio(url);
      await audio.play();
      audio.addEventListener("error", (e) => {
        console.error("Audio playback error:", e);
      });
    } catch (error) {
      console.error("Error initializing audio:", error);
    }
  };

  const startSending = async () => {
    const newTextMessage = textMessage;
    setTextMessage("");
    setAiResponse("");
    setFinalOutput(newTextMessage);
    await processSpeechToText(newTextMessage, false);
  };

  const triggerNudgeOncePerSession = async (action, config) => {
    const actionKey = `last${action}NudgeAt`;

    if (!config.enabled) {
      console.log(`[nudge] ${action} Not enabled`);
      return;
    }

    const isAlreadyShown = getKeyInSession(actionKey);

    if (isAlreadyShown) {
      console.log(`[nudge ] ${action} Already shown`);
      return;
    }

    // Perform the action
    await triggerNudge(action, config);

    // Set the flag in local storage
    setKeyInSession(actionKey, Date.now().toString());
  };

  const welcomeNudge = async () => {
    triggerNudgeOncePerSession("Welcome", currentNudgeConfig?.welcome);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  const idleNudge = async () => {
    triggerNudgeOncePerSession("Idle", currentNudgeConfig?.idle);
    // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  };

  // const stuckNudge = async () => {
  //   triggerNudgeOncePerSession("Stuck", currentNudgeConfig?.stuck);
  //   // await processSpeechToText(currentNudgeConfig?.idle?.text, false, true);
  // };

  const exitNudge = async () => {
    console.log("[nudge] called exit nudge");

    // triggerNudgeOncePerSession("Exit", currentNudgeConfig?.exit);
    triggerNudge("Exit", currentNudgeConfig?.exit);

    // await triggerNudge(currentNudgeConfig?.exit);
    // await processSpeechToText(currentNudgeConfig?.exit?.text, false, true);
  };

  let timeSpentTimer: any | null = null;
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
            onStuck(root.location.pathname);
          }
        }, threshold);
      } else {
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

  const triggerNudge = async (action: string, config: any) => {
    if (!config.enabled) {
      DEV: console.log(`[nudge] ${action} not enabled`);
      return;
    }

    let nudgeText = config?.text;

    // Load text if in "ai" mode
    if (config?.textMode === "ai") {
      const aiNudgeText = await upsertNudgeText(action, config, true);

      // only override if able to generate response, else fallback to manual
      if (aiNudgeText) {
        nudgeText = aiNudgeText;
      }
    } else {
      await upsertNudgeText(action, config, false);
    }

    DEV: console.log(
      `[nudge] ${action} voice: ${voice?.name} message:`,
      nudgeText,
    );

    // Show tooltip
    setTipConfig({
      isEnabled: config?.enabled,
      text: nudgeText,
      duration: config?.duration,
    });

    // hide
    setTimeout(() => {
      setHideToolTip(false);
    }, config?.duration * 1000);

    // Start Speak in enabled
    if (config?.voiceEnabled) {
      speak(nudgeText);
    }
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
    // Recommended
    event.preventDefault();
    const message =
      "Hola, Are you sure you want to leave? Changes you made may not be saved.";
    event.returnValue = message; // Standard message for all modern browsers

    // Included for legacy support, e.g. Chrome/Edge < 119
    // event.returnValue = true;

    if (currentNudgeConfig?.exit?.enabled) {
      exitNudge();
    }

    // trackTimeSpentOnPage();
    if (timeSpentTimer !== null) {
      clearTimeout(timeSpentTimer);
      elapsedTime += (Date.now() - startTime) / 1000;
    }
    // Return false to keep the page from being unloaded
    return false;
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
    // resetSession();
    // root.addEventListener("load", trackTimeSpentOnPage);
    trackTimeSpentOnPage();
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
    };
  }, [currentNudgeConfig?.exit?.enabled, currentNudgeConfig?.stuck?.enabled]);

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
                withvoice={"true"}
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
              isSpeaking={isSpeaking}
              stopSpeaking={stopSpeaking}
            />
            {isUserEngaged && isLeftPositioned && isCenterPositioned && (
              <KeyboardEmptyContainer></KeyboardEmptyContainer>
            )}
            {isUserEngaged && isRightPositioned && (
              <Keyboard
                style={keyboardButtonStyle}
                currentStyle={currentStyle?.keyboardButton}
                enableKeyboard={enableKeyboard}
                withvoice={"true"}
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
          isprocessing={isprocessing}
          iskeyboard={false}
        />
      )}
    </StyleSheetManager>
  );
};
