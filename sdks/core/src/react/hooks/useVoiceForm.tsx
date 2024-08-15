import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  FormConfig,
  FormConfigDefaults,
  Question,
  QuestionAnswer,
} from "~/schema";
import { useCopilot } from "./useCopilot";
import { SugarAiApi } from "~/api-client";
import { getBrowserAndOSDetails } from "~/helpers";
import { useLanguage } from "./useLanguage";

export interface VoiceFormContextType {
  formConfig: FormConfig;
  submissionId: string | null;
  getForm: (formId: string) => Promise<any>;
  createSubmission: (formId: string) => Promise<any>;
  submitAnswer: (
    formId: string,
    submissionId: string,
    question: Question,
    answer: QuestionAnswer,
  ) => Promise<any>;
}

// Create the context
const VoiceFormContext = createContext<VoiceFormContextType | null>(null);

export const VoiceFormProvider: React.FC<{
  formConfig: FormConfig;
  children: ReactNode;
}> = ({ formConfig, children }) => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const { apiClient, config } = useCopilot();
  const { language, voice } = useLanguage();

  const currentFormConfig = { ...FormConfigDefaults, ...formConfig };

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
    if (formConfig.id && formConfig.id !== "") {
      init(formConfig.id);
    }
  }, [formConfig]);

  const getForm = async (formId: string): Promise<any | null> => {
    // TODO: Implement this
    return null;
  };

  const createSubmission = async (formId: string): Promise<string | null> => {
    try {
      const { submissionId } =
        (await apiClient.voiceForm.formSubmissionCreateSubmission(formId, {
          clientUserId: config?.clientUserId,
          metadata: getMetadata(),
        })) as SugarAiApi.FormSubmissionCreateSubmissionResponse;

      console.log(`Submission created successfully ${submissionId}`);
      setSubmissionId(submissionId);
      return submissionId;
    } catch (error) {
      console.error("Error creating submission:", error);
      return null;
    }
  };

  const submitAnswer = async (
    formId: string,
    submissionId: string,
    question: Question,
    answer: QuestionAnswer,
  ) => {
    if (!formId) throw new Error("Form Id is not set");
    if (!submissionId) throw new Error("Submission ID is not set");

    try {
      const { id } = (await apiClient.voiceForm.formSubmissionSubmitAnswer(
        formId,
        submissionId,
        question.id,
        {
          clientUserId: config?.clientUserId,
          answer,
          metadata: getMetadata(),
        },
      )) as SugarAiApi.FormSubmissionSubmitAnswerResponse;

      console.log(`Answer submitted successfully ${id}`);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  const getMetadata = () => {
    const uaData = getBrowserAndOSDetails();
    return {
      formConfig: currentFormConfig,
      language: language,
      voice: voice,
      ...uaData,
    };
  };

  return (
    <VoiceFormContext.Provider
      value={{
        formConfig,
        submissionId,
        // answers,
        // setAnswers,
        getForm,
        createSubmission,
        submitAnswer,
      }}
    >
      {children}
    </VoiceFormContext.Provider>
  );
};

export const useVoiceForm = () => {
  const context = useContext(VoiceFormContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
