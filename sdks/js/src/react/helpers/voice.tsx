// import { LanguageCode, i18nMessage } from "../base/schema/"

import { LanguageCode, i18nMessage } from "@sugar-ai/core";
import root from "window-or-global";

const NOT_FOUND = "not found";

let synth: any = null;
let recognition: any = null;

export const speakMessage = (
  message: string,
  language: string,
  voice: SpeechSynthesisVoice,
  callback?: () => void,
  failureCallback?: (event: any) => void,
) => {
  console.log(`${voice?.name} Speaking in ${language}: ${message}`);

  const utterance = new SpeechSynthesisUtterance(message);
  synth = synth ?? root.speechSynthesis;

  utterance.voice = voice;
  utterance.lang = language;

  utterance.onend = () => {
    if (callback) callback();
  };

  utterance.onerror = (event) => {
    if (failureCallback) failureCallback(event);
    console.error(`speechSynthesisUtterance.onerror ${JSON.stringify(event)}`);
  };

  synth.speak(utterance);
};

export const speakMessageAsync = async (
  message: string,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    speakMessage(message, language, voice, resolve, reject);
  });
};

export const speaki18nMessageAsync = async (
  message: i18nMessage,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
): Promise<void> => {
  return speakMessageAsync(extracti18nText(message, language), language, voice);
};

export const stopSpeaking = () => {
  if (!synth) return;
  synth.cancel();
};

export const extracti18nText = (
  message: i18nMessage,
  language: LanguageCode,
) => {
  const userLang: LanguageCode = language.split("-")[0] as LanguageCode;
  let text = NOT_FOUND;
  text = message?.lang[language] ?? (message?.lang[userLang] as string);
  if (text == NOT_FOUND) {
    console.error(
      `i18n message not found for ${language}: ${JSON.stringify(message)}`,
    );
  }
  return text;
};
