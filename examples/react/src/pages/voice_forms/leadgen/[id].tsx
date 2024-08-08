import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import {
  type CopilotConfigType,
  LanguageCode,
  formConfig,
  FormConfig,
} from "@sugar-ai/core";

import {
  extracti18nText,
  geti18nMessage,
  CopilotProvider,
  LanguageProvider,
  WorkflowProvider,
  FormConfigDefaults,
} from "@sugar-ai/core";

import { VoiceForm, LanguageSelector } from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { UnsupportedBrowser } from "@/components/UnsupportedBrowser";

const App: NextPage = () => {
  const router = useRouter();
  let { id, lang, show, color } = router.query as {
    id: string;
    lang: LanguageCode;
    show: string;
    color: string;
  };

  let showInUnSupportedBrowser = show ? true : false;

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

  const copilotPackage = "sugar/copilotexample/todoexample/0.0.3";
  const themeColor = color ?? "#2563eb";
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
      },
    },
  };

  const formConfig: FormConfig = {
    ...FormConfigDefaults,
    voiceButton: copilotConfig.style.voiceButton,
  };
  return (
    <>
      <Header />
      <CopilotProvider config={copilotConfig}>
        <UnsupportedBrowser forceShow={showInUnSupportedBrowser}>
          {/* <div>
        <h1>Leadgen Form</h1>
      </div> */}
          <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
            <WorkflowProvider>
              <Suspense fallback={<p>Loading feed...</p>}>
                {showStart && fd && (
                  <div className="leadgen-container flex flex-col items-center justify-center h-dvh p-4 bg-gray-100 dark:bg-gray-800">
                    <LanguageSelector
                      languagesEnabled={fd.languagesEnabled}
                      xklass="fixed bottom-0 left-0 right-0"
                    />
                    <h1 className="text-3xl md:text-4xl lg:text-5xl p-2 m-4 text-center text-gray-800 dark:text-gray-200">
                      {fd.translations &&
                        extracti18nText(
                          geti18nMessage("landingText", fd.translations),
                          lang ?? "en"
                        )}
                    </h1>
                    <button
                      className={`w-full max-w-xs md:max-w-md lg:max-w-lg m-4 p-4 bg-[${themeColor}] dark:bg-[${themeColor}] hover:bg-[${themeColor}] dark:bg-[${themeColor}] text-white text-center rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105`}
                      // style={`background-color: ${themeColor};`}
                      style={{
                        backgroundColor: themeColor,
                      }}
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
                    formConfig={formConfig}
                  />
                )}
              </Suspense>
            </WorkflowProvider>
          </LanguageProvider>
        </UnsupportedBrowser>
      </CopilotProvider>
    </>
  );
};

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});

export const Header = () => {
  return (
    <header className="bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <img
              className="h-10 w-300"
              src="https://sugarai.dev/_astro/logo-transparent.UspD8vKv.png"
              alt="Sugar AI"
            />
            {/* <span className="ml-3 text-xl font-bold text-gray-900">
              Sugar AI
            </span> */}
          </div>
          <nav className="flex space-x-4">
            {/* 
            <a
              href="https://sugarai.dev"
              className="text-gray-100 hover:text-gray-900"
            >
              Home
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Services
            </a> 
            <a href="#" className="text-gray-500 hover:text-gray-900">
              Contact
            </a>*/}
          </nav>
        </div>
      </div>
    </header>
  );
};
