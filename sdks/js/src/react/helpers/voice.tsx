// import { LanguageCode, i18nMessage } from "../base/schema/"

import { LanguageCode, i18nMessage } from "@sugar-ai/core";
import root from "window-or-global";

const NOT_FOUND = "not found";

let synth: any = null;
let recognition: any = null;
let utterances: any[] = [];

export const speakMessage = (
  message: string,
  language: string,
  voice: SpeechSynthesisVoice,
  callback?: () => void,
  failureCallback?: (event: any) => void,
) => {
  const utterance = new SpeechSynthesisUtterance(message);
  utterances.push(utterance);
  synth = synth ?? root.speechSynthesis;

  utterance.voice = voice;
  utterance.lang = language;

  // utterance.onmark = (event) => {
  //   DEV: console.log(
  //     `[Speaking](${utterances.length}) mark: ${JSON.stringify(event)}`,
  //   );
  // };

  // utterance.onboundary = (event) => {
  //   DEV: console.log(
  //     `[Speaking](${utterances.length}) boundary: ${JSON.stringify(event)}`,
  //   );
  // };

  // utterance.onpause = (event) => {
  //   DEV: console.log(
  //     `[Speaking](${utterances.length}) pause: ${JSON.stringify(event)}`,
  //   );
  // };

  // utterance.onstart = (event) => {
  //   DEV: console.log(
  //     `[Speaking](${utterances.length}) start: ${JSON.stringify(event)}`,
  //   );
  // };

  utterance.onend = () => {
    DEV: console.log(`[Speaking](${utterances.length}) speaking done`);
    if (callback) callback();
  };

  utterance.onerror = (event) => {
    DEV: console.error(
      `[Speaking](${utterances.length}) Error ${JSON.stringify(event)}`,
    );
    if (failureCallback) failureCallback(event);
  };

  setTimeout(() => {
    console.log(
      `[Speaking](${utterances.length}) ${voice?.name} in ${language}: ${message}`,
    );
    synth.speak(utterance);
    // root.addEventListener("unload", stopSpeaking());
  }, 100);

  // synth.speak(utterance);
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
