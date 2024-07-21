import React from "react";
import { LanguageProvider } from "@/components/voice_form/LanguageContext";
import LanguageSelector from "@/components/voice_form/LanguageSelector";
import VoiceForm from "@/components/voice_form/VoiceForm";
import {
  postSubmissionMessage,
  questions,
  welcomeMessage,
} from "@/data/heathfix-leadgen";
import {
  useCopilot,
  type CopilotConfigType,
  CopilotProvider,
} from "@sugar-ai/core";
import { VoiceConfigDefault } from "@/schema/voiceFormSchema";
// import { VoiceAssistant, TextAssistant } from "@sugar-ai/copilot-one-js";

// 1. Onobarding Steps
// 1.1: auto detect user language
// 1.2: welcome message
// 1.3: Permission to speak

// 2. Form Filling
// 2.1: Load questions from server
// 2.2: Speak question with options, while realtime showing it on the screen
// 2.3: capture answer  and validate
// 2.4: validate & followup if needed
// 2.5: when success, go ahead to next question

// 3 Submission
// 3.1 Submit the anwers to server
// 3.2 Show success and ending message.

const App: React.FC = () => {
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
      <LanguageProvider defaultLang={"auto"} defaultVoiceLang={"auto"}>
        <div className="container mx-auto p-4">
          <LanguageSelector />
          <VoiceForm
            showStartButton={true}
            welcomeMessage={welcomeMessage}
            postSubmissionMessage={postSubmissionMessage}
            questions={questions}
            voiceConfig={{
              ...VoiceConfigDefault,
              characterPerSec: 100,
            }}
          />
        </div>
      </LanguageProvider>
    </CopilotProvider>
  );
};

export default App;
