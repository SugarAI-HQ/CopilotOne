import React, { useEffect, useState } from "react";
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
  getBrowserAndOSDetails,
  QuestionAnswer,
} from "@sugar-ai/core";
import "~/react/styles/form.css";
import { useLanguage } from "@sugar-ai/core";

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
  const { language, voice } = useLanguage();
  const initialStep = parseInt(getQueryParams("step") || "0");
  const currentFormConfig = { ...FormConfigDefaults, ...formConfig };
  // const [formId, setFormId] = useState<string | null>(null);
  const [step, setStep] = useState<number>(initialStep);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [metadata, setMetadata] = useState<Object>({});

  const [submissionId, setSubmissionId] = useState<string | null>(null);

  const { apiClient, config } = useCopilot();

  const handleOnboardingComplete = () => {
    setStep((step) => step + 1);
  };

  const handleQuestionComplete = async (
    submissionId: string,
    question: Question,
    answer: QuestionAnswer | null,
  ) => {
    // 3. Submit answers for question
    if (answer) {
      await submitAnswer(
        formConfig.id as string,
        submissionId as string,
        question,
        answer,
      );

      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);
    }

    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  async function init(formId) {
    // 1. load form with questions
    // TODO : load form with questions
    const form = getForm(formId);

    // 2. Create submission when user click start
    const submissionId = await createSubmission(formConfig.id);
    // setSubmissionId(submissionId);

    // 3. Submit answers on each successful submission
    // const submitted = await submitAnswer(
    //   formId,
    //   submissionId as string,
    //   questions[1],
    //   {
    //     recording: null,
    //     rawAnswer: "test",
    //     evaluatedAnswer: "demo",
    //   },
    // );
  }

  useEffect(() => {
    if (formConfig.id && formConfig.id != "") {
      init(formConfig.id);
    }
  }, [formConfig]);

  // useEffect(() => {
  //   const m = getMetadata(language, voice, formConfig);
  //   setMetadata(m);
  // }, [formConfig, language, voice]);

  const welcomeMessage = geti18nMessage("welcome", translations);
  const postSubmissionMessage = geti18nMessage("postSubmission", translations);

  const getForm = async function (formId): Promise<any | null> {
    // TODO: Implement this
    return null;
  };

  const createSubmission = async function (formId): Promise<string | null> {
    try {
      const { submissionId: submissionId } =
        (await apiClient.voiceForm.formSubmissionCreateSubmission(formId, {
          clientUserId: config?.clientUserId,
          metadata: getMetadata(language, voice, formConfig),
        })) as SugarAiApi.FormSubmissionCreateSubmissionResponse;

      console.log(`Submission created successfully ${submissionId}`);
      return submissionId;
    } catch (error) {
      console.error("Error creating submission:", error);
      debugger;
      return null;
    }
  };

  const submitAnswer = async function (
    formId: string,
    submissionId: string,
    question: Question,
    answer: QuestionAnswer,
  ) {
    if (!formId) {
      throw new Error("Form Id is not set");
    }
    if (!submissionId) {
      throw new Error("Submission ID is not set");
    }

    try {
      const { id } = (await apiClient.voiceForm.formSubmissionSubmitAnswer(
        formId,
        submissionId,
        question.id,
        {
          clientUserId: config?.clientUserId,
          answer: answer,
          metadata: getMetadata(language, voice, formConfig),
        },
      )) as SugarAiApi.FormSubmissionSubmitAnswerResponse;

      console.log(`Answer submitted successfully ${id}`);
    } catch (error) {
      debugger;
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
                onAnswered={async (answer: QuestionAnswer) =>
                  await handleQuestionComplete(
                    submissionId as string,
                    questions[step - 1],
                    answer,
                  )
                }
                onBack={() => setStep(step - 1)}
                onSkip={() =>
                  handleQuestionComplete(
                    submissionId as string,
                    questions[step - 1],
                    null,
                  )
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

// Data to be captured
// raw answer,
// evaluated answer,
// recording upload to s3, and add link reference
//
// browser os details,
// langyage and voice details
//
// geo details

function getMetadata(language, voice, formConfig): any {
  const uaData = getBrowserAndOSDetails();

  return {
    formConfig,
    language,
    voice,
    ...uaData,
  };
}
