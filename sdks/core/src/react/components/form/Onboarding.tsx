import React, { useEffect, useRef, useState } from "react";
import { Streamingi18TextRef, FormConfig } from "~/react/schema/form";
import { i18Message } from "~/react/schema/message";

import useSpeechToText from "~/react/hooks/useSpeechRecognition";
import MessageWorkflow from "~/workflow/MessageWorkflow";
import Streamingi18Text from "../streaming/Streamingi18Text";
import { useLanguage } from "../language/LanguageContext";

export const Onboarding: React.FC<{
  showStartButton: boolean;
  onComplete: () => void;
  welcomeMessage: i18Message;
  formConfig: FormConfig;
}> = ({ showStartButton, onComplete, welcomeMessage, formConfig }) => {
  const { language, voice } = useLanguage();
  const [showStart, setShowStart] = useState<boolean>(showStartButton);
  const [showPermissionButton, setShowPermissionButton] =
    useState<boolean>(false);

  const {
    isListening,
    isMicEnabled,
    requestMicPermission,
    checkIfAudioPermissionGranted,
  } = useSpeechToText({
    continuous: false,
  });

  const welcomeMessageRef = useRef<Streamingi18TextRef>(null);
  const requestMicPermissionsRef = useRef<Streamingi18TextRef>(null);

  const runWorkflow = async () => {
    const workflow = new MessageWorkflow();
    workflow.addMessage(welcomeMessageRef);
    workflow.addMessage(requestMicPermissionsRef);

    await workflow.run();
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
        <div className="flex-col p-2 justify-center">
          <h1 className="text-2xl	justify-center m-4 p-2 text-center">
            This is demo of voice forms for lead generation
          </h1>
          <button
            className="justify-center w-full m-4 p-4 bg-blue-500 text-white text-center"
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
        <div className="p-4 block justify-center">
          <Streamingi18Text
            ref={welcomeMessageRef}
            message={welcomeMessage}
            formConfig={formConfig}
          />
          {!isMicEnabled && (
            <Streamingi18Text
              ref={requestMicPermissionsRef}
              message={requestMicPermissionsMessage}
              formConfig={formConfig}
              beforeSpeak={async () => {
                return new Promise(async (resolve, reject) => {
                  const granted = await checkIfAudioPermissionGranted();
                  if (!granted) {
                    resolve(true);
                  } else {
                    reject(false);
                    onComplete();
                  }
                });
              }}
              afterSpeak={async () => {
                const granted = await requestMicPermission();
                if (granted) {
                  onComplete();
                } else {
                  setShowPermissionButton(true);
                }
              }}
            />
          )}

          {showPermissionButton && (
            <button
              className="mt-4 p-2 bg-blue-500 justify-center text-white"
              onClick={requestMicPermission}
            >
              Allow Microphone
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
