import { useEffect, useState, type FC, ChangeEvent } from "react";
// import { FaLanguage } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";
import { MdLanguage } from "react-icons/md";

import { Tooltip as ReactTooltip } from "react-tooltip";
import {
  extracti18nText,
  geti18nMessage,
  LanguageCode,
  languageCode,
  useLanguage,
} from "@sugar-ai/core";
import Modal from "../common/Modal";
import { allLanguages, i18n } from "@sugar-ai/core";

export const LanguageSelector: FC<{
  klass?: string;
  themeColor: string;
  languagesEnabled: LanguageCode[];
}> = ({ klass, themeColor, languagesEnabled = [] }) => {
  const { language, setLanguage, voice, setVoice, voices } = useLanguage();
  const [languages, setLanguages] = useState<string[]>(languagesEnabled);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>(
    [],
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (language && voices.length > 0 && languagesEnabled.length > 0) {
      const allLanguages: LanguageCode[] = languageCode._def.values;
      // DEV: console.log("[languages] selected", languages);
      const filteredLanguages = allLanguages.filter(
        (l) =>
          languagesEnabled.includes(l.split("-")[0] as LanguageCode) ||
          languagesEnabled.includes(l),
      );
      // DEV: console.log("[languages] filtered", filteredLanguages);
      setLanguages(filteredLanguages);

      DEV: console.log("[languages] voices", voices);
      const fv = shortlistVoices(voices, language);
      DEV: console.log("[languages] filtered voices", fv);

      setFilteredVoices(fv);
    }
  }, [language, voices, languagesEnabled]);

  const handleLanguageChange = (lang: LanguageCode) => {
    setLanguage(lang);
  };

  const handleVoiceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find((v) => v.name === e.target.value);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  };

  const shortlistVoices = (
    voices: SpeechSynthesisVoice[],
    language: LanguageCode,
  ) => {
    const [shortLang, country] = language.split("-");
    let filteredVoices: SpeechSynthesisVoice[] = [];
    DEV: console.log("[languages] shortLang", shortLang);
    DEV: console.log("[languages] country", country);

    if (!country) {
      filteredVoices = voices.filter((v) => {
        const l = toVoiceLang(v).split("-")[0];
        // DEV: console.log("[languages] v.lang", v.lang);
        return l == shortLang;
      });
    } else {
      filteredVoices = voices.filter(
        (v) => v.lang.toLowerCase() === language.toLowerCase(),
      );

      // exceptions in case of Indian Languages
      if (filteredVoices.length === 0 && country === "IN") {
        filteredVoices = voices.filter(
          (v) => v.lang.split("-")[1] === country && v.name === "Google हिन्दी",
        );
      }
    }

    // Use a Map to ensure uniqueness by 'lang' property
    const uniqueVoicesMap = new Map();
    filteredVoices.forEach((voice) => {
      uniqueVoicesMap.set(voice.name, voice);
    });

    return Array.from(uniqueVoicesMap.values());
  };

  return (
    <div
      className={`${klass ?? ""} bg-gray-200 dark:bg-gray-700 shadow-md p-2 rounded-lg min-w-[300px] sm:min-w-[300px]`}
    >
      <div className="mb-2 flex justify-around">
        <MdLanguage
          size={28}
          data-tip="Change Language and Voice Settings"
          className="text-gray-500 dark:text-gray-500"
          onClick={() => setIsModalOpen(true)}
        />
        {languages.slice(0, 2).map((lang) => (
          <button
            style={{
              backgroundColor: language === lang ? themeColor : undefined,
            }}
            key={lang}
            onClick={() => handleLanguageChange(lang as LanguageCode)}
            className={`px-1 py-1 mx-1 rounded-lg ${
              language === lang
                ? "text-white"
                : "bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
            }`}
          >
            {toHumanLang(lang)}
          </button>
        ))}
        <FaCaretDown
          size={28}
          data-tip="Change Language and Voice Settings"
          className="text-gray-500 dark:text-gray-500"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      <div
        className="flex items-center justify-center text-gray-800 dark:text-gray-200 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="ml-2 flex flex-col items-center space-x-3">
          <p className="text-sm font-medium text-center">
            Lang: {allLanguages[language]} - {language}
          </p>
          <p className="text-sm font-medium text-center">
            Voice: {voice?.name} - {voice?.lang}
          </p>
        </div>
        <ReactTooltip id="lang-tooltip" place="top" />
      </div>

      <Modal
        klass="bg-gray-200 dark:bg-gray-700"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-4">
          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
              {i18n("selectLanguage", language)}
            </p>
            <select
              value={language}
              onChange={(e) =>
                handleLanguageChange(e.target.value as LanguageCode)
              }
              className="mt-2 p-2 border rounded-lg w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {allLanguages[lang]} - {lang}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
              {i18n("selectVoice", language)}
            </p>
            <select
              value={voice?.name || ""}
              onChange={handleVoiceChange}
              className="mt-2 p-2 border rounded-lg w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filteredVoices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} - {v.lang}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LanguageSelector;

function toHumanLang(lang: string) {
  const langStr = allLanguages[lang];
  const langsplits = langStr.split("|");
  let langStrShort = langsplits[1] || langsplits[0];

  return langStrShort;
}

function toVoiceLang(voice: SpeechSynthesisVoice): string {
  return voice.lang.replace("_", "-");
}
