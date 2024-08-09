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
  useCopilot,
  SugarAiApi,
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

  const { apiClient, config } = useCopilot();

  const handleOnboardingComplete = () => {
    setStep((step) => step + 1);
  };

  const handleQuestionComplete = async (answer: any) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const welcomeMessage = geti18nMessage("welcome", translations);
  const postSubmissionMessage = geti18nMessage("postSubmission", translations);

  const createSubmission = async function () {
    try {
      const { submissionId } = (await apiClient.createSubmission({
        formId: currentFormConfig?.id,
        clientUserId: config?.clientUserId,
      })) as SugarAiApi.FormSubmissionCreateSubmissionResponse;

      console.log(`Submission created successfully ${submissionId}`);
    } catch (error) {
      console.error("Error creating submission:", error);
    }
  };

  const submitAnswer = async function (questionId, answer) {
    try {
      const { id } = (await apiClient.submitAnswer({
        formId: currentFormConfig?.id,
        clientUserId: config?.clientUserId,
        questionId: questionId,
        answer: answer,
      })) as SugarAiApi.FormSubmissionSubmitAnswerResponse;

      console.log(`Answer submitteed successfully ${id}`);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  return (
    <div className="sai-vf-container container">
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
