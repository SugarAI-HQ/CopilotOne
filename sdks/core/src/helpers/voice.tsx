// import { LanguageCode, i18Message } from "../base/schema/"

import { i18Message } from "~/react/schema/message";
import { LanguageCode } from "~/schema/lang";

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
  synth = synth ?? window.speechSynthesis;

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

export const speaki18kMessageAsync = async (
  message: i18Message,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
): Promise<void> => {
  return speakMessageAsync(extracti18Text(message, language), language, voice);
};

export const cancelMessage = () => {
  if (!synth) return;
  synth.cancel();
};

export const extracti18Text = (message: i18Message, language: LanguageCode) => {
  const userLang: LanguageCode = language.split("-")[0] as LanguageCode;
  let text = "not found";
  text = message?.lang[language] ?? (message?.lang[userLang] as string);
  return text;
};
