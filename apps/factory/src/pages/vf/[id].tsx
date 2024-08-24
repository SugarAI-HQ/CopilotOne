import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import {
  type CopilotConfigType,
  LanguageCode,
  formConfig,
  FormConfig,
  Translations,
  defaultFormTranslations,
} from "@sugar-ai/core";

import {
  extracti18nText,
  geti18nMessage,
  CopilotProvider,
  LanguageProvider,
  WorkflowProvider,
  FormConfigDefaults,
  VoiceFormProvider,
} from "@sugar-ai/core";
import { api } from "~/utils/api";
import { Form } from "~/validators/form";

import { VoiceFormComponent, LanguageSelector } from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
// import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Header from "~/components/marketplace/header";
// import { UnsupportedBrowser } from "@/components/UnsupportedBrowser";

const VoiceFormShow: NextPage = () => {
  const router = useRouter();
  let { id, lang, show, color, record } = router.query as {
    id: string;
    lang: LanguageCode;
    show: string;
    color: string;
    record: string;
  };

  //   let showInUnSupportedBrowser = show ? true : false;

  const [showStart, setShowStart] = useState<boolean>(true);

  const copilotPackage = "sugar/copilotexample/todoexample/0.0.3";
  const themeColor = color ?? "#0057FF";
  // const themeColor = "#3b83f6";

  let copilotConfig: CopilotConfigType = {
    copilotId: process.env.NEXT_PUBLIC_COPILOT_ID as string,
    server: {
      endpoint: process.env.NEXT_PUBLIC_COPILOT_ENDPOINT as string,
      token: process.env.NEXT_PUBLIC_COPILOT_SECRET as string,
    },
    ai: {
      defaultPromptTemplate: copilotPackage,
      defaultPromptVariables: {
        "#AGENT_NAME": "Tudy",
      },
      successResponse: "Task Done",
      failureResponse: "I am not able to do this",
    },
    nudges: {
      welcome: {
        textMode: "manual",
        text: "Hi, I am John. How may I help you today?",
        delay: 1,
        enabled: true,
        chatHistorySize: 0,
      },
    },
    style: {
      container: { position: "bottom-center" },

      theme: { primaryColor: themeColor },
      voiceButton: {
        bgColor: themeColor,
        iconSize: "28",
      },
    },
  };
  const initFormConfig: FormConfig = {
    ...FormConfigDefaults,
    listen: {
      ...FormConfigDefaults.listen,
      record: record ? true : false,
    },
    voiceButton: copilotConfig.style.voiceButton,
    // userId: fd.userId,
  };

  const [voiceForm, setVoiceForm] = useState<Form>();

  // const [formConfig, setFormConfig] = useState<FormConfig>(initFormConfig);

  const { data: form, isLoading: isFormLoading } = api.form.getForm.useQuery(
    { id: id },
    {
      enabled: !!id,
      onSuccess(form: Form) {
        setVoiceForm({
          ...form,
          formConfig: initFormConfig,
        });
        // const ts: Translations = {
        //   welcome:
        //     form.messages?.welcome?.lang || defaultFormTranslations.welcome,
        //   submit: form.messages?.submit?.lang || defaultFormTranslations.submit,
        // };
        // setTranslations(ts);
      },
    },
  );

  return (
    <>
      <Header headerName={`Sugar AI`}></Header>
      <CopilotProvider config={copilotConfig}>
        <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
          <WorkflowProvider>
            <VoiceFormProvider formId={id} formConfig={voiceForm?.formConfig}>
              <Suspense fallback={<p>Loading feed...</p>}>
                {showStart && (
                  <div className="leadgen-container h-dvh flex flex-col items-center justify-center bg-gray-100 p-4 dark:bg-gray-800">
                    <LanguageSelector
                      languagesEnabled={voiceForm?.languages}
                      xklass="fixed bottom-0 left-0 right-0"
                    />
                    <h1 className="m-4 p-2 text-center text-3xl text-gray-800 dark:text-gray-200 md:text-4xl lg:text-5xl">
                      {voiceForm?.messages &&
                        extracti18nText(
                          voiceForm?.description,
                          // geti18nMessage("landingText", voiceForm?.description),
                          lang ?? "en",
                        )}
                    </h1>
                    <button
                      className={`m-4 w-full max-w-xs p-4 md:max-w-md lg:max-w-lg bg-[${themeColor}] dark:bg-[${themeColor}] hover:bg-[${themeColor}] dark:bg-[${themeColor}] transform rounded-lg text-center text-white shadow-lg transition duration-300 ease-in-out hover:scale-105`}
                      // style={`background-color: ${themeColor};`}
                      style={{
                        backgroundColor: themeColor,
                      }}
                      onClick={() => {
                        setShowStart(false);
                      }}
                    >
                      {voiceForm?.messages &&
                        extracti18nText(
                          voiceForm?.startButtonText,
                          // geti18nMessage("startButton", voiceForm?.messages),
                          lang ?? "en",
                        )}
                    </button>
                  </div>
                )}

                {!showStart && (
                  <VoiceFormComponent
                    voiceForm={voiceForm}
                    showStartButton={false}
                    questions={voiceForm?.questions}
                    formConfig={voiceForm?.formConfig}
                  />
                )}
              </Suspense>
            </VoiceFormProvider>
          </WorkflowProvider>
        </LanguageProvider>
      </CopilotProvider>
    </>
  );
};

export default VoiceFormShow;

// // Dynamically load the component without server-side rendering
// export default dynamic(() => Promise.resolve(VoiceFormShow), {
//   ssr: false,
// });
