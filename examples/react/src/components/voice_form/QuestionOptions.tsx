import React, { useEffect, useState } from "react";
import Streamingi18Text from "./Streamingi18Text";
import {
  i18Message,
  LanguageCode,
  Question,
  Streamingi18TextRef,
  VoiceConfig,
} from "@/schema/quizSchema";
import { extracti18Text } from "@/helpers/voice";

export const QuestionOptions: React.FC<{
  question: Question;
  language: LanguageCode;
  voiceConfig: VoiceConfig;
  optionRefs: React.RefObject<Streamingi18TextRef>[];
  handleOptionClick: (value: string) => void;
  useRadio: boolean; // Flag to switch between checkbox and radio button
  selected: string[];
}> = ({
  question,
  language,
  voiceConfig,
  optionRefs,
  handleOptionClick,
  useRadio,
  selected = [],
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(selected);
  const [streamingStarted, setStreamingStarted] = useState<boolean[]>(
    Array(question.question_params.options?.length).fill(false)
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
          : [...prev, value]
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
          (option: i18Message, index: number) => (
            <li
              key={index}
              onClick={(e) =>
                handleInputChange(extracti18Text(option, language))
              }
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
                cursor: "pointer", // Add cursor pointer to indicate clickability
                backgroundColor: selectedOptions.includes(
                  extracti18Text(option, language)
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
                  value={extracti18Text(option, language)}
                  onChange={(e) => handleInputChange(e.currentTarget.value)}
                  checked={selectedOptions.includes(
                    extracti18Text(option, language)
                  )}
                  style={{ marginRight: "10px" }} // Space between input and label
                />
              )}
              <label
                htmlFor={`option-${question.id}-${index}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <Streamingi18Text
                  ref={optionRefs[index]}
                  message={option}
                  voiceConfig={voiceConfig}
                  beforeSpeak={() => handleStreamingStart(index)}
                />
              </label>
            </li>
          )
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
