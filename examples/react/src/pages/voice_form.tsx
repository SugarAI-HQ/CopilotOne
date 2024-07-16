import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";

const MessageSchema = z.object({
  mode: z.enum(["manual", "ai"]),
  lang: z.object({
    en: z.string(),
    hi: z.string(),
  }),
  voice: z.boolean(),
  output: z.enum(["none", "answer"]),
});

const QuestionSchema = z.object({
  question_type: z.enum(["multiple_choice", "single_choice", "text", "number"]),
  question_text: MessageSchema,
  question_params: z.object({}).passthrough(),
  validation: z.object({}).passthrough(),
});

type Message = z.infer<typeof MessageSchema>;
type Question = z.infer<typeof QuestionSchema>;

const VoiceInteractiveQuiz: React.FC<{ question: Question }> = ({
  question,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (question.question_text.voice) {
      speakQuestion(question.question_text.lang.en);
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
  }, [question]);

  const speakQuestion = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  const startRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const handleResponse = (speechResult: string) => {
    const option = question.question_params.options.find(
      (opt: string) => opt.toLowerCase() === speechResult
    );
    if (option) {
      setSelectedOption(option);
    } else {
      alert("Option not recognized. Please try again.");
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <div className="p-4">
      <p className="text-lg mb-4">{question.question_text.lang.en}</p>
      <ul>
        {question.question_params.options.map(
          (option: string, index: number) => (
            <li
              key={index}
              className={`p-2 ${
                selectedOption === option ? "bg-yellow-300" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
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

// Example usage
const question: Question = {
  question_type: "multiple_choice",
  question_text: {
    mode: "manual",
    lang: {
      en: "What is the capital of France?",
      hi: "फ्रांस की राजधानी क्या है?",
    },
    voice: true,
    output: "none",
  },
  question_params: {
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
  validation: {},
};

const App = () => (
  <div className="container mx-auto p-4">
    <VoiceInteractiveQuiz question={question} />
  </div>
);

export default App;
