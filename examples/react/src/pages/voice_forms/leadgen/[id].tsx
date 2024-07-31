import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { type CopilotConfigType, LanguageCode } from "@sugar-ai/core";

import {
  extracti18nText,
  geti18nMessage,
  CopilotProvider,
  LanguageProvider,
  VoiceForm,
  LanguageSelector,
  WorkflowProvider,
  FormConfigDefaults,
} from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { UnsupportedBrowser } from "@/components/UnsupportedBrowser";

const App: NextPage = () => {
  const router = useRouter();
  const { id, lang } = router.query as { id: string; lang: LanguageCode };
  const [showStart, setShowStart] = useState<boolean>(true);

  const [fd, setFd] = useState<any>(null);
  useEffect(() => {
    if (!router.isReady) return;
    if (id) {
      const data = getFormData(id);
      setFd(data);

      // const imsg = geti18nMessage("startButton", data.translations);
      // const buttonText = extracti18nText(imsg, lang);
    }
  }, [id, router]);

  // const { language, voice } = useLanguage();
  const copilotPackage = "sugar/copilotexample/todoexample/0.0.3";

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
      theme: { primaryColor: "#3b83f6" },
      voiceButton: {},
    },
  };
  return (
    <CopilotProvider config={copilotConfig}>
      <UnsupportedBrowser stillAllow={process.env.NODE_ENV !== "development"}>
        {/* <div>
        <h1>Leadgen Form</h1>
      </div> */}
        <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
          <LanguageSelector klass="fixed bottom-0 left-0 right-0" />
          <WorkflowProvider>
            <Suspense fallback={<p>Loading feed...</p>}>
              {showStart && fd && (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl p-2 m-4 text-center text-gray-800">
                    {fd.translations &&
                      extracti18nText(
                        geti18nMessage("landingText", fd.translations),
                        lang ?? "en"
                      )}
                  </h1>
                  <button
                    className="w-full max-w-xs md:max-w-md lg:max-w-lg m-4 p-4 bg-blue-500 hover:bg-blue-600 text-white text-center rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => {
                      setShowStart(false);
                    }}
                  >
                    {fd.translations &&
                      extracti18nText(
                        geti18nMessage("startButton", fd.translations),
                        lang ?? "en"
                      )}
                  </button>
                </div>
              )}

              {!showStart && fd && (
                <VoiceForm
                  showStartButton={false}
                  translations={fd.translations}
                  questions={fd.questions}
                  formConfig={{
                    ...FormConfigDefaults,
                  }}
                />
              )}
            </Suspense>
          </WorkflowProvider>
        </LanguageProvider>
      </UnsupportedBrowser>
    </CopilotProvider>
  );
};

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
