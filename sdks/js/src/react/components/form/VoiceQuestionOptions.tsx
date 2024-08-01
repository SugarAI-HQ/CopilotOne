import React, { useEffect, useState } from "react";
import Streamingi18nText from "../streaming/Streamingi18nText";
import {
  Question,
  Streamingi18nTextRef,
  FormConfig,
  LanguageCode,
  i18nMessage,
} from "@sugar-ai/core";
import { extracti18nText } from "~/react/helpers/voice";

export const VoiceQuestionOptions: React.FC<{
  auto: boolean;
  question: Question;
  language: LanguageCode;
  formConfig: FormConfig;
  optionRefs: React.RefObject<Streamingi18nTextRef>[];
  handleOptionClick: (value: string) => void;
  useRadio: boolean; // Flag to switch between checkbox and radio button
  selected: string[];
}> = ({
  auto,
  question,
  language,
  formConfig,
  optionRefs,
  handleOptionClick,
  useRadio,
  selected = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selected);
  const [streamingStarted, setStreamingStarted] = useState<boolean[]>(
    Array(question.question_params.options?.length).fill(false),
  );

  useEffect(() => {
    handleInputChange(selected[0]);
  }, [selected]);

  const handleInputChange = (value: string) => {
    if (useRadio) {
      setSelectedOptions([value]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(value)
          ? prev.filter((option) => option !== value)
          : [...prev, value],
      );
    }
    handleOptionClick(value);
  };

  const handleStreamingStart = async (index: number) => {
    setStreamingStarted((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  return (
    <ul>
      {question.question_params.options?.map(
        (option: i18nMessage, index: number) => (
          <li
            key={index}
            onClick={(e) =>
              handleInputChange(extracti18nText(option, language))
            }
            className={`flex items-center mb-2 cursor-pointer
              ${
                selectedOptions.includes(extracti18nText(option, language))
                  ? "highlighted-selected"
                  : "bg-transparent"
              } 
              transition-colors duration-200 ease-in-out
              dark:text-gray-200`}
          >
            {streamingStarted[index] && (
              <input
                type={useRadio ? "radio" : "checkbox"}
                id={`option-${question.id}-${index}`}
                name={`option-${question.id}`}
                value={extracti18nText(option, language)}
                onChange={(e) => handleInputChange(e.currentTarget.value)}
                checked={selectedOptions.includes(
                  extracti18nText(option, language),
                )}
                className="mr-2 dark:bg-gray-800 dark:border-gray-600"
              />
            )}
            <label
              htmlFor={`option-${question.id}-${index}`}
              className="flex items-center"
            >
              <Streamingi18nText
                auto={auto}
                ref={optionRefs[index]}
                message={option}
                formConfig={formConfig}
                beforeSpeak={() => handleStreamingStart(index)}
              />
            </label>
          </li>
        ),
      )}
    </ul>
  );
};
