import React, { useEffect, useRef, useState } from "react";
import {
  Question,
  Streamingi18TextRef,
  VoiceConfig,
  i18Message,
} from "@/schema/quizSchema";
import { speakMessageAsync } from "@/helpers/voice";
import { useLanguage } from "./LanguageContext";
import Streamingi18Text from "./Streamingi18Text";
import StreamingText, { StreamingTextRef } from "./StreamingText";

const VoiceQuestion: React.FC<{
  question: Question;
  onComplete: () => void;
  voiceConfig: VoiceConfig;
}> = ({ question, onComplete, voiceConfig }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const questionRef: React.RefObject<Streamingi18TextRef> =
    useRef<Streamingi18TextRef>(null);
  // const optionRefs = useRef<Array<React.RefObject<StreamingTextRef>>>([]);
  const optionRefs: React.RefObject<Streamingi18TextRef>[] = [];
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { language, voice } = useLanguage();

  if (question?.question_params?.options) {
    question?.question_params?.options.map(() =>
      optionRefs.push(useRef<Streamingi18TextRef>(null))
    );
  }

  useEffect(() => {
    if (question && language && voice) {
      setTimeout(() => {
        renderMCQ(questionRef, optionRefs);
      }, 1000);
    }

    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        handleResponse(speechResult);
      };
    }
  }, [question, language, voice]);

  const startRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleResponse = (speechResult: string) => {
    const option = question.question_params.options?.find(
      (opt: string) => opt.toLowerCase() === speechResult
    );
    if (option) {
      setSelectedOption(option);
      onComplete();
    } else {
      alert("Option not recognized. Please try again.");
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    onComplete();
  };

  return (
    <div className="p-4">
      <Streamingi18Text
        ref={questionRef}
        message={question.question_text}
        voiceConfig={voiceConfig}
      />

      <ul>
        {question.question_params.options?.map(
          (option: i18Message, index: number) => (
            <li
              key={index}
              className={`p-2 ${
                selectedOption === option ? "bg-yellow-300" : ""
              }`}
            >
              <Streamingi18Text
                ref={optionRefs[index]}
                message={option}
                voiceConfig={voiceConfig}
              />
            </li>
          )
        )}
      </ul>
      <button
        className="mt-4 p-2 bg-blue-500 text-white"
        onClick={startRecognition}
      >
        Speak Answer
      </button>
    </div>
  );
};

export default VoiceQuestion;

export const renderMCQ = async (
  qRef: React.RefObject<Streamingi18TextRef>,
  optionRefs: React.RefObject<Streamingi18TextRef>[]
): Promise<void> => {
  // Speak the question
  if (qRef.current) {
    await qRef.current.startStreaming();
  }

  // Speak the options
  for (let i = 0; i < optionRefs.length; i++) {
    const optionRef = optionRefs[i];
    if (optionRef.current) {
      await optionRef.current.startStreaming();
    }
  }
};

export const speakMCQ = async (
  question: Question,
  language: string,
  voice: SpeechSynthesisVoice
): Promise<void> => {
  const lang = language.split("-")[0] || "en";

  // Speak the question
  const questionText = question?.question_text?.lang[lang] as string;
  await speakMessageAsync(questionText, language, voice);

  // Speak the options
  const options = question?.question_params?.options as string[];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    await speakMessageAsync(option, language, voice);
  }
};
