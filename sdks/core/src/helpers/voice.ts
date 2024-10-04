// import { LanguageCode, i18nMessage } from "../base/schema/"

import EasySpeech from "easy-speech";
import root from "window-or-global";
import { extracti18nText } from "~/i18n";
import { i18nMessage, LanguageCode } from "~/schema";

// const NOT_FOUND = "not found";

// let synth: any = null;
let recognition: any = null;
let utterances: any[] = [];

export const speakMessage = (
  message: string,
  language: string,
  voice: SpeechSynthesisVoice,
  resolve?: () => void,
  reject?: (event: any) => void,
) => {
  root.saisynth = root.saisynth ?? root.speechSynthesis;

  // cancel if any exising voice is being called out
  // stopSpeaking();

  // let synth = root.saisynth;
  const utterance = new SpeechSynthesisUtterance(message);

  utterance.voice = voice;
  utterance.lang = language;

  // Hack to handle the ios bug when onend not triggered
  let speechEnded = false;
  let boundaryTriggered = false;
  let timeoutId: NodeJS.Timeout = setTimeout(() => {}, 10);
  // const fallbackTimeout = 5000;
  const boundaryFallbackTimeout = 2000; // Time after last boundary to consider as end

  const checkEnd = (reason: string = "unknown") => {
    if (!speechEnded) {
      console.warn(
        `[Speaking](${utterances.length}) Speech ended due to ${reason}`,
      );
      resolve && resolve();
    }
  };

  // timeoutId = setTimeout(
  //   () => checkEnd("global fallback timeout"),
  //   fallbackTimeout,
  // );

  const hackEnd = (e: any) => {
    DEV: console.debug(`[Speaking](${utterances.length}) Boundary reached`, e);
    boundaryTriggered = true;
    clearTimeout(timeoutId);
    // timeoutId = setTimeout(checkEnd, boundaryFallbackTimeout);
    timeoutId = setTimeout(() => checkEnd("boundary"), boundaryFallbackTimeout);
  };

  utterance.onboundary = hackEnd;

  utterance.onend = () => {
    DEV: console.debug(
      `[Speaking](${utterances.length}) Speech ended naturally`,
    );
    speechEnded = true;
    clearTimeout(timeoutId);
    resolve && resolve();
  };

  utterance.onerror = (e) => {
    PROD: console.error(
      `[Speaking](${utterances.length}) Error ${JSON.stringify(e)}`,
      e,
    );
    speechEnded = true;
    clearTimeout(timeoutId);
    reject && reject(e);
  };

  setTimeout(() => {
    console.log(
      `[Speaking](${utterances.length}) ${voice?.name}(${voice?.lang}) in ${language}: ${message}`,
    );
    root.saisynth.speak(utterance);
    // root.addEventListener("unload", stopSpeaking());
  }, 10);

  utterances.push(utterance);
};

export const speakMessagex = (
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
  const fallbackTimeout = 2000; // Time after last boundary to consider as end

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
};

//   // // In case the `end` event is not triggered and `boundary` was not triggered
//   // setTimeout(() => {
//   //   if (!speechEnded && !boundaryTriggered) {
//   //     console.debug("Speech ended due to no boundary or end event");
//   //     resolve && resolve();
//   //   }
//   // }, fallbackTimeout + 500); // Small additional buffer
// };

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
  appendText: string = "",
): Promise<void> => {
  return speakMessageAsync(
    extracti18nText(message, language) + appendText,
    language,
    voice,
  );
};

export const stopSpeaking = () => {
  if (!root.saisynth) return;
  if (root.saisynth.speaking) {
    console.warn(`[Speaking](${utterances.length}) Cancelling speaking`);
    root.saisynth.cancel();
  }
};
