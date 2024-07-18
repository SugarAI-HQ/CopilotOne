import { speakMessage, speakMessageAsync } from "@/helpers/voice";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";
import Streamingi18Text from "./Streamingi18Text";
import useSpeechToText from "./useSpeechRecognition";
import {
  Streamingi18TextRef,
  VoiceConfig,
  i18Message,
} from "@/schema/quizSchema";
import MessageWorkflow from "./MessageWorkflow";

const Onboarding: React.FC<{
  showStartButton: boolean;
  onComplete: () => void;
  welcomeMessage: i18Message;
  voiceConfig: VoiceConfig;
}> = ({ showStartButton, onComplete, welcomeMessage, voiceConfig }) => {
  const { language, voice } = useLanguage();
  const [showStart, setShowStart] = useState<boolean>(showStartButton);

  const { isListening, isMicEnabled, requestMicPermission } = useSpeechToText({
    continuous: false,
  });

  const welcomeMessageRef = useRef<Streamingi18TextRef>(null);
  const requestMicPermissionsRef = useRef<Streamingi18TextRef>(null);

  const runWorkflow = async () => {
    const workflow = new MessageWorkflow();
    workflow.addMessage(welcomeMessageRef);
    workflow.addMessage(requestMicPermissionsRef);

    await workflow.run();
    await requestMicPermission();
    onComplete();
  };

  const requestMicPermissionsMessage: i18Message = {
    mode: "manual",
    lang: {
      en: "Please give microphone permissions.",
      hi: "कृपया माइक्रोफ़ोन की अनुमतियाँ दें।",
    },
    voice: true,
    output: "none",
  };

  useEffect(() => {
    if (welcomeMessage && language && voice && !showStart) {
      setTimeout(() => runWorkflow(), 1000);
    }
  }, [welcomeMessage, language, voice]);

  return (
    <div>
      {showStart ? (
        <div className="flex flex-wrap p-4 justify-center">
          <h3>This is demo of voice forms for lead generation</h3>
          <button
            className="justify-center m-4 p-2 bg-blue-500 text-white text-center"
            onClick={() => {
              setShowStart(false);
              setShowStart((k) => {
                setTimeout(() => runWorkflow(), 1000);
                return k;
              });
            }}
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div>
          <Streamingi18Text
            ref={welcomeMessageRef}
            message={welcomeMessage}
            voiceConfig={voiceConfig}
          />
          {!isMicEnabled && (
            <Streamingi18Text
              ref={requestMicPermissionsRef}
              message={requestMicPermissionsMessage}
              voiceConfig={voiceConfig}
            />
          )}

          {!isMicEnabled && (
            <button
              className="mt-4 p-2 bg-blue-500 text-white"
              onClick={requestMicPermission}
            >
              Allow Microphone x
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
