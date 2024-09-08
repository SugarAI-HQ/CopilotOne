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
  VoiceFormProvider,
} from "@sugar-ai/core";

import { SchemaToJson } from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
import { getFormData } from "@/data/leadgen";
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

  useEffect(() => {
    if (!router.isReady) return;
    if (id) {
      const data = getFormData(id);
      setFd(data);

      // setFormConfig((fc) => {
      //   // debugger;
      //   fc.id = formId || data.formId;
      //   return fc;
      // });

      // const imsg = geti18nMessage("startButton", data.translations);
      // const buttonText = extracti18nText(imsg, lang);
    }
  }, [id, router]);

  return (
    <>
      <Header />
      <CopilotProvider config={copilotConfig}>
        <SchemaToJson></SchemaToJson>
      </CopilotProvider>
    </>
  );
};

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
