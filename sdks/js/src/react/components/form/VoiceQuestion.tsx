import React, { useEffect, useRef, useState } from "react";
import "~/react/styles/form.css"; // Adjust the path according to your project structure
// import isMobilePhone from "validator/es/lib/isMobilePhone";
import TextareaAutosize from "react-textarea-autosize";
import { VoiceQuestionOptions } from "./VoiceQuestionOptions";
import {
  Question,
  Streamingi18nTextRef,
  FormConfig,
  useSpeechToText,
  useCopilot,
  LanguageCode,
  delay,
  useLanguage,
} from "@sugar-ai/core";
import Streamingi18nText from "../streaming/Streamingi18nText";
import VoiceButtonWithStates from "~/react/assistants/components/voice";
import {
  captureUserResponse,
  validateAnswerWithUser,
} from "~/react/helpers/form";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

export const VoiceQuestion: React.FC<{
  question: Question;
  onAnswered: (answer: string) => void;
  onSkip: () => void;
  onBack: () => void;
  formConfig: FormConfig;
}> = ({ question, onAnswered, onSkip, onBack, formConfig }) => {
  // Depdencies
  const { language, voice } = useLanguage();
  const isWorkflowStartedRef = useRef(false);
  const [isQuestionSpoken, setIsQuestionSpoken] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const [answer, setAnswer] = useState<string | null>(null);

  // Create refs for the question and options
  const questionRef: React.RefObject<Streamingi18nTextRef> =
    useRef<Streamingi18nTextRef>(null);
  const optionRefs: React.RefObject<Streamingi18nTextRef>[] = [];

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
    isMicEnabled,
    transcript,
    finalTranscript,
    stopListening,
    startListeningContinous,
    getUserResponseContinous,
    getUserResponseAutoBreak,

    isSpeaking,
    speaki18nMessageAsync,
    speakMessageAsync,
    stopSpeaking,
  } = useSpeechToText({
    // onListeningStop: onListeningStop,
    continuous: false,
  });

  useEffect(() => {
    console.log(`isMicEnabled: ${isMicEnabled}`);
  }, [isMicEnabled]);

  const { config, registerAction, unregisterAction, textToAction } =
    useCopilot();

  if (question?.question_params?.options) {
    question?.question_params?.options.map(() =>
      optionRefs.push(useRef<Streamingi18nTextRef>(null)),
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

  // const handleListenClick = () => {
  //   if (!isListening) {
  //     listen();
  //   } else {
  //     stopVoiceInput();
  //   }
  // };

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

    await delay(300);

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

    const { questionAnswer, followupResponse } = await captureUserResponse(
      question,
      language,
      voice,
      formConfig,
      getUserResponseContinous,
      registerAction,
      unregisterAction,
      textToAction,
    );

    if (inputRef && inputRef.current) {
      inputRef.current.value = questionAnswer;
    }

    // validate Answer
    await validateAnswerWithUser(
      question,
      questionAnswer,
      followupResponse,
      language,
      setAnswer,
    );

    // Wait
    setIsWaiting(true);
    await delay(3000);
    setIsWaiting(false);

    // Submit if fine
    onAnswered(questionAnswer);
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

  const renderMCQ = async (
    qRef: React.RefObject<Streamingi18nTextRef>,
    optionRefs: React.RefObject<Streamingi18nTextRef>[],
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

  const startListening = () => {
    console.log("Start listening");
  };
  const temp = () => {
    console.log("Start listening");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-3xl mx-auto w-full">
      <Streamingi18nText
        ref={questionRef}
        auto={false}
        message={question.question_text}
        formConfig={formConfig}
        klasses={"font-medium text-3xl mb-4 text-gray-900 dark:text-white"}
      />

      {["text", "number"].includes(question.question_type) && (
        <div className="flex flex-col items-center mt-2">
          <TextareaAutosize
            autoComplete="off"
            ref={inputRef}
            name="message"
            disabled={!isQuestionSpoken}
            placeholder={!isListening ? "Enter your answer here" : "Listening"}
            className="rounded-lg border border-gray-500 max-h-24 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-sm placeholder-gray-500 dark:placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-50 w-full flex items-center h-16 resize-none overflow-hidden focus:ring focus:ring-grau-300 focus:border-gray-500"
          />
        </div>
      )}

      {question.question_type === "multiple_choice" && (
        <VoiceQuestionOptions
          auto={false}
          question={question}
          language={language}
          formConfig={formConfig}
          optionRefs={optionRefs}
          handleOptionClick={handleOptionClick}
          useRadio={true}
          selected={answer ? [answer] : []}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 p-2 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-2">
          <div className="transcript-container w-full flex items-center px-2 relative">
            <p className="transcript text-gray-900 dark:text-white mb-2 border-b border-gray-300 dark:border-gray-700 mx-auto">
              {/* <p>T: {transcript}</p>
              <p>FT: {finalTranscript}</p> */}
              {isWaiting
                ? "Loading next questions"
                : isListening
                  ? transcript
                  : finalTranscript}
            </p>
            {isListening && (
              <span className="counter absolute right-0 text-lg text-gray-800 dark:text-gray-200">
                {question.validation.max_length - transcript.length}
              </span>
            )}
          </div>

          <div className="flex justify-between items-center w-full max-w-3xl mx-auto pb-4 space-x-2">
            <button
              onClick={onBack}
              className="p-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded-lg shadow-md hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <VoiceButtonWithStates
              currentStyle={{ voiceButton: formConfig.voiceButton }}
              voiceButtonStyle={{}}
              startListening={startListening}
              buttonId={"voice-form"}
              ispermissiongranted={true}
              isprocessing={isEvaluating}
              iswaiting={isWaiting}
              islistening={isListening}
              isSpeaking={isSpeaking}
              stopSpeaking={stopSpeaking}
            />
            {!isWaiting ? (
              <button
                onClick={onSkip}
                className="p-2 dark:text-white rounded-lg shadow-md hover:bg-gray-600 dark:hover:bg-grau-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onAnswered(answer as string)}
                className="p-2 bg-green-500 dark:bg-green-600 dark:text-white rounded-lg shadow-md hover:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceQuestion;
