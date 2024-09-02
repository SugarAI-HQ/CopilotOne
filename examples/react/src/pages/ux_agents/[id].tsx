import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import {
  type CopilotConfigType,
  LanguageCode,
  FormConfig,
} from "@sugar-ai/core";

import {
  CopilotProvider,
  LanguageProvider,
  WorkflowProvider,
  FormConfigDefaults,
  VoiceFormProvider,
} from "@sugar-ai/core";

import { Pages, Page, Initializing } from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";

import { useRouter } from "next/router";
import { NextPage } from "next";
import { Header } from "@/components/common/header";

const App: NextPage = () => {
  const router = useRouter();
  let { id, formId, lang, show, color, record } = router.query as {
    id: string;
    lang: LanguageCode;
    show: string;
    color: string;
    record: string;
    formId: string;
  };

  let showInUnSupportedBrowser = show ? true : false;

  const [showStart, setShowStart] = useState<boolean>(true);

  const [fd, setFd] = useState<any>(null);

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

  const [formConfig, setFormConfig] = useState<FormConfig>(initFormConfig);

  // Page 1 - Welcome
  // Page 2 - Intro
  // Page 3 - Ask role
  // Page 4 - Role Specific Pitch
  // Page 5 - Ask use case
  // Page 6 - Show use case Specific demo
  // Page 7 - Signup for meeting
  // Page 8 - Show Demo

  return (
    <>
      {/* <Header /> */}
      <CopilotProvider config={copilotConfig}>
        {/* <div>
        <h1>Leadgen Form</h1>
      </div> */}

        <WorkflowProvider>
          <VoiceFormProvider
            formId={formId}
            formConfigOverride={formConfig}
            Loading={<Initializing />}
          >
            <Suspense fallback={<p>Loading feed...</p>}>
              {/*  */}
              <Pages config={{ fullScreen: true, width: "3/4", height: "3/4" }}>
                {/* Page 1 - Welcome */}
                <Page layout="headingOnly">Welcome to Our Service</Page>

                {/* Page 2 - Intro */}
                <Page layout="headingWithText">
                  <h1>Introduction</h1>
                  <p>We provide the best solutions for your needs.</p>
                </Page>

                {/* Page 3 - Ask role */}
                <Page layout="default">
                  <h2 className="text-2xl">What is your role?</h2>
                  <div className="mt-4">
                    <button className="p-2 bg-blue-500 text-white rounded-md mr-2">
                      Developer
                    </button>
                    <button className="p-2 bg-blue-500 text-white rounded-md">
                      Manager
                    </button>
                  </div>
                </Page>

                {/* Page 4 - Role Specific Pitch */}
                <Page layout="headingWithText">
                  <h1>Role Specific Pitch</h1>
                  <p>Here's why our product is perfect for your role.</p>
                </Page>

                {/* Page 5 - Ask use case */}
                <Page layout="default">
                  <h2 className="text-2xl">What is your use case?</h2>
                  <div className="mt-4">
                    <button className="p-2 bg-blue-500 text-white rounded-md mr-2">
                      Use Case 1
                    </button>
                    <button className="p-2 bg-blue-500 text-white rounded-md">
                      Use Case 2
                    </button>
                  </div>
                </Page>

                {/* Page 6 - Show use case Specific demo */}
                <Page layout="headingWithText">
                  <h1>Use Case Specific Demo</h1>
                  <p>Watch this demo tailored to your use case.</p>
                </Page>

                {/* Page 7 - Signup for meeting */}
                <Page layout="default">
                  <h2 className="text-2xl">Sign up for a meeting</h2>
                  <form className="mt-4">
                    <input
                      type="text"
                      placeholder="Enter your email"
                      className="p-2 border rounded-md w-full mb-2"
                    />
                    <button
                      type="submit"
                      className="p-2 bg-blue-500 text-white rounded-md"
                    >
                      Schedule Meeting
                    </button>
                  </form>
                </Page>

                {/* Page 8 - Show Demo */}
                <Page layout="headingWithText">
                  <h1>Final Demo</h1>
                  <p>Thank you! Here's the final demo.</p>
                </Page>
              </Pages>
            </Suspense>
          </VoiceFormProvider>
        </WorkflowProvider>
      </CopilotProvider>
    </>
  );
};

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
