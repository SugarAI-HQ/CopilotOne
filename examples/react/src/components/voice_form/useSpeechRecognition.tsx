import { on } from "events";
import { useState, useRef, useEffect } from "react";

interface SpeechRecognitionOptions {
  interimResults?: boolean;
  lang?: string;
  continuous?: boolean;
  onCompletion?: (text: string) => void;
}

const useSpeechToText = (options: SpeechRecognitionOptions = {}) => {
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
    recognition.lang = options.lang || "en-US";
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
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript = event.results[i][0].transcript;
          DEV: console.log(`[Audio] Final: ${finalTranscript}`);

          // Take care of it
          // setIslistening(false);
          // setFinalOutput(finalTranscript);

          // await processSpeechToText(finalTranscript);
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(interimTranscript);
      setFinalTranscript(finalTranscript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      // setTranscript("");
      if (options.onCompletion) {
        options.onCompletion(transcript);
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

  return {
    isListening,
    transcript,
    finalTranscript,
    startListening,
    stopListening,
  };
};

export default useSpeechToText;
