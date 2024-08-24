import React, { useCallback, useEffect, useState } from "react";
import Onboarding from "./Onboarding";
import VoiceQuestion from "./VoiceQuestion";
import Submission from "./Submission";
import Initializing from "./Initializing";
import {
  Translations,
  Question,
  FormConfig,
  useVoiceForm,
  QuestionAnswer,
  geti18nMessage,
  VoiceForm,
  FormMessages,
  defaultFormTranslations,
  i18nMessage,
} from "@sugar-ai/core";
import "~/react/styles/form.css";
import Streamingi18nText from "../streaming/Streamingi18nText";

let renderCount = 0;

export const VoiceFormComponent: React.FC<{
  voiceForm: VoiceForm;
  showStartButton: boolean;
  questions: Question[];
}> = ({ voiceForm, showStartButton, questions }) => {
  const [messages, setMessages] = useState<FormMessages>({
    welcome: geti18nMessage("welcome", defaultFormTranslations),
    submit: geti18nMessage("submit", defaultFormTranslations),
  });
  renderCount++;
  console.log("[re-render] VoiceForm", renderCount);

  const {
    formId,
    formConfig,
    submissionId,
    createSubmission,
    submitAnswer,
    completeSubmission,
  } = useVoiceForm();
  const initialStep = parseInt(
    new URLSearchParams(window.location.search).get("step") || "0",
  );
  const [step, setStep] = useState<number>(initialStep);

  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  useEffect(() => {
    handleOnboardingComplete(false);
  }, []);

  useEffect(() => {
    if (voiceForm) {
      const ms: FormMessages = {
        welcome:
          voiceForm.messages?.welcome ||
          geti18nMessage("welcome", defaultFormTranslations),
        submit:
          voiceForm.messages?.submit ||
          geti18nMessage("submit", defaultFormTranslations),
      };

      setMessages(ms);
      DEV: console.log("loaded voice Form");
    }
  }, [voiceForm]);

  const handleOnboardingComplete = useCallback(
    async (isOnboardingComplete: boolean = true) => {
      if (!submissionId) {
        await createSubmission(formId);
      }

      isOnboardingComplete && setStep((prevStep) => prevStep + 1);
    },
    [],
  );

  const handleQuestionsComplete = async () => {
    const resp = await completeSubmission(formId, submissionId as string);
    // setStep((prevStep) => prevStep + 1);
  };

  const handleQuestionComplete = async (
    question: Question,
    answer: QuestionAnswer | null,
  ) => {
    // Check if the answer is not null before submitting
    if (answer) {
      await submitAnswer(
        formId,
        // submissionId as string,
        question,
        answer,
      );
      setAnswers((prevAnswers) => [...prevAnswers, answer]);
    }

    setStep((prevStep) => {
      const nextStep = prevStep + 1;

      // If we're at the last question, complete the submission
      if (nextStep > questions.length) {
        handleQuestionsComplete();
      }
      return nextStep;
    });
  };

  return (
    <div className="sai-vf-container container">
      {!submissionId && <Initializing></Initializing>}
      {submissionId && (
        <>
          {step === 0 && (
            <Onboarding
              showStartButton={showStartButton}
              onComplete={handleOnboardingComplete}
              welcomeMessage={messages.welcome as i18nMessage}
              formConfig={formConfig}
            />
          )}
          {step > 0 &&
            step <= questions.length &&
            questions.map(
              (question, index) =>
                index === step - 1 && (
                  <VoiceQuestion
                    key={index}
                    question={question}
                    onAnswered={(answer) =>
                      handleQuestionComplete(question, answer)
                    }
                    onBack={() => setStep((prevStep) => prevStep - 1)}
                    onSkip={() => handleQuestionComplete(question, null)}
                    formConfig={formConfig}
                  />
                ),
            )}
          {step > questions.length && (
            <Submission
              postSubmissionMessage={messages.submit as i18nMessage}
              answers={answers}
              formConfig={formConfig}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VoiceFormComponent;
