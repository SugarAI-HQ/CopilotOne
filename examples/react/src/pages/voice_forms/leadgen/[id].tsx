import React, { useEffect, useState } from "react";
import {
  useCopilot,
  type CopilotConfigType,
  CopilotProvider,
  LanguageProvider,
  VoiceForm,
  LanguageSelector,
  FormConfigDefaults,
} from "@sugar-ai/core";
import "@sugar-ai/core/style";
import dynamic from "next/dynamic";
import { getFormData } from "@/data/leadgen";
import { useRouter } from "next/router";
import { NextPage } from "next";

const App: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const [fd, setFd] = useState<any>(null);
  useEffect(() => {
    if (id) {
      const data = getFormData(id);
      setFd(data);
    }
  }, [id]);

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
      {/* <div>
        <h1>Leadgen Form</h1>
      </div> */}
      <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
        <LanguageSelector klass="fixed bottom-0 left-0 right-0" />

        {fd ? (
          <VoiceForm
            showStartButton={true}
            welcomeMessage={fd.welcomeMessage}
            postSubmissionMessage={fd.postSubmissionMessage}
            questions={fd.questions}
            formConfig={{ ...FormConfigDefaults, ...{ characterPerSec: 100 } }}
          />
        ) : (
          <div>
            <h1>Not Found</h1>
          </div>
        )}
      </LanguageProvider>
    </CopilotProvider>
  );
};

// Dynamically load the component without server-side rendering
export default dynamic(() => Promise.resolve(App), {
  ssr: false,
});
