// import { LanguageCode, i18nMessage } from "../base/schema/"

import EasySpeech from "easy-speech";
import root from "window-or-global";
import { i18nMessage, LanguageCode } from "~/schema";

const NOT_FOUND = "not found";

// let synth: any = null;
let recognition: any = null;
let utterances: any[] = [];

const speakMessagex = (
  message: string,
  language: string,
  voice: SpeechSynthesisVoice,
  callback?: () => void,
  failureCallback?: (event: any) => void,
) => {
  root.synth = root.synth ?? root.speechSynthesis;
  // let synth = root.synth;
  const utterance = new SpeechSynthesisUtterance(message);
  utterances.push(utterance);

  utterance.voice = voice;
  utterance.lang = language;

  utterance.onend = () => {
    DEV: console.log(`[Speaking](${utterances.length}) speaking done`);
    if (callback) callback();
    alert("Speaking done");
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
    root.synth.speak(utterance);
    // root.addEventListener("unload", stopSpeaking());
  }, 100);

  // synth.speak(utterance);
};

export const speakMessage = (
  message: string,
  language: LanguageCode,
  voice: SpeechSynthesisVoice,
  resolve?: () => void,
  reject?: (event: any) => void,
): void => {
  console.log(
    `[Speaking](${utterances.length}) ${voice?.name} in ${language}: ${message}`,
  );

  // EasySpeech.debug((arg) =>
  //   console.log(`[Speaking][${utterances.length}]`, arg),
  // );

  EasySpeech.init({ maxTimeout: 5000, interval: 250 })
    .then(() => {})
    .catch((e) => console.error(e));

  utterances.push(message);

  let speechEnded = false;
  let boundaryTriggered = false;
  const fallbackTimeout = 5000; // Time after last boundary to consider as end

  const checkEnd = () => {
    if (!speechEnded) {
      console.warn(
        `[Speaking](${utterances.length}) Speech ended due to fallback mechanism`,
      );
      resolve && resolve();
    }
  };

  let timeoutId = setTimeout(checkEnd, fallbackTimeout);

  EasySpeech.speak({
    text: message,
    voice: voice,
    pitch: 1,
    rate: 1,
    volume: 1,
    boundary: (e) => {
      // console.debug(`[Speaking](${utterances.length}) Boundary reached`, e);
      boundaryTriggered = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkEnd, fallbackTimeout);
    },
    end: () => {
      //   DEV: console.debug(`[Speaking](${utterances.length}) Speech ended naturally`);
      speechEnded = true;
      clearTimeout(timeoutId);
      resolve && resolve();
    },
    error: (e) => {
      PROD: console.error(
        `[Speaking](${utterances.length}) Speech synthesis error`,
        e,
      );
      speechEnded = true;
      clearTimeout(timeoutId);
      reject && reject(e);
    },
  });

  // // In case the `end` event is not triggered and `boundary` was not triggered
  // setTimeout(() => {
  //   if (!speechEnded && !boundaryTriggered) {
  //     console.debug("Speech ended due to no boundary or end event");
  //     resolve && resolve();
  //   }
  // }, fallbackTimeout + 500); // Small additional buffer
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
  if (!root.synth) return;
  root.synth.cancel();
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
