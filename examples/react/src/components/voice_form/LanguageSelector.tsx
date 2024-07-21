import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import Modal from "../Modal";
import { FaLanguage } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { LanguageCode } from "@/schema/voiceFormSchema";

const LanguageSelector: React.FC<{}> = ({}) => {
  const { language, setLanguage, voice, setVoice, voices } = useLanguage();

  const [languages, setLanguages] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const userLanguages = Array.from(navigator.languages || []);
    setLanguages(userLanguages.length > 0 ? userLanguages : [language]);
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as LanguageCode);
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
      <div
        className="fixed bottom-0 left-0 w-full flex justify-center items-center p-3 bg-white border-t border-gray-200 shadow-md"
        data-tooltip-id="lang-tooltip"
      >
        <span className="p-3">
          Lang: ({language}), Voice: {voice?.name}({voice?.lang})
        </span>
        <span className="mr-2"></span>
        <FaLanguage
          size={48}
          data-tip="Change Language and Voice Settings"
          onClick={() => setIsModalOpen(true)}
          className="text-blue-500 cursor-pointer text-2xl"
        />
        <ReactTooltip id="lang-tooltip" place="top" />
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
            <option value="es">Español (Spanish)</option>
            <option value="fr">Français (French)</option>
            <option value="de">Deutsch (German)</option>
            <option value="ja">日本語 (Japanese)</option>
            <option value="zh">中文 (Chinese)</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="or">ଓଡ଼ିଆ (Odia)</option>
            <option value="as">অসমীয়া (Assamese)</option>
            <option value="ur">اردو (Urdu)</option>
            <option value="ma">मणिपुरी (Meitei/Manipuri)</option>
            <option value="ks">کٲشُر (Kashmiri)</option>
            <option value="ar">العربية (Arabic)</option>
            <option value="ru">Русский (Russian)</option>
            <option value="pt">Português (Portuguese)</option>
            <option value="it">Italiano (Italian)</option>
            <option value="ko">한국어 (Korean)</option>
            <option value="tr">Türkçe (Turkish)</option>
            <option value="nl">Nederlands (Dutch)</option>
            <option value="sv">Svenska (Swedish)</option>
            <option value="pl">Polski (Polish)</option>
            <option value="da">Dansk (Danish)</option>
            <option value="fi">Suomi (Finnish)</option>
            <option value="no">Norsk (Norwegian)</option>
            <option value="el">Ελληνικά (Greek)</option>
            <option value="he">עברית (Hebrew)</option>
            <option value="cs">Čeština (Czech)</option>
            <option value="hu">Magyar (Hungarian)</option>
            <option value="th">ไทย (Thai)</option>
            <option value="vi">Tiếng Việt (Vietnamese)</option>
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
