import React, { useCallback, useEffect, useState } from "react";
import Onboarding from "./Onboarding";
import VoiceQuestion from "./VoiceQuestion";
import Submission from "./Submission";
import Initializing from "./Initializing";
import root from "window-or-global";

import {
  Question,
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
  showStartButton: boolean;
}> = ({ showStartButton }) => {
  const [messages, setMessages] = useState<FormMessages>({
    welcome: geti18nMessage("welcome", defaultFormTranslations),
    submit: geti18nMessage("submit", defaultFormTranslations),
  });
  renderCount++;
  DEV: console.log("[re-render] VoiceForm", renderCount);

  const {
    formId,
    voiceForm,
    // formConfig,
    submissionId,
    createSubmission,
    submitAnswer,
    completeSubmission,
  } = useVoiceForm();

  const initialStep = parseInt(
    root?.location
      ? new URLSearchParams(root.location.search).get("step") || "0"
      : "0",
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
      if (voiceForm && nextStep > voiceForm?.questions?.length) {
        handleQuestionsComplete();
      }
      return nextStep;
    });
  };

  return (
    <div className="sai-vf-container container">
      {!submissionId && <Initializing></Initializing>}
      {voiceForm && submissionId && (
        <>
          {step === 0 && (
            <Onboarding
              showStartButton={showStartButton}
              onComplete={handleOnboardingComplete}
              voiceForm={voiceForm}
              welcomeMessage={messages.welcome as i18nMessage}
            />
          )}
          {step > 0 &&
            step <= voiceForm?.questions?.length &&
            voiceForm?.questions?.map(
              (question, index) =>
                index === step - 1 && (
                  <VoiceQuestion
                    key={index}
                    voiceForm={voiceForm}
                    question={question}
                    onAnswered={(answer) =>
                      handleQuestionComplete(question, answer)
                    }
                    onBack={() => setStep((prevStep) => prevStep - 1)}
                    onSkip={() => handleQuestionComplete(question, null)}
                  />
                ),
            )}
          {step > voiceForm?.questions?.length && (
            <Submission
              postSubmissionMessage={messages.submit as i18nMessage}
              answers={answers}
              formConfig={voiceForm?.formConfig}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VoiceFormComponent;
