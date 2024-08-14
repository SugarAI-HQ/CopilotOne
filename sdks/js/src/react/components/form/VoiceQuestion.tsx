import React, { useEffect, useRef, useState } from "react";
import "~/react/styles/form.css";
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
  Recording,
  QuestionAnswer,
} from "@sugar-ai/core";
import Streamingi18nText from "../streaming/Streamingi18nText";
import VoiceButtonWithStates from "~/react/assistants/components/voice";
import {
  captureVoiceResponseAndEvaluate,
  validateAnswerWithUser,
  SELECTED_QUESTION_TYPES,
} from "~/react/helpers/form";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

export const VoiceQuestion: React.FC<{
  question: Question;
  onAnswered: (voiceAnswer: QuestionAnswer) => Promise<void>;
  onSkip: () => void;
  onBack: () => void;
  formConfig: FormConfig;
}> = ({ question, onAnswered, onSkip, onBack, formConfig }) => {
  // Depdencies
  const { language, voice } = useLanguage();
  const isWorkflowStartedRef = useRef(false);
  const [isQuestionSpoken, setIsQuestionSpoken] = useState<boolean>(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const [voiceAnswer, setVoiceAnswer] = useState<QuestionAnswer | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([]);
  // Create refs for the question and options
  const questionRef: React.RefObject<Streamingi18nTextRef> =
    useRef<Streamingi18nTextRef>(null);
  const optionRefs: React.RefObject<Streamingi18nTextRef>[] = [];

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

    const questionEvaluation = await captureVoiceResponseAndEvaluate(
      question,
      language,
      voice,
      formConfig,
      getUserResponseContinous,
      setIsEvaluating,
      registerAction,
      unregisterAction,
      textToAction,
    );

    const finalAnswer: QuestionAnswer = {
      recording: questionEvaluation.userResponse.recording,
      rawAnswer: questionEvaluation.userResponse.text,
      evaluatedAnswer: questionEvaluation.aiResponse.answer,
      by: "voice",
    };

    // // Recording
    // if (questionEvaluation?.userResponse?.recording) {
    //   setAnswerRecording(questionEvaluation?.userResponse?.recording);
    // }

    if (inputRef && inputRef.current) {
      inputRef.current.value = questionEvaluation.aiResponse.answer;
    }

    // validate Answer
    await validateAnswerWithUser(
      question,
      finalAnswer,
      questionEvaluation.aiResponse.followupResponse as string,
      language,
      voice,
      setVoiceAnswer,
      setSelectedAnswer,
    );

    // Wait
    setIsWaiting(true);
    DEV: console.log("submitting Answer", finalAnswer);
    await Promise.all([
      await onAnswered(finalAnswer as QuestionAnswer),
      await delay(3000),
    ]);

    setIsWaiting(false);
  };

  const handleOptionClick = (values: string[]) => {
    const answer: QuestionAnswer = {
      rawAnswer: values.join(", "),
      evaluatedAnswer: values.join(", "),
      recording: null,
      by: "manual",
    };

    setVoiceAnswer(answer);
    // setSelectedOption(option);
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
    <div className="sai-vq-container">
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
            minRows={5}
            disabled={!isQuestionSpoken}
            onChange={(e) => {
              setVoiceAnswer((va) => {
                let lva: QuestionAnswer = {
                  rawAnswer: va?.rawAnswer, // Use existing 'raw' or the new value
                  evaluatedAnswer: e.target.value, // Use existing 'evaluatedAnswer' or the new value
                  recording: va?.recording || null, // Use existing 'recording' or default to null
                  by: va?.by || "manual", // Use existing 'by' or default to "manual"
                };
                return lva;
              });
            }}
            placeholder={!isListening ? "Enter your answer here" : "Listening"}
            className="sai-vq-text-input"
          />
        </div>
      )}

      {SELECTED_QUESTION_TYPES.includes(question.question_type) && (
        <VoiceQuestionOptions
          auto={false}
          question={question}
          language={language}
          formConfig={formConfig}
          optionRefs={optionRefs}
          handleOptionClick={handleOptionClick}
          useRadio={question.question_type == "single_choice" ? true : false}
          selected={selectedAnswer ? selectedAnswer : []}
        />
      )}

      <div className="sai-vf-actions-container">
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
            {voiceAnswer && voiceAnswer.recording && (
              <a
                href={voiceAnswer.recording?.audioUrl}
                download={voiceAnswer.recording?.audioFile?.name}
              >
                Recording
              </a>
            )}
            {isListening && (
              <span className="counter absolute right-0 text-lg text-gray-800 dark:text-gray-200">
                {(question.validation?.max_length || 120) - transcript.length}
              </span>
            )}
          </div>

          <div className="sai-vf-actions">
            <button onClick={onBack} className="sai-vf-action action-back">
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
                disabled={
                  voiceAnswer == null || voiceAnswer?.evaluatedAnswer == ""
                }
                onClick={() =>
                  voiceAnswer?.evaluatedAnswer != ""
                    ? onAnswered(voiceAnswer as QuestionAnswer)
                    : onSkip()
                }
                className="sai-vf-action action-skip "
              >
                <SkipForward className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => onAnswered(voiceAnswer as QuestionAnswer)}
                className="sai-vf-action action-next"
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
