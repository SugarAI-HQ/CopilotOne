import { speakMessage } from "@/helpers/voice";
import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";

const Onboarding: React.FC<{
  onComplete: () => void;
  welcomeMessage: string;
}> = ({ onComplete, welcomeMessage }) => {
  const { language, voice } = useLanguage();
  const [micPermission, setMicPermission] = useState<boolean>(false);

  useEffect(() => {
    console.log(
      `message: ${welcomeMessage} lang: ${language}, voice ${voice?.name}`
    );
    if (welcomeMessage && language && voice) {
      setTimeout(() => {
        // debugger;
        speakMessage(welcomeMessage, language, voice, () => {
          speakMessage("Please give microphone permissions.", language, voice);
        });
      }, 2000);
    }
  }, [welcomeMessage, language, voice]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log(`lang: ${language}, voice ${voice?.name}`);
  //     speakMessage(welcomeMessage, language, voice, () => {
  //       speakMessage("Please give microphone permissions.", language, voice);
  //     });
  //   }, 2000);
  // }, []);

  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicPermission(true);
      speakMessage(
        "Microphone permissions granted. You can now speak.",
        language,
        voice,
        onComplete()
      );
    } catch (err) {
      setMicPermission(false);
      speakMessage(
        "Please try again giving microphone permissions.",
        language,
        voice
      );
    }
  };

  const handleMicPermission = () => {
    checkMicPermission();
  };

  return (
    <div className="p-4">
      <p>{welcomeMessage}</p>

      {!micPermission && (
        <button
          className="mt-4 p-2 bg-blue-500 text-white"
          onClick={handleMicPermission}
        >
          Allow Microphone x
        </button>
      )}
    </div>
  );
};

export default Onboarding;
