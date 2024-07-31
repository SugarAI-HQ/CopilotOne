import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { LanguageCode, getQueryParams } from "@sugar-ai/core";
import root from "window-or-global";
import { Translations } from "~/react/schema/message";
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  voices: SpeechSynthesisVoice[];
  translations: Translations;
  setTranslations: (translations: Translations) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

interface LanguageProviderProps {
  defaultLang: LanguageCode;
  defaultVoiceLang?: LanguageCode;
  defaultTranslations?: Translations;
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  defaultLang = "auto",
  defaultVoiceLang = "auto",
  defaultTranslations = {},
  children,
}) => {
  const initLang = (getQueryParams("lang") as LanguageCode) || defaultLang;
  const [language, setLanguage] = useState<LanguageCode>(initLang);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [translations, setTranslations] =
    useState<Translations>(defaultTranslations);

  useEffect(() => {
    if (!language || language == "auto") {
      setLanguage(
        defaultLang == "auto"
          ? (root.navigator.language as LanguageCode)
          : defaultLang,
      );
    }

    const synth = root.speechSynthesis;
    const onVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      const filterLang =
        defaultVoiceLang == "auto" ? language : defaultVoiceLang;

      const filterVoice =
        availableVoices.find((v) => v.lang.startsWith(filterLang as string)) ||
        availableVoices[0];

      setVoice(filterVoice);
    };
    synth.onvoiceschanged = onVoicesChanged;
    onVoicesChanged();
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        voice,
        setVoice,
        voices,
        translations,
        setTranslations,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
