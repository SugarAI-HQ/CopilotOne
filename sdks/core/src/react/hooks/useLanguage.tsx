import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import root from "window-or-global";
import { LanguageCode } from "~/schema/lang";
import { Translations } from "~/schema/message";
interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  voices: SpeechSynthesisVoice[];
  translations: Translations;
  setTranslations: (translations: Translations) => void;
}
import { getQueryParams } from "~/helpers/url";

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
  languagesEnabled?: LanguageCode[];
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  defaultLang = "auto",
  defaultVoiceLang = "auto",
  languagesEnabled = [],
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
      console.log(`Lang: ${language}, default: ${defaultLang}`);
      const selectLang =
        defaultLang == "auto"
          ? (root.navigator.language as LanguageCode)
          : defaultLang;
      if (
        languagesEnabled.length > 0 &&
        languagesEnabled.includes(selectLang)
      ) {
        setLanguage(selectLang);
      } else if (languagesEnabled.length > 0) {
        setLanguage(languagesEnabled[0]);
      } else {
        setLanguage(selectLang);
      }
    }

    const synth = root.speechSynthesis;
    const onVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      const filterLang =
        defaultVoiceLang == "auto" ? language : defaultVoiceLang;

      const [lang, country] = filterLang.split("-");

      let filterVoice =
        availableVoices.find((v) => v.lang.startsWith(filterLang as string)) ||
        availableVoices.find((v) => v.lang.startsWith(lang as string));

      // For indian languages fallback to google-hindi
      // as it support for mulitple indian languages
      if (!filterVoice && country == "IN") {
        filterVoice = availableVoices.find(
          (v) => v.lang.split("-")[1] === country && v.name === "Google हिन्दी",
        );
      }
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
