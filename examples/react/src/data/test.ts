import { Question } from "@/schema/voiceFormSchema";

export const questions: Question[] = [
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
