import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useRef,
} from "react";
import { cancelMessage, speakMessage } from "@/helpers/voice"; // Ensure the speakMessage function is properly imported
import { useLanguage } from "./LanguageContext";

interface StreamingTextProps {
  message: string;
}

export interface StreamingTextRef {
  startStreaming: () => void;
}

const StreamingText: React.ForwardRefRenderFunction<
  StreamingTextRef,
  StreamingTextProps
> = ({ message }, ref) => {
  const { language, voice } = useLanguage();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const streamRender = async (characterPerSec: number = 40) => {
    const characters = message.split("");
    // const duration = 1000 / characterPerSec; // Duration per character in milliseconds
    const duration = characters.length / characterPerSec; // Duration per character in milliseconds
    for (let i = 0; i < characters.length; i++) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          setDisplayedText((prev) => `${prev}${characters[i]}`);
          resolve();
        }, i * duration); // Distribute time evenly
      });
    }
  };

  const speakAndRender = async () => {
    setIsSpeaking(true);
    await Promise.all([
      streamRender(40),
      speakMessage(message, language, voice as SpeechSynthesisVoice),
    ]);
    setIsSpeaking(false);
  };

  const handleStart = () => {
    if (isStarted) {
      return;
    }
    setIsStarted(true);
    speakAndRender();
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
        <span className="blinking-cursor">|</span>
      </p>
      {/* {isSpeaking && <p>Speaking...</p>} */}
      {/* {!isStarted && <p>Click to start</p>} */}
    </div>
  );
};

export default forwardRef(StreamingText);
