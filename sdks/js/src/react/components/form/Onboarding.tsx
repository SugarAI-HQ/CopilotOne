import React, { useEffect, useRef, useState } from "react";
import {
  Streamingi18nTextRef,
  useLanguage,
  useSpeechToText,
  FormConfig,
  i18nMessage,
  geti18nMessage,
  MessageWorkflow,
  VoiceForm,
  extracti18nText,
} from "@sugar-ai/core";

// import MessageWorkflow from "~/react/workflow/MessageWorkflow";
import Streamingi18nText from "~/react/components/streaming/Streamingi18nText";
import "~/react/styles/form.css";
import LanguageSelector from "../language/LanguageSelector";

let renderCount = 0;

export const Onboarding: React.FC<{
  voiceForm: VoiceForm;
  showStartButton: boolean;
  onComplete: () => void;
  welcomeMessage: i18nMessage;
}> = ({ voiceForm, showStartButton, onComplete, welcomeMessage }) => {
  renderCount++;
  DEV: console.log("[re-render] Onboarding: ", renderCount);

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

  // const themeColor = color ?? "#0057FF";
  const themeColor = "#0057FF";

  return (
    <div>
      {showStart ? (
        <div className="h-dvh flex flex-col items-center justify-center ">
          <LanguageSelector
            languagesEnabled={voiceForm?.languages}
            // xklass="fixed bottom-0 left-0 right-0"
          />
          <h1 className="m-4 p-2 text-center text-3xl text-gray-800 dark:text-gray-200 md:text-4xl lg:text-5xl">
            {voiceForm?.messages &&
              extracti18nText(voiceForm?.description, language ?? "en")}
          </h1>

          <button
            className={`m-4 w-full max-w-xs p-4 md:max-w-md lg:max-w-lg bg-[${themeColor}] dark:bg-[${themeColor}] hover:bg-[${themeColor}] dark:bg-[${themeColor}] transform rounded-lg text-center text-white shadow-lg transition duration-300 ease-in-out hover:scale-105`}
            style={{
              backgroundColor: themeColor,
            }}
            onClick={() => {
              setShowStart(false);
              setShowStart((k) => {
                setTimeout(() => start(), 1000);
                return k;
              });
            }}
          >
            {voiceForm?.messages &&
              extracti18nText(voiceForm?.startButtonText, language ?? "en")}
          </button>
        </div>
      ) : (
        <div className="p-4 block justify-center">
          <Streamingi18nText
            klasses="sai-vf-welcome-message"
            auto={false}
            ref={welcomeMessageRef}
            message={welcomeMessage}
            formConfig={voiceForm?.formConfig}
          />
          {!isMicEnabled && (
            <Streamingi18nText
              klasses="sai-vf-request-permissions"
              auto={false}
              ref={requestMicPermissionsRef}
              message={geti18nMessage("requestMicPermissions")}
              formConfig={voiceForm?.formConfig}
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

export default React.memo(Onboarding);
// export default Onboarding;
