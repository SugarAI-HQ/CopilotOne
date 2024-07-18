import React from "react";
import { LanguageProvider } from "@/components/voice_form/LanguageContext";
import LanguageSelector from "@/components/voice_form/LanguageSelector";
import Onboarding from "@/components/voice_form/Onboarding";
import Quiz from "@/components/voice_form/Quiz";
import { VoiceConfigDefault } from "@/schema/quizSchema";
import { questions, welcomeMessage } from "@/data/heathfix-leadgen";

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

const App: React.FC = () => (
  <LanguageProvider defaultLang={"hi"} defaultVoice={"auto"}>
    <div className="container mx-auto p-4">
      <LanguageSelector />
      <Quiz
        showStartButton={true}
        welcomeMessage={welcomeMessage}
        questions={questions}
        voiceConfig={{
          ...VoiceConfigDefault,
          characterPerSec: 100,
        }}
      />
    </div>
  </LanguageProvider>
);

export default App;
