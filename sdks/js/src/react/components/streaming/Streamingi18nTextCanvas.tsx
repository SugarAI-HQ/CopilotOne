// import React, {
//   useEffect,
//   useRef,
//   useImperativeHandle,
//   forwardRef,
//   useState,
// } from "react";
// import { stopSpeaking, speakMessageAsync } from "@/helpers/voice"; // Ensure the speakMessage function is properly imported
// import { useLanguage } from "./LanguageContext";
// import {
//   LanguageCode,
//   Streamingi18nTextProps,
//   Streamingi18nTextRef,
// } from "@/schema/voiceFormSchema";

// const Streamingi18nText: React.ForwardRefRenderFunction<
//   Streamingi18nTextRef,
//   Streamingi18nTextProps
// > = ({ message, formConfig }, ref) => {
//   const { language, voice } = useLanguage();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
//   const [isStarted, setIsStarted] = useState<boolean>(false);

//   const userLang: LanguageCode = language.split("-")[0] as LanguageCode;

//   const getText = () => {
//     return (
//       message?.lang[language] ??
//       (message?.lang[userLang] as string) ??
//       "not found"
//     );
//   };

//   const streamRender = async (text: string, characterPerSec: number = 40) => {
//     if (!canvasRef.current) return;
//     const ctx = canvasRef.current.getContext("2d");
//     if (!ctx) return;

//     const characters = text.split("");
//     const duration = 1000 / characterPerSec; // Duration per character in milliseconds

//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     ctx.font = "16px Arial";
//     ctx.fillStyle = "black";

//     for (let i = 0; i < characters.length; i++) {
//       await new Promise<void>((resolve) => {
//         setTimeout(() => {
//           const metrics = ctx.measureText(characters.slice(0, i + 1).join(""));
//           ctx.clearRect(
//             0,
//             0,
//             canvasRef.current.width,
//             canvasRef.current.height
//           );
//           ctx.fillText(characters.slice(0, i + 1).join(""), 10, 50);
//           resolve();
//         }, duration * i);
//       });
//     }
//   };

//   const speakAndRender = async () => {
//     const text = getText();
//     setIsSpeaking(true);

//     return Promise.all([
//       streamRender(text, formConfig?.characterPerSec).catch((err) =>
//         console.log(err)
//       ),
//       speakMessageAsync(text, language, voice as SpeechSynthesisVoice).catch(
//         (err) => console.log(err)
//       ),
//     ]).finally(() => {
//       setIsSpeaking(false);
//     });
//   };

//   const handleStart = async () => {
//     if (isStarted) {
//       return;
//     }

//     setIsStarted(true);

//     focusElement();

//     return speakAndRender()
//       .catch((err) => {
//         console.log(err);
//       })
//       .finally(() => {
//         unfocusElement();
//       });
//   };

//   const focusElement = () => {
//     if (canvasRef.current) {
//       canvasRef.current.focus();
//       canvasRef.current.classList.add("highlight");
//     }
//   };

//   const unfocusElement = () => {
//     if (canvasRef.current) {
//       canvasRef.current.classList.remove("highlight");
//     }
//   };

//   useImperativeHandle(ref, () => ({
//     startStreaming: handleStart,
//     focusElement: focusElement,
//     unfocusElement: unfocusElement,
//   }));

//   useEffect(() => {
//     return () => {
//       stopSpeaking();
//       setIsSpeaking(false);
//     };
//   }, []);

//   return (
//     <div className="streaming-text" onClick={handleStart}>
//       <canvas
//         ref={canvasRef}
//         tabIndex={-1}
//         className={`whitespace-pre-wrap ${false ? "highlight" : ""}`}
//         width={500}
//         height={100}
//         onFocus={() => canvasRef.current?.classList.add("highlight")}
//         onBlur={() => canvasRef.current?.classList.remove("highlight")}
//       ></canvas>
//       <style jsx>{`
//         .highlight {
//           outline: none;
//           border: 2px solid yellow;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default forwardRef(Streamingi18nText);
