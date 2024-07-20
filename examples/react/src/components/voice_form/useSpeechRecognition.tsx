import { on } from "events";
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { speakMessageAsync, speaki18kMessageAsync } from "@/helpers/voice";
import { i18Message } from "@/schema/quizSchema";

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
  const [finalTranscript, setFinalTranscript] = useState<string>("");
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

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // const startListening = (length: number = -1) => {
  //   if (recognitionRef.current && !isListening) {
  //     recognitionRef.current.start();
  //     setIsListening(true);
  //     setTranscriptLength(length);
  //   }
  // };

  const startListeningAsync = (length: number = -1): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Stop existing recognition if it is already running
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      // Initialise a new recognition object
      const recognition = new window.webkitSpeechRecognition();
      recognitionRef.current = recognition;
      recognition.interimResults = options.interimResults || true;
      recognition.lang = language;
      recognition.continuous = options.continuous || false;

      if (recognitionRef.current && !isListening) {
        // recognitionRef.current.onresult = (event) => {
        //   const transcript = Array.from(event.results)
        //     .map((result) => result[0])
        //     .map((result) => result.transcript)
        //     .join("");

        //   // resolve(transcript);
        // };

        recognitionRef.current.onresult = async (
          event: SpeechRecognitionEvent
        ) => {
          let interimTranscript = "";
          let fTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              fTranscript = event.results[i][0].transcript;
              // DEV: console.log(`[Audio] Final: ${fTranscript}`);

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

        recognitionRef.current.onerror = (event) => {
          // if (options.onListeningStop) {
          //   return options.onListeningStop(event);
          // }
          reject(event.error);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);

          setFinalTranscript((ft: string) => {
            if (options.onListeningStop) {
              options.onListeningStop(ft);
            }
            resolve(ft);
            return ft;
          });
        };

        recognitionRef.current.start();
        setIsListening(true);
        setTranscriptLength(length);
      } else {
        reject(
          new Error(
            "Speech recognition is already listening or not initialized."
          )
        );
      }
    });
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const checkIfAudioPermissionGranted = async (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      let granted = false;
      if (!isMicEnabled) {
        try {
          const result = await navigator.permissions.query({
            name: "microphone" as PermissionName,
          });

          if (result.state === "granted") {
            granted = true;
            console.log("[Audio] Permission already granted");
            setIsMicEnabled(true);
            resolve(granted);
          } else {
            resolve(granted);
          }
        } catch (error) {
          console.error("[Audio] Error checking microphone permission", error);
          reject(granted);
        }
      } else {
        resolve(granted);
      }
    });
  };
  const requestMicPermission = async (): Promise<boolean> => {
    let granted = false;
    const alreadyGranted = await checkIfAudioPermissionGranted();
    let endMessage = "Microphone permissions granted. You can now speak.";

    if (alreadyGranted) {
      granted = true;
      return granted;
    }

    return await navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // stream.getTracks().forEach((track) => track.stop());
        setIsMicEnabled(true);
        granted = true;
        return granted;
      })
      .catch((err) => {
        console.error("[Audio] Error requesting microphone permission", err);
        granted = false;
        endMessage = "Please try again by giving microphone permissions.";
        return granted;
      })
      .finally(async () => {
        setIsMicEnabled(granted);

        return new Promise<boolean>(async (resolve, reject) => {
          setTimeout(async () => {
            await speakMessageAsync(
              endMessage,
              language,
              voice as SpeechSynthesisVoice
            );
            resolve(granted);
          }, 1000);
        });
      });
  };

  interface GetUserReponseProps {
    nudgeAfterAttempts?: number;
  }

  const getUserResponse = async (
    options: GetUserReponseProps = { nudgeAfterAttempts: 2 }
  ): Promise<string> => {
    let userResponse = "";
    // options.nudgeAfterAttempts = options.nudgeAfterAttempts ?? 2;

    // Get user response
    while (userResponse === "" && (options?.nudgeAfterAttempts ?? 0) < 2) {
      userResponse = await startListeningAsync().catch(async (error) => {
        console.error(error);
        if (error == "no-speech") {
          // ignore it
          options.nudgeAfterAttempts = (options.nudgeAfterAttempts ?? 0) + 1;

          // nudge user to speak
          if (options.nudgeAfterAttempts == 2) {
            await speaki18kMessageAsync(
              noSpeech,
              language,
              voice as SpeechSynthesisVoice
            );
            options.nudgeAfterAttempts = 0;
          }
        } else {
          debugger;
          console.error("[Audio] Error getting user response", error);
        }
        return "";
      });
    }

    return userResponse;
  };

  return {
    isListening,
    isMicEnabled,
    transcript,
    finalTranscript,
    // startListening,
    startListeningAsync,
    stopListening,
    requestMicPermission,
    checkIfAudioPermissionGranted,
    getUserResponse,
  };
};

export default useSpeechToText;

const noSpeech: i18Message = {
  mode: "manual",
  lang: {
    en: "Kindly speak out your answer.",
    hi: "कृपया अपना उत्तर बोलें।",
  },
  voice: true,
  output: "none",
};
