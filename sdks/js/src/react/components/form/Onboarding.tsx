import React, { useEffect, useRef, useState } from "react";
import {
  Streamingi18nTextRef,
  useLanguage,
  useSpeechToText,
  FormConfig,
  i18nMessage,
  geti18nMessage,
  MessageWorkflow,
} from "@sugar-ai/core";

// import MessageWorkflow from "~/react/workflow/MessageWorkflow";
import Streamingi18nText from "~/react/components/streaming/Streamingi18nText";

export const Onboarding: React.FC<{
  showStartButton: boolean;
  onComplete: () => void;
  welcomeMessage: i18nMessage;
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

  const welcomeMessageRef = useRef<Streamingi18nTextRef>(null);
  const requestMicPermissionsRef = useRef<Streamingi18nTextRef>(null);

  const start = async () => {
    const workflow = new MessageWorkflow();
    workflow.addMessage(welcomeMessageRef);
    workflow.addMessage(requestMicPermissionsRef);
  };

  useEffect(() => {
    if (welcomeMessage && language && voice && !showStart) {
      setTimeout(() => start(), 1000);
    }
  }, [welcomeMessage, language, voice]);

  return (
    <div>
      {showStart ? (
        <div className="flex-col p-2 justify-center">
          <h1 className="text-2xl p-2	justify-center m-4 text-center">
            This is demo of voice forms for lead generation
          </h1>
          <button
            className="justify-center w-full m-4 p-4 bg-blue-500 text-white text-center"
            onClick={() => {
              setShowStart(false);
              setShowStart((k) => {
                setTimeout(() => start(), 1000);
                return k;
              });
            }}
          >
            Book Appointment
          </button>
        </div>
      ) : (
        <div className="p-4 block justify-center">
          <Streamingi18nText
            auto={false}
            ref={welcomeMessageRef}
            message={welcomeMessage}
            formConfig={formConfig}
          />
          {!isMicEnabled && (
            <Streamingi18nText
              auto={false}
              ref={requestMicPermissionsRef}
              message={geti18nMessage("requestMicPermissions")}
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
