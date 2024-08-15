import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

const FAST_FORWARD = "fastForward";

import {
  i18nMessage,
  useWorkflow,
  useLanguage,
  LanguageCode,
  geti18nMessage,
  CharcterPerSec,
  Streamingi18nTextProps,
  Streamingi18nTextRef,
  extracti18nText,
  speakMessageAsync,
  stopSpeaking,
} from "@sugar-ai/core";

export const Streamingi18nText: React.ForwardRefRenderFunction<
  Streamingi18nTextRef,
  Streamingi18nTextProps
> = (
  {
    auto,
    message,
    messageKey,
    formConfig,
    beforeSpeak,
    afterSpeak,
    klasses = "",
    style = {},
  },
  ref,
) => {
  const { language, voice, translations } = useLanguage();
  const { workflow } = useWorkflow();
  const [displayedText, setDisplayedText] = useState<string>("");
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCancelled, setIsCancelled] = useState<boolean>(false);

  const elRef = React.useRef<HTMLParagraphElement>(null);
  const createRef = (): Streamingi18nTextRef => ({
    startStreaming: handleStart,
    focusElement: focusElement,
  });
  const selfRef = useRef<Streamingi18nTextRef | null>(null);

  const getRenderData = (
    text: string,
    characterPerSec = CharcterPerSec,
  ): { characters: string[]; renderTime: number } => {
    let characters: string[] = [];
    let renderTime = 0;

    if (!text) {
      return { characters, renderTime };
    }

    characters = text.split("");
    const duration = (characters.length * 1000) / characterPerSec; // Duration per character in milliseconds

    renderTime = duration;
    return { characters, renderTime };
  };

  const streamRender = (characters, renderTime) => {
    const intervalTime = renderTime / characters.length;
    const promises: Promise<void>[] = [];

    for (let i = 0; i < characters.length; i++) {
      promises.push(
        new Promise((resolve) => {
          setTimeout(() => {
            setDisplayedText((prev) => {
              const next = `${prev}${characters[i]}`;
              resolve();
              return next;
            });
          }, i * intervalTime);
        }),
      );
    }

    return Promise.all(promises);
  };

  const speakAndRender = async (msg: i18nMessage, language: LanguageCode) => {
    const text = extracti18nText(msg, language);
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
        if (e === FAST_FORWARD) {
          // ignore
        }
      })
      .finally(() => {
        setIsSpeaking(false);
      });
  };

  const waitForFastforward = async (renderTime: number) => {
    let passedTime = 0;
    let timeout = renderTime;
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
    if (!message && !messageKey) {
      return;
    }
    let msg: i18nMessage | null = null;

    if (message) {
      msg = message;
    }

    if (messageKey && !message) {
      msg = geti18nMessage(messageKey, translations);
    }

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

    return speakAndRender(msg as i18nMessage, language)
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

  useImperativeHandle(ref, createRef);

  useEffect(() => {
    if (auto && (message || messageKey) && language && language !== "auto") {
      handleStart();
    }

    return () => {
      stopSpeaking();
      setIsSpeaking(false);
      setDisplayedText(""); // Optionally reset displayed text
    };
  }, [message, language]);

  useEffect(() => {
    if (auto && workflow) {
      selfRef.current = createRef();
      workflow.addMessage(selfRef);
    }

    return () => {
      // cancelMessage();
      // setIsSpeaking(false);
      // setDisplayedText(""); // Optionally reset displayed text
    };
  }, [workflow]);

  const fastForward = (): void => {
    setIsCancelled(true);
    stopSpeaking();
  };

  return (
    <div className="streaming-text block" onClick={handleStart}>
      <h1
        ref={elRef}
        tabIndex={-1}
        className={`${klasses} text-2xl whitespace-pre-wrap ${false ? "highlight" : ""}`}
        onFocus={() => elRef.current?.classList.add("highlight")}
        onBlur={() => elRef.current?.classList.remove("highlight")}
        onClick={() => fastForward()}
        style={style}
      >
        {displayedText}
        <span className={`${isSpeaking ? "blinking-cursor" : "hidden"}`}>
          |
        </span>
      </h1>
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
