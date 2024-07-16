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
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguage] = useState<string>("en");
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const onVoicesChanged = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      const defaultVoice =
        availableVoices.find((v) => v.lang.startsWith(language)) ||
        availableVoices[0];
      setVoice(defaultVoice);
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
