import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { cancelMessage, speakMessageAsync } from "@/helpers/voice"; // Ensure the speakMessage function is properly imported
import { useLanguage } from "./LanguageContext";
import {
  Streamingi18TextProps,
  Streamingi18TextRef,
} from "@/schema/quizSchema";

const Streamingi18Text: React.ForwardRefRenderFunction<
  Streamingi18TextRef,
  Streamingi18TextProps
> = ({ message, voiceConfig }, ref) => {
  const { language, voice } = useLanguage();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const streamRender = async (text: string, characterPerSec: number = 40) => {
    const characters = text.split("");
    const duration = characters.length / characterPerSec; // Duration per character in milliseconds
    const promises = [];
    for (let i = 0; i < characters.length; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          setTimeout(
            () => {
              setDisplayedText((prev) => `${prev}${characters[i]}`);
              resolve();
            },
            i * duration * 300
          ); // Distribute time evenly
        })
      );
    }
    return Promise.all(promises);
  };

  const speakAndRender = async () => {
    // based on current language extract the text to be displayed
    const [userLang, country] = language.split("-");
    let text = "not found";

    if (voiceConfig?.lang == "auto") {
      text =
        message?.lang[language] ??
        message?.lang[userLang] ??
        message?.lang[voiceConfig?.defaultLang];
    } else {
      text =
        message?.lang[voiceConfig?.lang] ??
        message?.lang[voiceConfig?.defaultLang];
    }

    setIsSpeaking(true);

    return Promise.all([
      speakMessageAsync(text, language, voice),
      streamRender(text, voiceConfig?.characterPerSec),
    ]).finally(() => {
      setIsSpeaking(false);
    });

    // setIsSpeaking(false);
  };

  const handleStart = async () => {
    if (isStarted) {
      return;
    }
    setIsStarted(true);
    await speakAndRender().catch((err) => {
      console.log(err);
    });
  };

  useImperativeHandle(ref, () => ({
    startStreaming: handleStart,
  }));

  useEffect(() => {
    return () => {
      cancelMessage();
      setIsSpeaking(false);
      setDisplayedText(""); // Optionally reset displayed text
    };
  }, []);

  return (
    <div className="streaming-text" onClick={handleStart}>
      <p className="whitespace-pre-wrap">
        {displayedText}
        <span className={`blinking-cursor-${isStarted ? "off" : "on"}`}>|</span>
      </p>
      {/* {isSpeaking && <p>Speaking...</p>} */}
      {/* {!isStarted && <p>Click to start</p>} */}
    </div>
  );
};

export default forwardRef(Streamingi18Text);
