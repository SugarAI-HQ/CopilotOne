import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import Modal from "../Modal";
import { FaLanguage } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, voice, setVoice, voices } = useLanguage();
  const [languages, setLanguages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const userLanguages = Array.from(navigator.languages || []);
    setLanguages(userLanguages.length > 0 ? userLanguages : ["en"]);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedVoice = voices.find((v) => v.name === e.target.value);
    if (selectedVoice) {
      setVoice(selectedVoice);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredVoices = voices.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery) ||
      v.lang.toLowerCase().includes(searchQuery)
  );

  return (
    <div>
      <div className="relative inline-block ml-auto">
        <FaLanguage
          size={48}
          data-tip="Change Language and Voice Settings"
          onClick={() => setIsModalOpen(true)}
          className="text-blue-500 cursor-pointer text-2xl"
        />
        <ReactTooltip place="top" type="dark" effect="solid" />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-4">
          <p>Current language: {language}</p>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="mt-2 p-1 border rounded w-full"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </div>
        <div className="mb-4">
          <p>Current voice: {voice?.name}</p>
          <input
            type="text"
            placeholder="Search voices..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="mt-2 p-1 border rounded w-full"
          />
          <select
            value={voice?.name || ""}
            onChange={handleVoiceChange}
            className="mt-2 p-1 border rounded w-full"
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
