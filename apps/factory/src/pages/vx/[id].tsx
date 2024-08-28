import { GetServerSideProps } from "next";
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
import { ErrorBoundary } from "@sentry/nextjs";
// import { UnsupportedBrowser } from "@/components/UnsupportedBrowser";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id, lang, show, color, record } = context.query;

  const copilotPackage = "sugar/copilotexample/todoexample/0.0.3";
  const themeColor = (color ?? "#0057FF") as string;

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
      record: record === "true",
    },
    voiceButton: copilotConfig.style.voiceButton,
  };

  return {
    props: {
      id,
      copilotConfig,
      initFormConfig,
    },
  };
};

const VoiceFormShow: NextPageWithLayout = ({
  id,
  copilotConfig,
  initFormConfig,
}: any) => {
  return (
    <ErrorBoundary>
      <div className="flex h-full w-full flex-col">
        <Header headerName={`Sugar AI`} />
        <CopilotProvider config={copilotConfig}>
          <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
            <WorkflowProvider>
              <VoiceFormProvider
                formId={id}
                formConfigOverride={initFormConfig}
              >
                <Suspense fallback={<p>Loading feed...</p>}>
                  <VoiceFormComponent showStartButton={true} />
                </Suspense>
              </VoiceFormProvider>
            </WorkflowProvider>
          </LanguageProvider>
        </CopilotProvider>
      </div>
    </ErrorBoundary>
  );
};

export default VoiceFormShow;
