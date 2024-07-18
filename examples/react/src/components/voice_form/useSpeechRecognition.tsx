import { on } from "events";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { speakMessageAsync } from "@/helpers/voice";

interface SpeechRecognitionOptions {
  interimResults?: boolean;
  continuous?: boolean;
  onListeningStop?: (text: string) => void;
}

const useSpeechToText = (options: SpeechRecognitionOptions = {}) => {
  const { language, voice } = useLanguage();
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [transcriptLength, setTranscriptLength] = useState(-1);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Web Speech API is not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;

    recognition.interimResults = options.interimResults || true;
    recognition.lang = language;
    recognition.continuous = options.continuous || false;

    if ("webkitSpeechGrammarList" in window) {
      const grammar =
        "#JSGF V1.0; grammar punctuation; public <punc> = . | , | ! | ; | : ;";
      const speechRecognitionList = new window.webkitSpeechGrammarList();
      speechRecognitionList.addFromString(grammar, 1);
      recognition.grammars = speechRecognitionList;
    }

    // recognition.onresult = (event: SpeechRecognitionEvent) => {
    //   let text = "";

    //   for (let i = 0; i < event.results.length; i++) {
    //     text += event.results[i][0].transcript;
    //   }

    //   // Always capitalize the first letter
    //   setTranscript(text.charAt(0).toUpperCase() + text.slice(1));
    // };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let fTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          fTranscript = event.results[i][0].transcript;
          DEV: console.log(`[Audio] Final: ${fTranscript}`);

          // Take care of it
          // setIslistening(false);
          // setFinalOutput(fTranscript);

          // await processSpeechToText(fTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(interimTranscript);
      setFinalTranscript(fTranscript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      // setTranscript("");

      // Send the latest value to the callback
      if (options.onListeningStop) {
        setFinalTranscript((ft) => {
          options.onListeningStop(ft);
          return ft;
        });
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = (length: number = -1) => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscriptLength(length);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const ifAudioPermissionGranted = async (): Promise<boolean> => {
    let granted = false;
    if (!isMicEnabled) {
      const result = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      if (result.state === "granted") {
        granted = true;
        DEV: console.log("[Audio] Permission already granted");
        setIsMicEnabled(true);
      }
    }

    return granted;
  };

  const requestMicPermission = async (): Promise<void> => {
    const alreadyGranted = await ifAudioPermissionGranted();
    if (alreadyGranted) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setIsMicEnabled(true);
      await speakMessageAsync(
        "Microphone permissions granted. You can now speak.",
        language,
        voice
      );
    } catch (err) {
      console.error(err);
      setIsMicEnabled(false);
      await speakMessageAsync(
        "Please try again giving microphone permissions.",
        language,
        voice
      );
    }
  };

  return {
    isListening,
    isMicEnabled,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
    requestMicPermission,
  };
};

export default useSpeechToText;
