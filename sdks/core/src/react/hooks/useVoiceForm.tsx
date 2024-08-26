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
  VoiceForm,
} from "~/schema";
import { useCopilot } from "./useCopilot";
import { SugarAiApi } from "~/api-client";
import { getBrowserAndOSDetails } from "~/helpers";
import { useLanguage } from "./useLanguage";

export interface VoiceFormContextType {
  formId: string;
  voiceForm: VoiceForm | null;
  // formConfig: FormConfig;
  submissionId: string | null;
  getForm: (formId: string) => Promise<any>;
  createSubmission: (formId: string) => Promise<any>;
  submitAnswer: (
    formId: string,
    question: Question,
    answer: QuestionAnswer,
  ) => Promise<any>;
  completeSubmission: (formId: string, submissionId: string) => Promise<any>;
}

// Create the context
const VoiceFormContext = createContext<VoiceFormContextType | null>(null);

export const VoiceFormProvider: React.FC<{
  formId: string;
  formConfigOverride: FormConfig;
  children: ReactNode;
}> = ({ formId, formConfigOverride, children }) => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [voiceForm, setVoiceForm] = useState<VoiceForm | null>(null);
  const { apiClient, config } = useCopilot();
  const { language, voice } = useLanguage();

  // const currentFormConfig = { ...FormConfigDefaults, ...voiceForm?.formConfig };

  useEffect(() => {
    if (formId !== "") {
      init(formId);
    }
  }, [formId]);

  async function init(formId: string) {
    // 1. Load form with questions
    const form = (await getForm(formId)) as VoiceForm;

    // 2. Create submission when user clicks start
    await createSubmission(formId);

    // 3. Submit answers on each successful submission (if needed)
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

  const getForm = async (formId: string): Promise<any | null> => {
    try {
      const vf = await apiClient.voiceForm.formGetForm(formId);

      const overridenForm = {
        ...vf,
        formConfig: {
          FormConfigDefaults,
          ...vf.formConfig,
          ...formConfigOverride,
        },
      };

      setVoiceForm(overridenForm);
      console.log(`Loaded form ${JSON.stringify(vf)}`);
      return vf;
    } catch (error) {
      console.error("Error loading form:", error);
      return null;
    }
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
    question: Question,
    answer: QuestionAnswer,
  ) => {
    if (!formId) throw new Error("Form ID is not set");
    if (!submissionId) {
      await createSubmission(formId);
    }

    try {
      const { id } = (await apiClient.voiceForm.formSubmissionSubmitAnswer(
        formId,
        submissionId as string,
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

  const completeSubmission = async (
    formId: string,
    submissionId: string,
  ): Promise<string | null> => {
    try {
      const resp = (await apiClient.voiceForm.formSubmissionCompleteSubmission(
        formId,
        submissionId,
      )) as SugarAiApi.FormSubmissionCompleteSubmissionResponse;

      console.log(`Submission completed successfully ${submissionId}`);
      return resp.submissionId;
    } catch (error) {
      console.error("Error completing submission:", error);
      return null;
    }
  };

  const getMetadata = () => {
    const uaData = getBrowserAndOSDetails();
    return {
      formConfig: voiceForm?.formConfig,
      language: language,
      voice: {
        voiceURI: voice?.voiceURI,
        name: voice?.name,
        lang: voice?.lang,
        localService: voice?.localService,
        default: voice?.default,
      },
      ...uaData,
    };
  };

  return (
    <VoiceFormContext.Provider
      value={{
        formId,
        voiceForm,
        // formConfig,
        submissionId,
        getForm,
        createSubmission,
        submitAnswer,
        completeSubmission,
      }}
    >
      {children}
    </VoiceFormContext.Provider>
  );
};

export const useVoiceForm = () => {
  const context = useContext(VoiceFormContext);
  if (!context) {
    throw new Error("useVoiceForm must be used within a VoiceFormProvider");
  }
  return context;
};
