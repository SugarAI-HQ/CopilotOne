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

import { VoiceFormComponent, LanguageSelector } from "@sugar-ai/copilot-one-js";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
// import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Header from "~/components/marketplace/header";
import { NextPageWithLayout } from "../_app";
// import { UnsupportedBrowser } from "@/components/UnsupportedBrowser";

const VoiceFormShow: NextPageWithLayout = () => {
  const router = useRouter();
  let { id, lang, show, color, record } = router.query as {
    id: string;
    lang: LanguageCode;
    show: string;
    color: string;
    record: string;
  };

  //   let showInUnSupportedBrowser = show ? true : false;

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

  return (
    <div className="flex h-full w-full flex-col">
      <Header headerName={`Sugar AI`}></Header>

      <CopilotProvider config={copilotConfig}>
        <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
          <WorkflowProvider>
            <VoiceFormProvider formId={id} formConfigOverride={initFormConfig}>
              <Suspense fallback={<p>Loading feed...</p>}>
                <VoiceFormComponent showStartButton={true} />
              </Suspense>
            </VoiceFormProvider>
          </WorkflowProvider>
        </LanguageProvider>
      </CopilotProvider>
    </div>
  );
};

VoiceFormShow.isPublic = true;

export default VoiceFormShow;
