import React, { useEffect, useState } from "react";
import { FaLanguage } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { LanguageCode, languageCode, useLanguage } from "@sugar-ai/core";
import Modal from "../common/Modal";

export const LanguageSelector: React.FC<{
  klass: string;
  languagesEnabled: LanguageCode[];
}> = ({ klass, languagesEnabled = [] }) => {
  const { language, setLanguage, voice, setVoice, voices } = useLanguage();

  const [languages, setLanguages] = useState<string[]>(languagesEnabled);
  const [filteredVoices, setFilteredVoices] = useState<SpeechSynthesisVoice[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // const userLanguages =
    //   languagesEnabled || Array.from(navigator.languages || [language]);

    // Filter all the languages that are supported by the browser
    const allLanguages: LanguageCode[] = languageCode._def.values;
    const filteredLangauges = allLanguages.filter(
      (l) =>
        languagesEnabled.includes(l.split("-")[0] as LanguageCode) ||
        languagesEnabled.includes(l),
    );
    setLanguages(filteredLangauges);

    const fv = shorlistVoices(voices, language);

    setFilteredVoices(fv);
    console.log(
      "FilteredVoices",
      fv.map((l) => `${l.name} ${l.lang}`),
    );

    // const listLangs = userLanguages.length > 0 ? userLanguages :
    // const allLanguages = Array.from(
    //   new Set(userLanguages.concat(languageCode._def.values)),
    // );
    // setLanguages(allLanguages);
  }, [language, voices, languagesEnabled]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
    setSearchQuery(e.target.value as LanguageCode);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find((v) => v.name === e.target.value);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  };

  // const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchQuery(e.target.value.toLowerCase());
  // };

  const shorlistVoices = (voices, language: LanguageCode) => {
    const [shortLang, country] = language.split("-");

    let filteredVoices: SpeechSynthesisVoice[] = [];

    if (!country) {
      filteredVoices = voices.filter((v) => v.lang.split("-")[0] === shortLang);
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
      className={`${klass} bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md`}
    >
      <div className="flex justify-center items-center text-gray-400 dark:text-white-600">
        <span className="p-1">
          Lang: ({language}), Voice: {voice?.name}({voice?.lang})
        </span>
        <span className="mr-2"></span>
        <FaLanguage
          size={32}
          data-tip="Change Language and Voice Settings"
          onClick={() => setIsModalOpen(true)}
          className="text-blue-500 cursor-pointer dark:text-blue-300"
        />
        <ReactTooltip id="lang-tooltip" place="top" />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200">Select language</p>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="mt-2 p-1 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <p className="text-gray-800 dark:text-gray-200">Select voice</p>
          {/* <input
            type="text"
            placeholder="Search voices..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mt-2 p-1 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          /> */}
          <select
            value={voice?.name || ""}
            onChange={handleVoiceChange}
            className="mt-2 p-1 border rounded w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          >
            {filteredVoices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      </Modal>
    </div>
  );
};

export default LanguageSelector;
