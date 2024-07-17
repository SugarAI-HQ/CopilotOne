import React, { useRef, useState } from "react";
import Onboarding from "./Onboarding";
import VoiceQuestion from "./VoiceQuestion";
import Submission from "./Submission";
import {
  Question,
  VoiceConfig,
  VoiceConfigDefault,
  i18Message,
} from "@/schema/quizSchema";
import { speakMessage } from "@/helpers/voice";
import StreamingText, { StreamingTextRef } from "./StreamingText";
import Streamingi18Text, { Streamingi18TextRef } from "./Streamingi18Text";

const questions: Question[] = [
  {
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        // en: "Hi, How are you doing, tell me you your name, I will be used for your quiz.",
        en: "Tell me your name.",
        hi: "आपका नाम दर्ज करें",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      max_chars: 100,
    },
    validation: {},
  },
  {
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "Enter your age",
        hi: "आपका उम्र दर्ज करें",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      max_chars: 100,
    },
    validation: {},
  },
  {
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "What is the capital of France?",
        hi: "फ्रांस की राजधानी क्या है?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Paris",
            hi: "पारिस",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "London",
            hi: "लोंडन",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Berlin",
            hi: "बर्लिन",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Madrid",
            hi: "मद्देश",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
      ],
    },
    validation: {},
  },
  // Add more questions as needed
];

const Quiz: React.FC<{ voiceConfig: VoiceConfig }> = ({ voiceConfig }) => {
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<any[]>([]);

  const handleOnboardingComplete = () => {
    setStep(1);
  };

  const handleQuestionComplete = (answer: any) => {
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
          onComplete={() => handleOnboardingComplete}
          welcomeMessage="Welcome to the quiz!"
        />
      )}
      {step > 0 && step <= questions.length && (
        <VoiceQuestion
          question={questions[step - 1]}
          onComplete={() =>
            handleQuestionComplete({
              question: questions[step - 1],
              answer: "User Answer",
            })
          }
          voiceConfig={voiceConfig}
        />
      )}
      {step > questions.length && <Submission answers={answers} />}
    </div>
  );
};

export default Quiz;

const ParentComponentx = () => {
  const streamingTextRef = useRef<StreamingTextRef>(null);

  const triggerStreaming = () => {
    if (streamingTextRef.current) {
      streamingTextRef.current.startStreaming();
    }
  };

  return (
    <div>
      <StreamingText
        ref={streamingTextRef}
        message="Hello, welcome to the streaming text and speech synthesis example."
      />
      <button onClick={triggerStreaming}>Start button</button>
    </div>
  );
};

const ParentComponent = () => {
  const streamingTextRef = useRef<Streamingi18TextRef>(null);

  const triggerStreaming = () => {
    if (streamingTextRef.current) {
      streamingTextRef.current.startStreaming();
    }
  };

  const msg: i18Message = {
    mode: "manual",
    lang: {
      en: "Hola, welcome to the streaming text and speech synthesis example.",
      hi: "नमस्ते, स्वागत है कि स्ट्रीज और संवाद सीखें।",
    },
  };

  return (
    <div>
      <Streamingi18Text
        ref={streamingTextRef}
        message={msg}
        voiceConfig={VoiceConfigDefault}
      />
      <button onClick={triggerStreaming}>Start button</button>
    </div>
  );
};
