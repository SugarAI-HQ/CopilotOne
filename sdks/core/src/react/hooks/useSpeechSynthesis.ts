import { useState, useEffect, useRef } from "react";
import root from "window-or-global";
import {
  speakMessage as sm,
  speakMessageAsync as sma,
  stopSpeaking as sp,
  extracti18nText,
} from "~/helpers/voice";

const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    synthRef.current = root.speechSynthesis;
  }, []);

  const speakMessage = (
    message,
    language,
    voice,
    callback,
    failureCallback,
  ) => {
    sm(message, language, voice, callback, failureCallback);
  };

  // const speakMessage = (
  //   message,
  //   language,
  //   voice,
  //   callback,
  //   failureCallback,
  // ) => {
  //   console.log(`${voice?.name} Speaking in ${language}: ${message}`);

  //   const utterance = new SpeechSynthesisUtterance(message);
  //   utterance.voice = voice;
  //   utterance.lang = language;

  //   utterance.onstart = () => {
  //     setIsSpeaking(true);
  //   };

  //   utterance.onend = () => {
  //     setIsSpeaking(false);
  //     if (callback) callback();
  //   };

  //   utterance.onerror = (event) => {
  //     setIsSpeaking(false);
  //     if (failureCallback) failureCallback(event);
  //     console.error(
  //       `speechSynthesisUtterance.onerror ${JSON.stringify(event)}`,
  //     );
  //   };

  //   synthRef?.current?.speak(utterance);
  // };

  const speakMessageAsync = async (message, language, voice) => {
    setIsSpeaking(true);
    await sma(message, language, voice);
    setIsSpeaking(false);
    return;
  };

  const speaki18nMessageAsync = async (message, language, voice) => {
    return speakMessageAsync(
      extracti18nText(message, language),
      language,
      voice,
    );
  };

  const stopSpeaking = () => {
    sp();
    setIsSpeaking(false);
  };

  return {
    isSpeaking,
    speakMessage,
    speakMessageAsync,
    speaki18nMessageAsync,
    stopSpeaking,
  };
};

export default useSpeechSynthesis;

// export const extracti18nText = (message, language) => {
//   const userLang = language.split("-")[0];
//   let text = message?.lang[language] ?? message?.lang[userLang] ?? "not found";
//   return text;
// };
