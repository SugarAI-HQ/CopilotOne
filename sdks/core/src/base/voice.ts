import { getUniqueLanguagesAndCountries } from "./lang";
import {
  copilotAssistantLangType,
  copilotAssistantVoiceType,
} from "../schema/copilot";
import root from "window-or-global";

const voices = {
  male: [
    "Rishi", // - en-IN",
    "Aaron", // - en-US",
    "Albert", // - en-US",
    "Arthur", // - en-GB",
    "Bad News", // - en-US",
    "Daniel (English (United Kingdom))", // - en-GB",
    "Daniel (French (France))", // - fr-FR",
    "Eddy (German (Germany))", // - de-DE",
    "Eddy (English (United Kingdom))", // - en-GB",
    "Eddy (English (United States))", // - en-US",
    "Eddy (Spanish (Spain))", // - es-ES",
    "Eddy (Spanish (Mexico))", // - es-MX",
    "Eddy (Finnish (Finland))", // - fi-FI",
  ],
  female: [
    "Alice", // - it-IT",
    "Alva", // - sv-SE",
    "Amélie", // - fr-CA",
    "Amira", // - ms-MY",
    "Anna", // - de-DE",
    "Carmit", // - he-IL",
    "Catherine", // - en-AU",
    "Damayanti", // - id-ID",
    "Daria", // - bg-BG",
    "Ellen", // - nl-BE",
    "Flo (German (Germany))", // - de-DE",
    "Flo (English (United Kingdom))", // - en-GB",
    "Flo (English (United States))", // - en-US",
    "Flo (Spanish (Spain))", // - es-ES",
    "Flo (Spanish (Mexico))", // - es-MX",
    "Flo (Finnish (Finland))", // - fi-FI",
    "Flo (French (Canada))", // - fr-CA",
    "Flo (French (France))", // - fr-FR",
    "Flo (Italian (Italy))", // - it-IT",
    "Flo (Portuguese (Brazil))", // - pt-BR",
    "Google हिन्दी", // - hi-IN",
    "Grandma (German (Germany))", // - de-DE",
    "Grandma (English (United Kingdom))", // - en-GB",
    "Grandma (English (United States))", // - en-US",
    "Grandma (Spanish (Spain))", // - es-ES",
    "Grandma (Spanish (Mexico))", // - es-MX",
    "Grandma (Finnish (Finland))", // - fi-FI",
    "Grandma (French (Canada))", // - fr-CA",
    "Grandma (French (France))", // - fr-FR",
    "Grandma (Italian (Italy))", // - it-IT",
    "Grandma (Portuguese (Brazil))", // - pt-BR",
    "Joana", // - pt-PT",
    "Karen", // - en-AU",
    "Kathy", // - en-US",
    "Kyoko", // - ja-JP",
    "Lana", // - hr-HR",
    "Laura", // - sk-SK",
    "Lekha", // - hi-IN",
    "Lesya", // - uk-UA",
    "Marie", // - fr-FR",
    "Samantha", // - en-US",
    "Sara", // - da-DK",
    "Satu", // - fi-FI",
    "Shelley (German (Germany))", // - de-DE",
    "Shelley (English (United Kingdom))", // - en-GB",
    "Shelley (English (United States))", // - en-US",
    "Shelley (Spanish (Spain))", // - es-ES",
    "Shelley (Spanish (Mexico))", // - es-MX",
    "Shelley (Finnish (Finland))", // - fi-FI",
    "Shelley (French (Canada))", // - fr-CA",
    "Shelley (French (France))", // - fr-FR",
    "Shelley (Italian (Italy))", // - it-IT",
    "Shelley (Portuguese (Brazil))", // - pt-BR",
    "Sandy (German (Germany))", // - de-DE",
    "Sandy (English (United Kingdom))", // - en-GB",
    "Sandy (English (United States))", // - en-US",
    "Sandy (Spanish (Spain))", // - es-ES",
    "Sandy (Spanish (Mexico))", // - es-MX",
    "Sandy (Finnish (Finland))", // - fi-FI",
    "Sandy (French (Canada))", // - fr-CA",
    "Sandy (French (France))", // - fr-FR",
    "Sandy (Italian (Italy))", // - it-IT",
    "Sandy (Portuguese (Brazil))", // - pt-BR",
    "Sinji", // - zh-HK",
    "Tessa", // - en-ZA",
    "Thomas", // - fr-FR",
    "Trinoids", // - en-US",
    "Tünde", // - hu-HU",
    "Yelda", // - tr-TR",
  ],
};

export const findAvailableVoice = async (
  preferedVoiceName: string,
  lang: string,
  synth: SpeechSynthesis,
) => {
  const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let voices = synth.getVoices();

    if (voices.length) {
      resolve(voices);
      return;
    }

    const voiceschanged = () => {
      voices = synth.getVoices();
      resolve(voices);
    };

    synth.onvoiceschanged = voiceschanged;
  });

  const langVoices = voices.filter((voice) => voice.lang.startsWith(lang));

  if (langVoices.length === 1) {
    return langVoices[0];
  }

  if (langVoices.length > 1) {
    const preferedLangVoices = langVoices.filter((voice) =>
      voice.name.includes(preferedVoiceName),
    );
    return preferedLangVoices.length > 0
      ? preferedLangVoices[0]
      : langVoices[0];
  }
};

export const findAvailableVoiceInOrder = async (
  preferedVoiceNames: string[],
  lang: string,
  synth: SpeechSynthesis,
) => {
  let finalVoice: SpeechSynthesisVoice | null = null;

  const avaiableVoices = await new Promise<SpeechSynthesisVoice[]>(
    (resolve) => {
      let voices = synth.getVoices();

      if (voices.length) {
        resolve(voices);
        return;
      }

      const voiceschanged = () => {
        voices = synth.getVoices();
        resolve(voices);
      };

      synth.onvoiceschanged = voiceschanged;
    },
  );
  if (preferedVoiceNames.length === 0) {
    // find best mathcing voice for match
    const langVoices = avaiableVoices.filter((voice) =>
      voice.lang.startsWith(lang),
    );
    // Pick the first voice
    if (langVoices.length > 0) {
      finalVoice = langVoices[0];
    }
  } else {
    // predefined languages specific voices

    const avaiableVoicesName = avaiableVoices.map((voice) => voice.name);
    const avaiableVoicesSet = new Set(avaiableVoicesName);

    const filteredVoiceNames = preferedVoiceNames.filter((voice) =>
      avaiableVoicesSet.has(voice),
    );

    if (filteredVoiceNames.length > 0) {
      finalVoice = avaiableVoices.find(
        (voice) => voice.name === filteredVoiceNames[0],
      ) as SpeechSynthesisVoice;
    }
  }

  if (finalVoice == null) {
    PROD: console.error(
      "[nudgess] No voice found for lang: ",
      lang,
      " and preferred voice names: ",
      preferedVoiceNames,
    );
  }

  return finalVoice;
};

export const determinePreferredVoice = async (
  inputVoice,
  preferredLang,
  synth,
) => {
  const voiceNames: string[] = [];

  const [lang, country] = preferredLang.split("-");

  // Automatically detect
  if (
    inputVoice === copilotAssistantLangType.enum.auto &&
    lang === copilotAssistantLangType.enum.auto
  ) {
    const { languages, countries } = getUniqueLanguagesAndCountries();

    // Hindi: जीवन एक यात्रा है, इसका आनंद लें।
    // English: Life is a journey, enjoy it.
    // Bengali: জীবন একটি যাত্রা, এটি উপভোগ করুন।
    // Telugu: జీవితం ఒక ప్రయాణం, దాన్ని ఆనందించండి।
    // Marathi: जीवन एक प्रवास आहे, त्याचा आनंद घ्या।
    // Tamil: வாழ்க்கை ஒரு பயணம், அதை மகிழுங்கள்.
    // Gujarati: જીવન એ એક મુસાફરી છે, તેનો આનંદ માણો.
    // Kannada: ಜೀವನವು ಒಂದು ಯಾತ್ರೆ, ಇದನ್ನು ಆನಂದಿಸಿ.
    // Odia: ଜୀବନ ଏକ ଯାତ୍ରା, ଏହାକୁ ଉପଭୋଗ କରନ୍ତୁ।
    // Malayalam: ജീവിതം ഒരു യാത്രയാണ്, അതില്‍ ആനന്ദം നിറയൂ.
    // Punjabi: ਜ਼ਿੰਦਗੀ ਇੱਕ ਸਫ਼ਰ ਹੈ, ਇਸ ਦਾ ਆਨੰਦ ਲਓ।
    if (
      languages.includes("hi") || // Hindi
      languages.includes("en") || // English
      languages.includes("bn") || // Bengali
      languages.includes("te") || // Telugu
      languages.includes("mr") || // Marathi
      languages.includes("ta") || // Tamil
      languages.includes("gu") || // Gujarati
      languages.includes("kn") || // Kannada
      languages.includes("or") || // Odia
      languages.includes("ml") || // Malayalam
      languages.includes("pa") || // Punjabi
      countries.includes("IN") // India
    ) {
      voiceNames.push(copilotAssistantVoiceType.enum["Google हिन्दी"]);
      voiceNames.push(copilotAssistantVoiceType.enum.Lekha);
    }

    // for english speakers otherwise
    if (languages.includes("en")) {
      voiceNames.push(copilotAssistantVoiceType.enum.Nicky);
    }
  } else if (
    // for non auto, indian user use closest to hinglish voice
    lang !== copilotAssistantLangType.enum.auto
  ) {
    if (
      lang in
        ["hi", "en", "bn", "te", "mr", "ta", "gu", "kn", "or", "ml", "pa"] ||
      country === "IN"
    ) {
      voiceNames.push(copilotAssistantVoiceType.enum["Google हिन्दी"]);
      voiceNames.push(copilotAssistantVoiceType.enum.Lekha);
    }
    if (lang === "en") {
      voiceNames.push(copilotAssistantVoiceType.enum.Nicky);
    }
  } else {
    voiceNames.push(inputVoice);
  }

  const fv = await findAvailableVoiceInOrder(voiceNames, preferredLang, synth);
  return fv;
};

export const determinePreferredLang = (inputLang) => {
  const defaultLang = root.navigator.language;
  const lang = inputLang.split("-")[0];

  if (copilotAssistantLangType.enum.auto !== lang) {
    return inputLang;
  }

  // For auto, indian user use closest to hinglish
  // For defined lang, go for it right away
  const { languages, countries } = getUniqueLanguagesAndCountries();

  if (copilotAssistantLangType.enum.auto === lang) {
    if (countries.includes("IN")) {
      if (languages.includes("en")) {
        return copilotAssistantLangType.enum["en-IN"];
      }
      if (languages.includes("hi")) {
        return copilotAssistantLangType.enum["hi-IN"];
      }
    }
    return defaultLang;
  }
  // const defaultLang =
  //   Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta"
  //     ? copilotAssistantLangType.enum["hi-IN"]
  //     : copilotAssistantLangType.enum["en-US"];
  return inputLang || defaultLang;
};

export const getGender = (voice: SpeechSynthesisVoice) => {
  if (voice && voices.female.includes(voice.name)) {
    return "female";
  }
  if (voice && voices.male.includes(voice.name)) {
    return "male";
  }
  return "unknown";
};
