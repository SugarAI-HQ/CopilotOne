import { LanguageCode } from "@/schema/quizSchema";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  voices: SpeechSynthesisVoice[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
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
  defaultVoiceLang: LanguageCode;
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  defaultLang = "auto",
  defaultVoiceLang = "auto",
  children,
}) => {
  const [language, setLanguage] = useState<LanguageCode>("auto");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!language || language == "auto") {
      setLanguage(
        defaultLang == "auto"
          ? (window.navigator.language as LanguageCode)
          : defaultLang
      );
    }

    const synth = window.speechSynthesis;
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
      value={{ language, setLanguage, voice, setVoice, voices }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
