"use client";

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

import { LanguageSelector, VoiceFormComponent } from "@sugar-ai/copilot-one-js";
import { getCopilotConfig } from "~/utils/copilot";

import "@sugar-ai/copilot-one-js/style";
import dynamic from "next/dynamic";
// import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";
import Header from "~/components/marketplace/header";
import { NextPageWithLayout } from "../_app";
import { ErrorBoundary } from "@sentry/nextjs";
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
  const copilotConfig = getCopilotConfig(copilotPackage, color);

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
    <ErrorBoundary>
      <div className="flex h-full w-full flex-col">
        <Header headerName={`Sugar AI`}></Header>

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

VoiceFormShow.isPublic = true;

export default VoiceFormShow;

// // Dynamically load the component without server-side rendering
// export default dynamic(() => Promise.resolve(VoiceFormShow), {
//   ssr: false,
// });
