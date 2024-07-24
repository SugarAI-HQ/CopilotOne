import React, { useRef, useState } from "react";
import Onboarding from "./Onboarding";
import VoiceQuestion from "./VoiceQuestion";
import Submission from "./Submission";
import { i18Message } from "~/react/schema/message";
import { Question, FormConfig, FormConfigDefaults } from "~/react/schema/form";
import "~/react/styles/form.css";
import { getQueryParams } from "~/helpers/url";

export const VoiceForm: React.FC<{
  showStartButton: boolean;
  welcomeMessage: i18Message;
  postSubmissionMessage: i18Message;
  questions: Question[];
  formConfig: FormConfig;
}> = ({
  showStartButton,
  welcomeMessage,
  postSubmissionMessage,
  questions,
  formConfig = FormConfigDefaults,
}) => {
  const initialStep = parseInt(getQueryParams("step") || "0");
  const currentFromConfig = { ...FormConfigDefaults, ...formConfig };
  const [step, setStep] = useState<number>(initialStep);
  const [answers, setAnswers] = useState<any[]>([]);

  const handleOnboardingComplete = () => {
    setStep((step) => {
      return step + 1;
    });
  };

  const handleQuestionComplete = (answer: any) => {
    // return;
    setAnswers([...answers, answer]);
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  //   const message =
  //     "Hello, welcome to the streaming text and speech synthesis example.";
  //   return (
  //     <ParentComponent></ParentComponent>
  //     // <div className="app">
  //     //   <StreamingText message={message} />
  //     // </div>
  //   );

  return (
    <div className="container mx-auto p-4">
      {step === 0 && (
        <Onboarding
          showStartButton={showStartButton}
          onComplete={handleOnboardingComplete}
          welcomeMessage={welcomeMessage}
          formConfig={currentFromConfig}
        />
      )}
      {step > 0 &&
        step <= questions.length &&
        questions.map(
          (question, index) =>
            index == step - 1 && (
              <VoiceQuestion
                key={index}
                question={question}
                onAnswered={(answer) =>
                  handleQuestionComplete({
                    question: questions[step - 1],
                    answer: answer,
                  })
                }
                onSkip={() =>
                  handleQuestionComplete({
                    question: questions[step - 1],
                    answer: "User Answer",
                  })
                }
                formConfig={currentFromConfig}
              />
            ),
        )}
      {step > questions.length && (
        <Submission
          postSubmissionMessage={postSubmissionMessage}
          answers={answers}
          formConfig={currentFromConfig}
        />
      )}
    </div>
  );
};

export default VoiceForm;

// const ParentComponentx = () => {
//   const streamingTextRef = useRef<StreamingTextRef>(null);

//   const triggerStreaming = () => {
//     if (streamingTextRef.current) {
//       streamingTextRef.current.startStreaming();
//     }
//   };

//   return (
//     <div>
//       <StreamingText
//         ref={streamingTextRef}
//         message="Hello, welcome to the streaming text and speech synthesis example."
//       />
//       <button onClick={triggerStreaming}>Start button</button>
//     </div>
//   );
// };

// const ParentComponent = () => {
//   const streamingTextRef = useRef<Streamingi18TextRef>(null);

//   const triggerStreaming = () => {
//     if (streamingTextRef.current) {
//       streamingTextRef.current.startStreaming();
//     }
//   };

//   const msg: i18Message = {
//     mode: "manual",
//     lang: {
//       en: "Hola, welcome to the streaming text and speech synthesis example.",
//       hi: "नमस्ते, स्वागत है कि स्ट्रीज और संवाद सीखें।",
//     },
//     voice: true,
//     output: "none",
//   };

//   return (
//     <div>
//       <Streamingi18Text
//         ref={streamingTextRef}
//         message={msg}
//         formConfig={currentFromConfig}
//       />
//       <button onClick={triggerStreaming}>Start button</button>
//     </div>
//   );
// };
