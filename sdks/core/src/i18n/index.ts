import { Translations, i18nMessage } from "~/schema/message";

export const FormTranslations: Translations = {
  permissionsGranted: {
    en: "Microphone permissions granted. You can now speak.",
    hi: "माइक्रोफोन अनुमतियाँ दी गईं। अब आप बोल सकते हैं।",
  },
  permissionFailed: {
    en: "Please try again by giving microphone permissions.",
    hi: "कृपया माइक्रोफोन अनुमतियाँ देकर पुनः प्रयास करें।",
  },
  selectedAnswer: {
    en: "Selected Answer is",
    hi: "चयनित उत्तर है",
  },
  requestMicPermissions: {
    en: "Please give microphone permissions.",
    hi: "कृपया माइक्रोफ़ोन की अनुमतियाँ दें।",
  },
  noSpeech: {
    en: "Waiting for your answer. Please speak now.",
    hi: "कृपया अपना उत्तर बोलें।",
  },
};

export function geti18nMessage(
  key: string,
  translations: Translations = FormTranslations,
) {
  const translation = translations[key];
  if (!translation) {
    throw new Error(`translations for "${key}" not found`);
  }
  const msg: i18nMessage = {
    mode: "manual",
    lang: translation,
    voice: true,
    output: "none",
  };

  return msg;
}
