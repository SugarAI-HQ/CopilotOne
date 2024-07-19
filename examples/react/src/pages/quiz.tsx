import React from "react";
import { LanguageProvider } from "@/components/voice_form/LanguageContext";
import LanguageSelector from "@/components/voice_form/LanguageSelector";
import Onboarding from "@/components/voice_form/Onboarding";
import Quiz from "@/components/voice_form/Quiz";
import { VoiceConfigDefault } from "@/schema/quizSchema";
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
    copilotId: "fd84fb4b-3536-4a1b-a3e3-0d2592d4f58d",
    server: {
      endpoint: "http://localhost:3000/api",
      token: "pk-xgP50gfH7h6JoaYeKL2StsQUwY2GEIWBFHqW2PsoVj5qloBZ",
    },
    // copilotId: "da82abb5-cf74-448b-b94d-7e17245cc5d9",
    // server: {
    //   endpoint: "https://play.sugarcaneai.dev/api",
    //   token: "pk-m0j6E8CfMkedk0orAk0gXyALpOZULs3rSiYulaPFXd2rPlin",
    // },

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
          <Quiz
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
