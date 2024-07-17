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
import useSpeechToText from "./useSpeechRecognition";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { Mic, Send, SendHorizonal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

const VoiceQuestion: React.FC<{
  question: Question;
  onComplete: () => void;
  voiceConfig: VoiceConfig;
}> = ({ question, onComplete, voiceConfig }) => {
  // Depdencies
  const { language, voice } = useLanguage();
  const [isQuestionSpoken, setIsQuestionSpoken] = useState<boolean>(false);

  // Create refs for the question and options
  const questionRef: React.RefObject<Streamingi18TextRef> =
    useRef<Streamingi18TextRef>(null);
  const optionRefs: React.RefObject<Streamingi18TextRef>[] = [];

  // Selected option
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Text Question field
  const [input, setInput] = useState<string>("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const onAnswer = (answer: string) => {
    console.log(`Answer: ${answer}`);
    console.log(`transcript : ${transcript}`);
    console.log(`Finaltranscript : ${finalTranscript}`);
    handleResponse(answer);
  };

  const {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
  } = useSpeechToText({
    lang: voiceConfig.lang,
    onCompletion: onAnswer,
    continuous: false,
  });

  if (question?.question_params?.options) {
    question?.question_params?.options.map(() =>
      optionRefs.push(useRef<Streamingi18TextRef>(null))
    );
  }

  const listen = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = () => {
    console.log(`listening stopped: {transcript}`);
    // setInput(transcript.length ? transcript : "");
    stopListening();
  };

  const handleListenClick = () => {
    if (!isListening) {
      listen();
    } else {
      stopVoiceInput();
    }
  };

  const activateTextField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // useEffect(() => {
  //   if (isLoading) {
  //     stopVoiceInput();
  //   }
  // }, [isLoading]);

  const executeWorkflow = async () => {
    // Speak the question
    await renderMCQ(questionRef, optionRefs);
    setIsQuestionSpoken(true);

    // Prepare for getting answer
    listen();
    activateTextField();

    // Evaluate answer
    // Submit if fine
    // onComplete()
  };

  useEffect(() => {
    if (question && language && voice) {
      setTimeout(() => {
        executeWorkflow();
      }, 1000);
    }
  }, [question, language, voice]);

  const startRecognition = () => {
    // if (recognitionRef.current) {
    //   recognitionRef.current.start();
    // }
  };

  const handleResponse = (speechResult: string) => {
    // const option = question.question_params.options?.find(
    //   (opt: string) => opt.toLowerCase() === speechResult.toLowerCase()
    // );
    // if (option) {
    //   setSelectedOption(option);
    //   onComplete();
    // } else {
    //   alert("Option not recognized. Please try again.");
    // }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    // onComplete();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // if (isLoading) return;

      e.preventDefault();
      // handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      onComplete();
    }
  };

  return (
    <div className="p-4">
      <Streamingi18Text
        ref={questionRef}
        message={question.question_text}
        voiceConfig={voiceConfig}
      />
      {/* Text / Number. */}
      {question.question_type == "text" && (
        <div className="flex flex-col items-center">
          <TextareaAutosize
            autoComplete="off"
            value={
              isListening
                ? transcript.length
                  ? transcript
                  : ""
                : finalTranscript
            }
            ref={inputRef}
            onKeyDown={handleKeyPress}
            // onChange={(e) => setInput(e.target.value)}
            name="message"
            disabled={!isQuestionSpoken}
            placeholder={!isListening ? "Enter your prompt here" : "Listening"}
            className=" max-h-24 px-14 bg-accent py-[22px] text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full  rounded-full flex items-center h-16 resize-none overflow-hidden dark:bg-card"
          />

          {/* <input
            type="text"
            className="border-2 border-gray-300 rounded-md w-full"
            ref={inputRef}
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
          /> */}
          {/* <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onComplete}
          >
            Submit
          </button> */}
        </div>
      )}
      {/* Multiple choice questions only. Render the options. */}
      {question.question_type == "multiple_choice" && (
        <ul>
          {question.question_params.options?.map(
            (option: i18Message, index: number) => (
              <li
                key={index}
                className={`p-2 ${
                  selectedOption === option ? "bg-yellow-300" : ""
                }`}
                onClick={(e) => handleOptionClick(e.currentTarget.innerText)}
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
      )}
      {isListening && (
        <span className="text-sm text-muted-foreground">
          Live: {transcript}
        </span>
      )}
      {!isListening && finalTranscript && (
        <span className="text-sm text-muted-foreground">
          Final: {finalTranscript}
        </span>
      )}

      <div className="mic-buttons">
        <button
          className={`mic-button ${isListening ? "listening" : "disabled"}`}
          onClick={handleListenClick}
        >
          {isListening ? (
            // <FaMicrophone className="mic-icon" />
            <Mic className="w-5 h-5 " />
          ) : (
            <FaMicrophoneSlash className="mic-icon" />
          )}
        </button>
        <style jsx>{`
          textarea:focus,
          input:focus {
            background-color: red;
          }
          .mic-buttons {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .mic-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: none;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .mic-button.listening {
            animation: pulse 1s infinite;
          }
          .mic-button.disabled {
            background-color: #6c757d;
          }
          .mic-icon {
            font-size: 24px;
          }
          @keyframes pulse {
            0% {
              box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
            }
            70% {
              box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
            }
            100% {
              box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
            }
          }
        `}</style>
      </div>
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
    debugger;
    await qRef.current.startStreaming();
  }

  // Speak the options
  for (let i = 0; i < optionRefs.length; i++) {
    const optionRef = optionRefs[i];
    if (optionRef.current) {
      optionRef.current.focus();
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
