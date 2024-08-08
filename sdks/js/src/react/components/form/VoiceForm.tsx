import React, { useState } from "react";
import Onboarding from "./Onboarding";
import VoiceQuestion from "./VoiceQuestion";
import Submission from "./Submission";
import {
  Translations,
  geti18nMessage,
  getQueryParams,
  Question,
  FormConfig,
  FormConfigDefaults,
} from "@sugar-ai/core";
import "~/react/styles/form.css";

export const VoiceForm: React.FC<{
  showStartButton: boolean;
  translations: Translations;
  questions: Question[];
  formConfig: FormConfig;
}> = ({
  showStartButton,
  translations,
  questions,
  formConfig = FormConfigDefaults,
}) => {
  const initialStep = parseInt(getQueryParams("step") || "0");
  const currentFormConfig = { ...FormConfigDefaults, ...formConfig };
  const [step, setStep] = useState<number>(initialStep);
  const [answers, setAnswers] = useState<any[]>([]);

  const handleOnboardingComplete = () => {
    setStep((step) => step + 1);
  };

  const handleQuestionComplete = async (answer: any) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    try {
      // Submit each question's answer to the server
      await fetch("/api/submit-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answer),
      });
      console.log("Answer submitted successfully");
    } catch (error) {
      console.error("Error submitting answer:", error);
    }

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const welcomeMessage = geti18nMessage("welcome", translations);
  const postSubmissionMessage = geti18nMessage("postSubmission", translations);

  return (
    <div className="container m-4 mx-auto w-full rounded-lg h-[80dvh] bg-white dark:bg-gray-800 flex items-center justify-center">
      {step === 0 && (
        <Onboarding
          showStartButton={showStartButton}
          onComplete={handleOnboardingComplete}
          welcomeMessage={welcomeMessage}
          formConfig={currentFormConfig}
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
                  handleQuestionComplete({
                    question: questions[step - 1],
                    answer: answer,
                  })
                }
                onBack={() => setStep(step - 1)}
                onSkip={() =>
                  handleQuestionComplete({
                    question: questions[step - 1],
                    answer: "User Answer",
                  })
                }
                formConfig={currentFormConfig}
              />
            ),
        )}
      {step > questions.length && (
        <Submission
          postSubmissionMessage={postSubmissionMessage}
          answers={answers}
          formConfig={currentFormConfig}
        />
      )}
    </div>
  );
};

export default VoiceForm;
