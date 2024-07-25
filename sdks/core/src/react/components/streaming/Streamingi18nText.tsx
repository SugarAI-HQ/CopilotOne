import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
// import { css } from "@emotion/react";

const FAST_FORWARD = "fastForward";

import {
  cancelMessage,
  extracti18nText,
  speakMessageAsync,
} from "../../../helpers/voice"; // Ensure the speakMessage function is properly imported
import { useLanguage } from "../language/LanguageContext";
import {
  Streamingi18nTextProps,
  Streamingi18nTextRef,
} from "../../schema/form";

const Streamingi18nText: React.ForwardRefRenderFunction<
  Streamingi18nTextRef,
  Streamingi18nTextProps
> = ({ message, formConfig, beforeSpeak, afterSpeak }, ref) => {
  const { language, voice } = useLanguage();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const elRef = React.useRef<HTMLParagraphElement>(null);

  const getRenderData = (
    text: string,
    characterPerSec: number = 40,
  ): { characters: string[]; renderTime: number } => {
    const characters = text.split("");
    const duration = characters.length / characterPerSec; // Duration per character in milliseconds

    const renderTime = duration * 100;

    return { characters, renderTime };
  };

  const streamRender = async (characters: string[], renderTime) => {
    const promises: Promise<void>[] = [];
    for (let i = 0; i < characters.length; i++) {
      promises.push(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            setDisplayedText((prev) => {
              const next = `${prev}${characters[i]}`;
              resolve();
              return next;
            });
          }, i * renderTime); // Distribute time evenly
        }),
      );
    }
    return Promise.all(promises);
  };

  const speakAndRender = async () => {
    const text = extracti18nText(message, language);

    const { characters, renderTime } = getRenderData(
      text,
      formConfig?.characterPerSec,
    );

    setIsSpeaking(true);

    return Promise.all([
      streamRender(characters, renderTime).catch((err) => console.log(err)),
      speakMessageAsync(text, language, voice as SpeechSynthesisVoice).catch(
        (err) => console.log(err),
      ),
      waitForFastforward(renderTime),
    ])
      .catch((e) => {
        if (e == FAST_FORWARD) {
          // ignore
        }
      })
      .finally(() => {
        setIsSpeaking(false);
      });
  };

  const waitForFastforward = async (renderTime: number) => {
    let passedTime = 0;
    let timeout = renderTime * 30;
    return new Promise((resolve, reject) => {
      const interval = setInterval(function () {
        passedTime = passedTime + 50;
        if (passedTime >= timeout) {
          resolve("done");
          clearInterval(interval);
        }
        setIsCancelled((ic) => {
          if (ic) {
            reject(FAST_FORWARD);
            clearInterval(interval);
          }
          return false;
        });
      }, 50);
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

  const fastForward = (): void => {
    console.log("fast forwarding");
    setIsCancelled(true);
    cancelMessage();
  };

  return (
    <div className="streaming-text m-2 block" onClick={handleStart}>
      <h1
        ref={elRef}
        tabIndex={-1}
        className={`text-2xl whitespace-pre-wrap ${false ? "highlight" : ""}`}
        onFocus={() => elRef.current?.classList.add("highlight")}
        onBlur={() => elRef.current?.classList.remove("highlight")}
        onClick={() => fastForward()}
      >
        {displayedText}
      </h1>
      {/* <style jsx>{`
        .highlight {
          outline: none;
          border: 2px solid yellow;
        }
      `}</style> */}
    </div>
  );
};

export default forwardRef(Streamingi18nText);
class FastForwardedError extends Error {
  constructor(message: string = "fast forwarded") {
    super(message);
    this.name = "FastForwardedError";
    Object.setPrototypeOf(this, FastForwardedError.prototype);
  }
}
