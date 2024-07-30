import React, { useEffect, useState } from "react";

import Streamingi18nText from "../streaming/Streamingi18nText";
import {
  Question,
  Streamingi18nTextRef,
  FormConfig,
} from "~/react/schema/form";
import { LanguageCode } from "~/schema";
import { extracti18nText } from "~/helpers";
import { i18nMessage } from "~/react/schema/message";

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
    <>
      <ul>
        {question.question_params.options?.map(
          (option: i18nMessage, index: number) => (
            <li
              key={index}
              onClick={(e) =>
                handleInputChange(extracti18nText(option, language))
              }
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                cursor: "pointer", // Add cursor pointer to indicate clickability
                backgroundColor: selectedOptions.includes(
                  extracti18nText(option, language),
                )
                  ? "#ffff99"
                  : "transparent", // Highlight selected options
              }} // Flex container styles
            >
              {/* Conditionally render checkbox or radio button */}
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
                  style={{ marginRight: "10px" }} // Space between input and label
                />
              )}
              <label
                htmlFor={`option-${question.id}-${index}`}
                style={{ display: "flex", alignItems: "center" }}
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
      {/* <p className="text-md text-gray-600">
          Selected Answer: {JSON.stringify(selected)}
          <br />
          Selected Options: {JSON.stringify(selectedOptions)}
        </p> */}
    </>
  );
};
