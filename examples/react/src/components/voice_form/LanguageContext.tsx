import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
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
  defaultLang: string;
  defaultVoice: string;
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  defaultLang = "auto",
  defaultVoice = "auto",
  children,
}) => {
  const [language, setLanguage] = useState<string | null>(null);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!language) {
      setLanguage(
        defaultLang == "auto" ? window.navigator.language : defaultLang
      );
    }

    const synth = window.speechSynthesis;
    const onVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      const langVoice =
        availableVoices.find((v) => v.lang.startsWith(language)) ||
        availableVoices[0];

      const filterVoice = defaultVoice == "auto" ? langVoice : defaultVoice;

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
