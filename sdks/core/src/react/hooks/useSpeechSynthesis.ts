import { useState, useEffect, useRef } from "react";
import root from "window-or-global";
import {
  speakMessage as sm,
  speakMessageAsync as sma,
  speaki18nMessageAsync as smaa,
  stopSpeaking as sp,
  extracti18nText,
} from "~/helpers/voice";
import { i18nMessage, LanguageCode } from "~/schema";

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

  const speakMessageAsync = async (message, language, voice) => {
    setIsSpeaking(true);
    await sma(message, language, voice);
    setIsSpeaking(false);
    return;
  };

  const speaki18nMessageAsync = async (
    message: i18nMessage,
    language: LanguageCode,
    voice: SpeechSynthesisVoice,
    appendText: string = "",
  ): Promise<void> => {
    setIsSpeaking(true);
    await smaa(message, language, voice, appendText);
    setIsSpeaking(false);
    return;
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
