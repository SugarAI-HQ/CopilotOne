import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { cancelMessage, speakMessageAsync } from "@/helpers/voice"; // Ensure the speakMessage function is properly imported
import { useLanguage } from "./LanguageContext";
import {
  LanguageCode,
  Streamingi18TextProps,
  Streamingi18TextRef,
} from "@/schema/quizSchema";
// import Button from "@mui/material/Button";

const Streamingi18Text: React.ForwardRefRenderFunction<
  Streamingi18TextRef,
  Streamingi18TextProps
> = ({ message, voiceConfig, beforeSpeak, afterSpeak }, ref) => {
  const { language, voice } = useLanguage();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const elRef = React.useRef<HTMLParagraphElement>(null);

  const streamRender = async (text: string, characterPerSec: number = 40) => {
    const characters = text.split("");
    const duration = characters.length / characterPerSec; // Duration per character in milliseconds
    const promises = [];
    for (let i = 0; i < characters.length; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          setTimeout(
            () => {
              setDisplayedText((prev) => {
                const next = `${prev}${characters[i]}`;
                resolve();
                return next;
              });
            },
            i * duration * 100
          ); // Distribute time evenly
        })
      );
    }
    // await Promise.all(promises);
    // return Promise.resolve();
    return Promise.all(promises);
  };

  const speakAndRender = async () => {
    const userLang: LanguageCode = language.split("-")[0] as LanguageCode;
    let text = "not found";

    text = message?.lang[language] ?? (message?.lang[userLang] as string);

    // if (voiceConfig?.lang == "auto") {
    //   text =
    //     message?.lang[language] ??
    //     message?.lang[userLang] ??
    //     message?.lang[voiceConfig?.defaultLang];
    // } else {
    //   text =
    //     message?.lang[voiceConfig?.lang] ??
    //     message?.lang[voiceConfig?.defaultLang];
    // }

    setIsSpeaking(true);

    return Promise.all([
      streamRender(text, voiceConfig?.characterPerSec).catch((err) =>
        console.log(err)
      ),
      speakMessageAsync(text, language, voice as SpeechSynthesisVoice).catch(
        (err) => console.log(err)
      ),
    ]).finally(() => {
      setIsSpeaking(false);
    });
  };

  const handleStart = async () => {
    if (isStarted) {
      return;
    }
    if (beforeSpeak) {
      try {
        await beforeSpeak();
      } catch (err) {
        console.log(err);
        return;
      }
    }

    setIsStarted(true);

    focusElement();

    return speakAndRender()
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        unfocusElement();
      })
      .then(async () => {
        if (afterSpeak) {
          await afterSpeak();
        }
      });
  };

  const focusElement = () => {
    if (elRef.current) {
      elRef.current.focus();
      elRef.current.classList.add("highlight");
    }
  };

  const unfocusElement = () => {
    if (elRef.current) {
      elRef.current.classList.remove("highlight");
    }
  };

  useImperativeHandle(ref, () => ({
    startStreaming: handleStart,
    focusElement: focusElement,
    unfocusElement: unfocusElement,
  }));

  useEffect(() => {
    return () => {
      cancelMessage();
      setIsSpeaking(false);
      setDisplayedText(""); // Optionally reset displayed text
    };
  }, []);

  return (
    <div className="streaming-text m-2 block" onClick={handleStart}>
      <h1
        ref={elRef}
        tabIndex={-1}
        className={`text-2xl whitespace-pre-wrap ${false ? "highlight" : ""}`}
        onFocus={() => elRef.current?.classList.add("highlight")}
        onBlur={() => elRef.current?.classList.remove("highlight")}
      >
        {displayedText}
        {/* <span className={`blinking-cursor-${isStarted ? "off" : "on"}`}>|</span> */}
      </h1>
      <style jsx>{`
        .highlight {
          outline: none;
          border: 2px solid yellow;
        }
        .blinking-cursor-on {
          display: inline;
          animation: blink 1s step-end infinite;
        }
        .blinking-cursor-off {
          display: none;
        }
        @keyframes blink {
          from,
          to {
            color: transparent;
          }
          50% {
            color: black;
          }
        }
      `}</style>
    </div>
  );
};

export default forwardRef(Streamingi18Text);
