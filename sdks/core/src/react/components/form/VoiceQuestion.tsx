import React, { useEffect, useRef, useState } from "react";
import "~/react/styles/form.css"; // Adjust the path according to your project structure

import {
  extracti18Text,
  speakMessageAsync,
  speaki18kMessageAsync,
} from "~/helpers/voice";

import { FaMicrophoneSlash } from "react-icons/fa";
import { AudioLines, Hourglass, Loader, Mic } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { QuestionOptions } from "./QuestionOptions";
import {
  EvaluationResponse,
  Question,
  Streamingi18TextRef,
  VoiceConfig,
} from "~/react/schema/form";
import { useLanguage } from "..";
import useSpeechToText from "~/react/hooks/useSpeechRecognition";
import { useCopilot } from "~/react";
import {
  ActionRegistrationType,
  EmbeddingScopeWithUserType,
  LanguageCode,
} from "~/schema";
import Streamingi18Text from "../streaming/Streamingi18Text";
import { i18Message } from "~/react/schema/message";
import { delay } from "~/helpers";

export const VoiceQuestion: React.FC<{
  question: Question;
  onAnswered: (answer: string) => void;
  onSkip: () => void;
  voiceConfig: VoiceConfig;
}> = ({ question, onAnswered, onSkip, voiceConfig }) => {
  // Depdencies
  const { language, voice } = useLanguage();
  const isWorkflowStartedRef = useRef(false);
  const [isQuestionSpoken, setIsQuestionSpoken] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const [answer, setAnswer] = useState<string | null>(null);

  // Create refs for the question and options
  const questionRef: React.RefObject<Streamingi18TextRef> =
    useRef<Streamingi18TextRef>(null);
  const optionRefs: React.RefObject<Streamingi18TextRef>[] = [];

  // Selected option
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Text Question field
  const [input, setInput] = useState<string>("");
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // const [formState, setFormState] = useState<VoiceFormStates>("none");

  const onListeningStop = (answer: string) => {
    unhighlightTextField();

    console.log(`Answer: ${answer}`);
    // console.log(`Finaltranscript : ${finalTranscript}`);
  };

  const {
    isListening,
    transcript,
    finalTranscript,
    stopListening,
    getUserResponse,
  } = useSpeechToText({
    // onListeningStop: onListeningStop,
    continuous: false,
  });

  const { config, registerAction, unregisterAction, textToAction } =
    useCopilot();

  if (question?.question_params?.options) {
    question?.question_params?.options.map(() =>
      optionRefs.push(useRef<Streamingi18TextRef>(null)),
    );
  }

  const listen = async () => {
    // isListening ? stopVoiceInput() : startListening();
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

  useEffect(() => {
    // Ensure the only the latest values of language and voice are used.

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      console.log(`${language} ${voice?.name}`);
      start(question, language, voice as SpeechSynthesisVoice);
    }, 300); // Adjust the delay as needed

    // Clean up the timeout if the component unmounts or dependencies change
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [question, language, voice]);

  const start = async (
    question: Question,
    language: LanguageCode,
    voice: SpeechSynthesisVoice,
  ) => {
    if (!question || !language || !voice) {
      return;
    }

    await delay(1000);

    if (isWorkflowStartedRef.current) {
      return;
    }

    isWorkflowStartedRef.current = true;

    // Speak the question
    await renderMCQ(questionRef, optionRefs);

    setIsQuestionSpoken(true);

    setIsQuestionSpoken((v) => {
      // Prepare for getting answer
      highlightTextField();

      return v;
    });

    // Start listening
    let userResponse: string = "";
    let fq: string | null = "";
    let attempts = 0;
    let questionAnswer = "";

    // Loop until we get a valid answer or number of attempts exceeded
    while (fq !== null && attempts < 2) {
      if (fq !== "") {
        // Ask the followup question to the user
        await speakMessageAsync(fq, language, voice as SpeechSynthesisVoice);
      }

      // Get user response
      userResponse = await getUserResponse({ nudgeAfterAttempts: 1 });

      // Fill answer in text field in case of text fields
      if (inputRef && inputRef.current) {
        inputRef.current.value = userResponse;
      }

      // Evaluation
      const { answer, followupQuestion } = await evaluate(
        question,
        userResponse,
        language,
      );

      fq = followupQuestion;
      questionAnswer = answer;
      attempts = attempts + 1;

      // validateAnswer
      await validateAnswer(question, answer);

      // Submit if fine
      onAnswered(questionAnswer);
    }
  };

  const validateAnswer = async (question: Question, answer: string) => {
    // Show final evaluated answer
    if (question.question_type == "multiple_choice") {
      // setAnswer("15-30 days");
      setAnswer(answer);
      await speaki18kMessageAsync(
        selectedAnswer,
        language,
        voice as SpeechSynthesisVoice,
      );
      await speakMessageAsync(answer, language, voice as SpeechSynthesisVoice);
      await delay(3000);
    } else {
      await speaki18kMessageAsync(
        selectedAnswer,
        language,
        voice as SpeechSynthesisVoice,
      );
      await speakMessageAsync(answer, language, voice as SpeechSynthesisVoice);

      // Wait
      setIsWaiting(true);
      await delay(3000);
      setIsWaiting(false);
    }
  };

  const startRecognition = () => {
    // if (recognitionRef.current) {
    //   recognitionRef.current.start();
    // }
  };

  const evaluate = async (
    question: Question,
    userResponse: string,
    language: LanguageCode,
  ): Promise<EvaluationResponse> => {
    setIsEvaluating(true);

    const promptTemplate = process.env
      .NEXT_PUBLIC_FORM_EVALUATION_PROMPT as string;
    console.log(question);
    let options: string[] = [];

    const pvs: any = {
      "@language": language,
      "@question_type": question.question_type,
      "@question": extracti18Text(question.question_text, language),
    };

    let action: ActionRegistrationType = {
      name: "evaluateMcqResponse",
      description:
        "Evaluate the user's response to a multiple-choice question and return the most likely option.",
      parameters: [
        {
          name: "answer",
          type: "string",
          description: "Answer for the question",
          required: true,
        },
        {
          name: "isQuestionAnswered",
          type: "string",
          enum: ["fully", "partially", "no"],
          description: "Is question answered by the user ?",
          required: true,
        },
        {
          name: "followupQuestion",
          type: "string",
          description:
            "followup Question to be asked back to the user, this is required when isQuestionAnswered is partially or no",
          required: true,
        },
      ],
    };

    // Incase of mcq type of questions
    if (question.question_params?.options) {
      options = question.question_params?.options?.map((option) =>
        extracti18Text(option, language),
      ) as string[];

      pvs["@options"] = options.join(",");
      if (options?.length > 0) {
        action.parameters[0].enum = options;
      }
    }
    function evaluateMcqResponse(
      answer: string,
      isQuestionAnswered: string,
      followupQuestion: string,
    ) {
      console.log(
        `answer: ${answer}, ${isQuestionAnswered}, ${followupQuestion}`,
      );

      if (isQuestionAnswered === "fully") {
        return { answer, followupQuestion: null };
      }

      if (isQuestionAnswered !== "fully" && followupQuestion) {
        return { answer, followupQuestion };
      }

      throw new Error(
        "answer is not clear, and followup question is not provided",
      );
    }

    registerAction("evaluateMcqResponse", action, evaluateMcqResponse);

    // @ts-ignore
    const ttaResponse: TextToActionResponse = await textToAction(
      promptTemplate,
      userResponse,
      pvs,
      {
        scope1: "",
        scope2: "",
      } as EmbeddingScopeWithUserType,
      false,
      0,
    );
    unregisterAction("evaluateMcqResponse");

    setIsEvaluating(false);
    // e
    // if (!ttaResponse || ttaResponse.actionOutput) {
    //   throw new Error("Failed to get a valid response from textToAction");
    // }

    return ttaResponse.actionOutput;
  };

  const evaluateResponse = (userResponse: string) => {
    if (question.question_type === "text") {
      onAnswered(userResponse);
    } else if (question.question_type === "multiple_choice") {
      // 1. Functioncalling to get the best match
      // 2. Send question, options and user response to AI

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
      debugger;
      // if (isLoading) return;

      e.preventDefault();
      // handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      // onAnswered(e.target?.value as string);
    }
  };

  const renderMCQ = async (
    qRef: React.RefObject<Streamingi18TextRef>,
    optionRefs: React.RefObject<Streamingi18TextRef>[],
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

  const selectedAnswer: i18Message = {
    mode: "manual",
    lang: {
      en: "Selected Answer is",
      hi: "चयनित उत्तर है",
    },
    voice: true,
    output: "none",
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
            // value={
            //   isListening
            //     ? transcript.length
            //       ? transcript
            //       : ""
            //     : finalTranscript
            // }
            ref={inputRef}
            // onKeyDown={handleKeyPress}
            // onChange={(e) => setInput(e.target.value)}
            name="message"
            disabled={!isQuestionSpoken}
            placeholder={!isListening ? "Enter your answer here" : "Listening"}
            className="rounded border-5 border-[#007bff] max-h-24 px-14 bg-accent py-[22px] text-sm placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 w-full flex items-center h-16 resize-none overflow-hidden dark:bg-card"
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
        <QuestionOptions
          question={question}
          language={language}
          voiceConfig={voiceConfig}
          optionRefs={optionRefs}
          handleOptionClick={handleOptionClick}
          useRadio={true}
          selected={answer ? [answer] : []}
        />
      )}
      {isQuestionSpoken && (
        <div className="space-y-4 p-4 m-4">
          {isListening && (
            <div className="flex justify-center items-center h-full">
              <p className="text-lg text-gray-600">{transcript}</p>
            </div>
          )}
          {/* {!isListening && (
            <div className="flex justify-center items-center h-full">
              <span className="text-sm text-gray-800">{finalTranscript}</span>
            </div>
          )} */}

          <div className="flex justify-center mic-buttons">
            {/* <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
            Centered Button
          </button> */}

            {/* <div className="voice-form__controls">
              <button
                className="mic-button ${formState} voice-form__control-button"
                onClick={handleListenClick}
                disabled={
                  formState === "evaluating" || formState === "speaking"
                }
              >
                {formState === "listening" ? (
                  <Mic />
                ) : formState === "evaluating" ? (
                  <Loader />
                ) : formState === "speaking" ? (
                  <AudioLines />
                ) : formState === "waiting" ? (
                  <Hourglass />
                ) : (
                  <FaMicrophoneSlash className="mic-icon" />
                )}
              </button>

              <button
                className="voice-form__control-button"
                onClick={onSkip}
                disabled={
                  formState === "listening" || formState === "evaluating"
                }
              >
                Skip
              </button>
            </div> */}

            <button
              className={`mic-button  ${
                isListening
                  ? "listening"
                  : isEvaluating
                    ? "evaluating"
                    : isWaiting
                      ? "waiting"
                      : "disabled"
              }`}
              onClick={handleListenClick}
            >
              {isListening ? (
                // <FaMicrophone className="mic-icon" />
                <Mic />
              ) : isEvaluating ? (
                <Loader />
              ) : isWaiting ? (
                <Hourglass />
              ) : (
                <FaMicrophoneSlash className="mic-icon" />
              )}
            </button>

            <button onClick={onSkip}>Skip</button>

            {/* <style jsx>{`
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
              .mic-button.evaluating,
              .mic-button.waiting {
                border: 5px solid #f3f3f3;
                -webkit-animation: spin 1s linear infinite;
                animation: spin 2s linear infinite;
                border-top: 5px solid #3498db;
                border-radius: 50%;
                width: 58px;
                height: 58px;
              }
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
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
            `}</style> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceQuestion;

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
