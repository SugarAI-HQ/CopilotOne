import { useState, useRef, useEffect } from "react";
import {
  ListenConfigDefaults,
  ListenConfig,
  AudioResponse,
  Recording,
} from "~/schema/form";
import root from "window-or-global";
import { useLanguage } from "./useLanguage";
import useSpeechSynthesis from "./useSpeechSynthesis";
import { delay } from "~/helpers";
import { geti18nMessage } from "~/i18n";
import { debug } from "console";
import { isAndroid, isDesktop, isIOS } from "~/helpers/useragent";

interface SpeechRecognitionOptions {
  interimResults?: boolean;
  continuous?: boolean;
  onListeningStop?: (text: string) => void;
}

const noSpeech = geti18nMessage("noSpeech");

export const useSpeechToText = (options: SpeechRecognitionOptions = {}) => {
  const { language, voice } = useLanguage();
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState<string>("");
  const [transcriptLength, setTranscriptLength] = useState(-1);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<any | null>(null);
  const [audioFiles, setAudioFiles] = useState<File[]>([]);

  const {
    isSpeaking,
    speakMessage,
    speakMessageAsync,
    speaki18nMessageAsync,
    stopSpeaking,
  } = useSpeechSynthesis();

  useEffect(() => {
    // if (!("webkitSpeechRecognition" in window)) {
    //   console.error("Web Speech API is not supported");
    //   return;
    // }
    // const recognition = new root.webkitSpeechRecognition();
    // recognitionRef.current = recognition;
    // recognition.interimResults = options.interimResults || true;
    // recognition.lang = language;
    // recognition.continuous = options.continuous || false;
    // recognition.onresult = (event: SpeechRecognitionEvent) => {
    //   let text = "";
    //   for (let i = 0; i < event.results.length; i++) {
    //     text += event.results[i][0].transcript;
    //   }
    //   // Always capitalize the first letter
    //   setTranscript(text.charAt(0).toUpperCase() + text.slice(1));
    // };
    // return () => {
    //   if (recognitionRef.current) {
    //     recognitionRef.current.stop();
    //   }
    // };
  }, []);

  // const startListening = (length: number = -1) => {
  //   if (recognitionRef.current && !isListening) {
  //     recognitionRef.current.start();
  //     setIsListening(true);
  //     setTranscriptLength(length);
  //   }
  // };

  const startListeningContinous = (
    options: ListenConfig = ListenConfigDefaults,
    previousResponse = "",
    counter: number = -1,
  ): Promise<AudioResponse> => {
    return new Promise<AudioResponse>(async (resolve, reject) => {
      // Stop existing recognition if it is already running
      if (recognitionRef.current) {
        console.warn(
          `[ListeningContinous][${counter}] Already listening, stopping...`,
        );
        recognitionRef.current.stop();
      }

      // Initialize a new recognition object
      const recognition = new root.webkitSpeechRecognition();
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;

      let lfinalTranscript = "";
      let linterimTranscript = "";
      let timeout;
      let autoStopped = true;

      // debugger;
      const recordingPromise = recordAudio(counter);

      // Stop recognition on pause or length limit
      const stopRecognition = (timeout = true) => {
        autoStopped = false;
        if (timeout) {
          console.log(`[ListeningContinous][${counter}] timed out`);
        }

        if (recognitionRef.current) {
          setIsListening((il: boolean) => {
            if (il == true) {
              const answerCaptured =
                lfinalTranscript.trim() + linterimTranscript.trim();

              console.log(
                `[ListeningContinous][${counter}] Stopping listening, answer: ${answerCaptured}`,
              );
              recognitionRef?.current?.stop();
            }

            return false;
          });
        }
      };

      const cleanup = () => {
        if (timeout) {
          clearTimeout(timeout);
        }

        if (recognitionRef.current) {
          recognitionRef.current = null;
        }

        if (mediaRecorderRef.current) {
          mediaRecorderRef.current?.stop(); // Stop recording when recognition stops
        }

        console.log(`[ListeningContinous][${counter}] cleanup`);
      };

      // Reset the pause timer
      const userSpeakingTimout = () => {
        if (timeout) {
          clearTimeout(timeout);
        }

        // Usecases
        // 1. user have not spoken anything, -> keep listening till userNoSpeechTimeout
        // 2. user have not spoken few words, -> keep listening till userPauseTimeout
        // 3. if Max answer length have reached, dont wait at all

        const answer = lfinalTranscript + linterimTranscript.length;
        const answerLength =
          lfinalTranscript.length + linterimTranscript.length;
        if (
          answerLength >= options.maxAnswerLength &&
          options.maxAnswerLength > 0
        ) {
          console.log(`[ListeningContinous][${counter}] answer length reached`);
          stopRecognition(false);
        } else {
          const ts =
            answerLength > 0
              ? options.userPauseTimeout
              : options.userNoSpeechTimeout;

          // console.log(
          //   `[ListeningContinous][${counter}] answer: ${answer} setting timeout ${ts}`,
          // );

          timeout = setTimeout(stopRecognition, ts);
        }
      };

      const processResultWithInterim = (event: SpeechRecognitionEvent) => {
        let interim = lfinalTranscript;
        // let finalTranscript = "";

        // DEV: console.log(
        //   `[ListeningContinous][${counter}] onresult ${event.resultIndex}`,
        //   event.results,
        // );

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            lfinalTranscript += event.results[i][0].transcript;
          }

          // This is already final + New words yet to be finalised
          interim += event.results[i][0].transcript;
          linterimTranscript = interim;
        }
        setFinalTranscript(previousResponse + lfinalTranscript);

        setTranscript(previousResponse + interim);

        // DEV: console.log(`[ListeningContinous][${counter}] interim ${interim}`);
      };

      const processResultWithFinal = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        // DEV: console.log(
        //   `[ListeningContinous][${counter}] onresult ${event.resultIndex}`,
        //   event.results,
        // );

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        lfinalTranscript = previousResponse + final + interim;

        setTranscript(lfinalTranscript);
        setFinalTranscript(lfinalTranscript);

        // DEV: console.log(`[ListeningContinous][${counter}] interim ${final}`);
      };

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        if (isAndroid() || isIOS()) {
          // for chrome in mobile chrome
          processResultWithFinal(event);
        } else if (isDesktop()) {
          // for chrome in desktop/laptop browser
          processResultWithInterim(event);
        } else {
          processResultWithInterim(event);
        }

        // for chrome in mobile browser

        userSpeakingTimout();
      };

      // recognition.onresult = (event: SpeechRecognitionEvent) => {
      // interimTranscript = "";
      //   for (let i = event.resultIndex; i < event.results.length; i++) {
      //     if (event.results[i].isFinal) {
      //       finalTranscript += event.results[i][0].transcript;
      //       setTranscript(finalTranscript);
      //     } else {
      //       interimTranscript += event.results[i][0].transcript;
      //       setTranscript(interimTranscript);
      //     }
      //   }

      //   userSpeakingTimout();
      // };

      recognition.onerror = (event) => {
        console.error(
          `[ListeningContinous][${counter}] onerror ${event.error}`,
        );
        cleanup();
        setIsListening(false);
        reject(event.error);
      };

      recognition.onend = (event) => {
        console.log(
          `[ListeningContinous][${counter}] Stop listening autoStopped: ${autoStopped}`,
        );
        cleanup();
        setIsListening(false);

        // wait for audio track to finish
        recordingPromise.then((recording) => {
          resolve({
            text: lfinalTranscript.trim(),
            autoStopped: autoStopped,
            recording,
          });
        });
      };

      recognition.onspeechstart = () => {
        userSpeakingTimout();
      };

      recognition.onspeechend = () => {
        userSpeakingTimout();
      };

      console.log(`[ListeningContinous][${counter}] Start listening`);
      recognition.start();
      setIsListening(true);

      userSpeakingTimout();
    });
  };

  const startListeningAsyncAutoBreak = (
    length: number = -1,
    counter: number = -1,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Stop existing recognition if it is already running
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Initialise a new recognition object
      const recognition = new root.webkitSpeechRecognition();
      recognition.interimResults = options.interimResults || true;
      recognition.lang = language;
      // recognition.continuous = options.continuous || false;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;

      recognitionRef.current = recognition;

      // if ("webkitSpeechGrammarList" in window) {
      //   // const grammar =
      //   //   "#JSGF V1.0; grammar punctuation; public <punc> = . | , | ! | ; | : ;";
      //   const grammar =
      //     "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
      //   const speechRecognitionList = new root.webkitSpeechGrammarList();
      //   speechRecognitionList.addFromString(grammar, 1);
      //   recognition.grammars = speechRecognitionList;
      // }

      if (recognitionRef.current && !isListening) {
        // recognitionRef.current.onresult = (event) => {
        //   const transcript = Array.from(event.results)
        //     .map((result) => result[0])
        //     .map((result) => result.transcript)
        //     .join("");

        //   // resolve(transcript);
        // };

        recognitionRef.current.onresult = async (
          event: SpeechRecognitionEvent,
        ) => {
          let interimTranscript = "";
          let fTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              fTranscript = event.results[i][0].transcript;
              // DEV: console.log(`[Listening] Final: ${fTranscript}`);

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
          console.log(
            `[Listening][${counter}] error in listening: ${event.error}`,
          );
          setIsListening(false);
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

        // recognitionRef.current.soundstart = (event) => {
        //   console.log("Some Sound is being received", event);
        // };

        // recognitionRef.current.soundend = (event) => {
        //   console.log("Sound has stopped being received", event);
        // };

        // recognitionRef.current.onnomatch = (event) => {
        //   console.log(`No Match`, event);
        // };

        // recognitionRef.current.onaudiostart = (event) => {
        //   console.log("Audio capturing start", event);
        // };

        // recognitionRef.current.onaudioend = (event) => {
        //   console.log("Audio capturing ended", event);
        // };

        // recognitionRef.current.onspeechstart = (event) => {
        //   console.log("Speech has been detected", event);
        // };

        // recognitionRef.current.onspeechend = (event) => {
        //   console.log("Speech has stopped being detected", event);
        // };

        recognitionRef.current.start();
        console.log(`[Listening][${counter}] Started listening`);
        setIsListening((v) => {
          console.log(`[Listening][${counter}] Updated Speaking`);
          return true;
        });
        setTranscriptLength(length);
      } else {
        reject(
          new Error(
            "Speech recognition is already listening or not initialized.",
          ),
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
            console.log("[Listening] Permission already granted");
            setIsMicEnabled(true);
            resolve(granted);
          } else {
            resolve(granted);
          }
        } catch (error) {
          console.error(
            "[Listening] Error checking microphone permission",
            error,
          );
          reject(granted);
        }
      } else {
        resolve(granted);
      }
    });
  };

  const recordAudio = async (counter: number = -1): Promise<Recording> => {
    return new Promise<Recording>(async (resolve, reject) => {
      // Set up media recorder for audio capture
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
      }
      const mediaRecorder = new MediaRecorder(streamRef.current);
      let audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        DEV: console.log(`[Recording]${counter} Stopped`);
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioFile = new File([audioBlob], `recording-${Date.now()}.mp3`, {
          type: "audio/mp3",
        });

        // Create a download link
        // const downloadLink = document.createElement("a");
        // downloadLink.href = audioUrl;
        // downloadLink.text = "Download MP3";
        // downloadLink.download = audioFile.name;

        setAudioFiles((afs: File[]) => [...afs, audioFile]);

        // Trigger the download
        // document.body.appendChild(downloadLink);
        // downloadLink.click();
        // document.body.removeChild(downloadLink);

        DEV: console.log(
          `[Recording]${counter} MP3 file url: ${audioUrl}`,
          audioFile,
        );

        resolve({
          audioUrl,
          audioFile,
        });
      };

      // Start recording
      DEV: console.log(`[Recording]${counter} Started`);
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    });
  };

  const requestMicPermission = async (): Promise<boolean> => {
    let granted = false;
    const alreadyGranted = await checkIfAudioPermissionGranted();
    let endMessage = geti18nMessage("permissionsGranted");

    if (alreadyGranted) {
      granted = true;
    }

    return await root.navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        // stream.getTracks().forEach((track) => track.stop());
        setIsMicEnabled(true);
        granted = true;
        return granted;
      })
      .catch((err) => {
        console.error(
          "[Listening] Error requesting microphone permission",
          err,
        );
        granted = false;
        endMessage = geti18nMessage("permissionFailed");
        return granted;
      })
      .finally(async () => {
        setIsMicEnabled(granted);

        return new Promise<boolean>(async (resolve, reject) => {
          setTimeout(async () => {
            await speaki18nMessageAsync(
              endMessage,
              language,
              voice as SpeechSynthesisVoice,
            );
            resolve(granted);
          }, 1000);
        });
      });
  };

  const getUserResponseContinous = async (
    options: ListenConfig = ListenConfigDefaults,
  ): Promise<AudioResponse> => {
    let userResponse = "";
    let counter = 0;
    let autoStopped = false;
    let recording: Recording | null = null;

    // Get user response
    // while (userResponse === "" || autoStopped) {
    while (userResponse === "") {
      counter = counter + 1;

      userResponse = await startListeningContinous(
        options,
        userResponse,
        counter,
      )
        .then((sttResponse) => {
          autoStopped = sttResponse.autoStopped;
          recording = sttResponse.recording;
          return sttResponse.text;
        })
        .catch(async (error) => {
          console.error(error);
          if (error == "no-speech") {
            // nudge user to speak
            await speaki18nMessageAsync(
              noSpeech,
              language,
              voice as SpeechSynthesisVoice,
            );
          } else if (error == "aborted") {
            // india
            await delay(counter * 2000);
          } else {
            await delay(counter * 1000);
            console.error(
              `[Listening][[${counter}] Error getting user response`,
              error,
            );
          }
          return "";
        });
    }

    return {
      text: userResponse,
      autoStopped: autoStopped,
      recording,
    };
  };

  const getUserResponseAutoBreak = async (
    options: ListenConfig = ListenConfigDefaults,
  ): Promise<string> => {
    let userResponse = "";
    let counter = 0;

    let nudgeAfterAttempts = 0;

    // Get user response
    // while (userResponse === "" && (nudgeAfterAttempts ?? 0) < 2) {
    while (userResponse === "") {
      counter = counter + 1;
      userResponse = await startListeningAsyncAutoBreak(-1, counter).catch(
        async (error) => {
          console.error(error);
          if (error == "no-speech") {
            // ignore it
            nudgeAfterAttempts = (nudgeAfterAttempts ?? 0) + 1;

            // nudge user to speak
            if (nudgeAfterAttempts == 1) {
              await speaki18nMessageAsync(
                noSpeech,
                language,
                voice as SpeechSynthesisVoice,
              );
              nudgeAfterAttempts = 0;
            }
          } else {
            await delay(counter * 1000);
            console.error(
              `[Listening][${counter}] Error getting user response`,
              error,
            );
          }

          return "";
        },
      );
    }
    return userResponse;
  };

  return {
    isListening,
    isMicEnabled,
    transcript,
    finalTranscript,
    // startListening,
    startListeningContinous,
    stopListening,
    requestMicPermission,
    checkIfAudioPermissionGranted,
    getUserResponseContinous,
    getUserResponseAutoBreak,

    isSpeaking,
    speaki18nMessageAsync,
    speakMessageAsync,
    stopSpeaking,
  };
};

export default useSpeechToText;
