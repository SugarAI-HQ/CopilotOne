import React, { RefObject, useEffect, useRef, useState } from "react";
import { Suspense } from "react";
import {
  CopilotConfigType,
  LanguageCode,
  FormConfig,
  LanguageProvider,
  WorkflowProvider,
  FormConfigDefaults,
  displayMode,
  displayLocation,
  DisplayMode,
  DisplayLocation,
  Streamingi18nTextRef,
  MessageWorkflow,
} from "@sugar-ai/core";

import { Streamingi18nText } from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { UnsupportedBrowser } from "@/components/UnsupportedBrowser";
import { Header } from "@/components/common/header";
import { LanguageSelector } from "@sugar-ai/copilot-one-js";

const App: NextPage = () => {
  const router = useRouter();
  let { id, lang, show, color, record, mode, location } = router.query as {
    id: string;
    lang: LanguageCode;
    show: string;
    color: string;
    record: string;
    mode: DisplayMode; // Display mode from the query
    location?: DisplayLocation;
  };

  let showInUnSupportedBrowser = show ? true : false;

  const copilotPackage = "sugar/copilotexample/todoexample/0.0.3";
  const themeColor = color ?? "#0057FF";

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
        text: "Hello, How may I help you today?",
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
    ui: {
      ...FormConfigDefaults.ui,
      displayMode: mode ? mode : displayMode.Enum.fullscreen,
      displayLocation: location ? location : displayLocation.Enum.none,
    },
    listen: {
      ...FormConfigDefaults.listen,
      record: record ? true : false,
    },
    voiceButton: copilotConfig.style.voiceButton,
  };

  const welcomeRef: RefObject<Streamingi18nTextRef> =
    useRef<Streamingi18nTextRef>(null);

  const welcomeMessage = {
    lang: { en: "Hi, I am John. How may I help you today?" },
  };
  const workflow = new MessageWorkflow();
  workflow.addMessage(welcomeRef);

  const [formConfig, setFormConfig] = useState<FormConfig>(initFormConfig);
  const [showStreamingText, setShowStreamingText] = useState(false); // Add state to control visibility

  return (
    <>
      <Header />

      <UnsupportedBrowser forceShow={showInUnSupportedBrowser}>
        <LanguageProvider defaultLang="en" defaultVoiceLang="auto">
          <WorkflowProvider defaultWorklfow={workflow}>
            <LanguageSelector languagesEnabled={["en", "hi"]} />
            <button
              onClick={() => setShowStreamingText(true)} // Show Streamingi18nText on click
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: themeColor,
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                margin: "20px",
              }}
            >
              Start
            </button>

            {showStreamingText && ( // Conditionally render Streamingi18nText
              <Streamingi18nText
                ref={welcomeRef}
                auto={false}
                message={welcomeMessage}
              />
            )}
          </WorkflowProvider>
        </LanguageProvider>
      </UnsupportedBrowser>
    </>
  );
};

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
