import React, { useState } from "react";
import Onboarding from "./Onboarding";
import VoiceQuestion from "./VoiceQuestion";
import Submission from "./Submission";
import {
  Translations,
  Question,
  FormConfig,
  useVoiceForm,
  QuestionAnswer,
  geti18nMessage,
} from "@sugar-ai/core";
import "~/react/styles/form.css";

export const VoiceForm: React.FC<{
  showStartButton: boolean;
  translations: Translations;
  questions: Question[];
  formConfig: FormConfig;
}> = ({ showStartButton, translations, questions, formConfig }) => {
  const { submissionId, createSubmission, submitAnswer } = useVoiceForm();
  const initialStep = parseInt(
    new URLSearchParams(window.location.search).get("step") || "0",
  );
  const [step, setStep] = useState<number>(initialStep);

  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);

  const handleOnboardingComplete = async () => {
    const submissionId = await createSubmission(formConfig.id);
    setStep((prevStep) => prevStep + 1);
  };

  const handleQuestionComplete = async (
    question: Question,
    answer: QuestionAnswer | null,
  ) => {
    if (answer) {
      await submitAnswer(
        formConfig.id,
        submissionId as string,
        question,
        answer,
      );
      setAnswers((prevAnswers) => [...prevAnswers, answer]);
    }

    setStep((prevStep) => prevStep + 1);
  };

  const welcomeMessage = geti18nMessage("welcome", translations);
  const postSubmissionMessage = geti18nMessage("postSubmission", translations);

  return (
    <div className="sai-vf-container container">
      {step === 0 && (
        <Onboarding
          showStartButton={showStartButton}
          onComplete={handleOnboardingComplete}
          welcomeMessage={welcomeMessage}
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
          postSubmissionMessage={postSubmissionMessage}
          answers={answers}
          formConfig={formConfig}
        />
      )}
    </div>
  );
};

export default VoiceForm;
