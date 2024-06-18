import { copilotAssistantLangType, copilotAssistantVoiceType } from "./schema";

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

  if (langVoices.length == 1) {
    return langVoices[0];
  }

  if (langVoices.length > 1) {
    const preferedLangVoices = langVoices.filter((voice) =>
      voice.name.includes(preferedVoiceName),
    );
    preferedLangVoices.length > 0 ? preferedLangVoices[0] : langVoices[0];
  }
};

export const determinePreferredVoice = async (
  inputVoice,
  preferredLang,
  synth,
) => {
  if (inputVoice === copilotAssistantLangType.enum.auto) {
    if (preferredLang === copilotAssistantLangType.enum["hi-IN"]) {
      return (
        (await findAvailableVoice(
          copilotAssistantVoiceType.enum["Google हिन्दी"],
          preferredLang,
          synth,
        )) ??
        (await findAvailableVoice(
          copilotAssistantVoiceType.enum.Lekha,
          preferredLang,
          synth,
        ))
      );
    } else {
      return await findAvailableVoice(
        copilotAssistantVoiceType.enum.Nicky,
        preferredLang,
        synth,
      );
    }
  }
  if (inputVoice) {
    const preferredVoice = await findAvailableVoice(
      inputVoice,
      preferredLang,
      synth,
    );
    if (preferredVoice) {
      return preferredVoice;
    }
  }

  const defaultVoices = Object.values(copilotAssistantVoiceType.Values);
  for (const defaultVoice of defaultVoices) {
    const voice = await findAvailableVoice(defaultVoice, preferredLang, synth);
    if (voice) {
      return voice;
    }
  }
  return null; // Return null if no default voice found
};

export const determinePreferredLang = (inputLang) => {
  const defaultLang =
    Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta"
      ? copilotAssistantLangType.enum["hi-IN"]
      : copilotAssistantLangType.enum["en-US"];
  if (inputLang === copilotAssistantLangType.enum.auto) {
    return defaultLang;
  }
  return inputLang || defaultLang;
};

export const getPreferredVoiceAndLang = async (
  inputVoice,
  inputLang,
  synth,
) => {
  const preferredLang = determinePreferredLang(inputLang);
  const preferredVoice = await determinePreferredVoice(
    inputVoice,
    preferredLang,
    synth,
  );
  return { lang: preferredLang, voice: preferredVoice };
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
