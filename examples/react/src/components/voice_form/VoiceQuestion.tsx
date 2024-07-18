import React, { useEffect, useRef, useState } from "react";
import {
  LanguageCode,
  Question,
  Streamingi18TextRef,
  VoiceConfig,
  i18Message,
} from "@/schema/quizSchema";
import { speakMessageAsync } from "@/helpers/voice";
import { useLanguage } from "./LanguageContext";
import Streamingi18Text from "./Streamingi18Text";
import useSpeechToText from "./useSpeechRecognition";
import { FaMicrophoneSlash } from "react-icons/fa";
import { Mic, Send, SendHorizonal } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

const VoiceQuestion: React.FC<{
  question: Question;
  onAnswered: (answer: string) => void;
  onSkip: () => void;
  voiceConfig: VoiceConfig;
}> = ({ question, onAnswered, onSkip, voiceConfig }) => {
  // Depdencies
  const { language, voice } = useLanguage();
  const isWorkflowStartedRef = useRef(false);
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

  const onListeningStop = (answer: string) => {
    unhighlightTextField();

    console.log(`Answer: ${answer}`);
    // console.log(`Finaltranscript : ${finalTranscript}`);

    setTimeout(() => {
      onAnswered(answer);
    }, 2000);
  };

  const {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
  } = useSpeechToText({
    onListeningStop: onListeningStop,
    continuous: false,
  });

  if (question?.question_params?.options) {
    question?.question_params?.options.map(() =>
      optionRefs.push(useRef<Streamingi18TextRef>(null))
    );
  }

  const listen = async () => {
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

  const highlightTextField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.classList.add("highlight");
    }
  };

  const unhighlightTextField = () => {
    if (inputRef.current) {
      inputRef.current.classList.remove("highlight");
    }
  };

  // useEffect(() => {
  //   if (isLoading) {
  //     stopVoiceInput();
  //   }
  // }, [isLoading]);

  const executeWorkflow = async () => {
    if (isWorkflowStartedRef.current) {
      return;
    }

    isWorkflowStartedRef.current = true;

    // Speak the question
    await renderMCQ(questionRef, optionRefs);

    setIsQuestionSpoken(true);

    // Prepare for getting answer
    highlightTextField();
    listen();

    // Evaluate answer
    // Submit if fine
    // onAnswered()
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

  const evaluateResponse = (userResponse: string) => {
    if (question.question_type === "text") {
      onAnswered(userResponse);
    } else if (question.question_type === "multiple_choice") {
      onAnswered(userResponse);
      // evaluateMCQResponse(userResponse);
      // const option = question.question_params.options?.find(
      //   (opt: string) => opt.toLowerCase() === userResponse.toLowerCase()
      // );
      // if (option) {
      //   setSelectedOption(option);
      //   onAnswered(userResponse);
      // } else {
      //   alert("Option not recognized. Please try again.");
      // }
    }
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    // onAnswered();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // if (isLoading) return;

      e.preventDefault();
      // handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      // onAnswered(e.target?.value as string);
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
            onClick={onAnswered}
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
                // className={`p-2 ${
                //   selectedOption === option?.lang[language]
                //     ? "bg-yellow-300"
                //     : ""
                // }`}
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
      <div className="space-y-4 p-4 m-4">
        {isListening && (
          <p className="text-md text-gray-600">Speak Answer: {transcript}</p>
        )}
        {!isListening && (
          <span className="text-sm text-gray-600">
            Final Answer : {finalTranscript}
          </span>
        )}

        <div className="flex justify-center mic-buttons">
          {/* <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
            Centered Button
          </button> */}

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

          <button onClick={onSkip}>Skip</button>

          <style jsx>{`
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
    // qRef.current.focusElement();
    await qRef.current.startStreaming();
  }

  // Speak the options
  for (let i = 0; i < optionRefs.length; i++) {
    const optionRef = optionRefs[i];
    if (optionRef.current) {
      // optionRef.current.focusElement();
      await optionRef.current.startStreaming();
    }
  }
};

// export const speakMCQ = async (
//   question: Question,
//   language: string,
//   voice: SpeechSynthesisVoice
// ): Promise<void> => {
//   const lang: LanguageCode = (language.split("-")[0] || "en") as LanguageCode;

//   // Speak the question
//   const questionText = question?.question_text?.lang[lang] as string;
//   await speakMessageAsync(questionText, language, voice);

//   // Speak the options
//   const options = question?.question_params?.options as i18Message[];
//   for (let i = 0; i < options.length; i++) {
//     const option = options[i];
//     await speakMessageAsync(option, language, voice);
//   }
// };
