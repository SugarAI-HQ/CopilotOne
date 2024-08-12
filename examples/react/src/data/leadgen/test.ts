import {
  Question,
  i18nMessage,
  Translations,
  LanguageCode,
} from "@sugar-ai/core";

export const languagesEnabled: LanguageCode[] = ["en", "hi"];

export const translations: Translations = {
  welcome: {
    en: "Welcome to test. Please answer the questions to book an appointment",
    hi: "हेल्थफिक्स में आपका स्वागत है। अपॉइंटमेंट बुक करने के लिए प्रश्नों का उत्तर दें।",
  },
  postSubmission: {
    en: "Thank you for sharing the details. We will send the details of your appointment on your phone.",
    hi: "विवरण के लिए धन्यवाद। आपका अपॉइंटमेंट बुक कर लिया गया है, आपको एसएमएस पर विवरण मिलेगा।",
  },
};

export const questions: Question[] = [
  {
    question_type: "single_choice",
    question_text: {
      // mode: "manual",
      lang: {
        en: "What is the capital of France?",
        hi: "फ्रांस की राजधानी क्या है?",
      },
      // voice: true,
      // output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Paris",
            hi: "पारिस",
          },
          // mode: "manual",
          // voice: true,
          // output: "none",
        },
        {
          lang: {
            en: "London",
            hi: "लोंडन",
          },
          // mode: "manual",
          // voice: true,
          // output: "none",
        },
        {
          lang: {
            en: "Berlin",
            hi: "बर्लिन",
          },
          // mode: "manual",
          // voice: true,
          // output: "none",
        },
        {
          lang: {
            en: "Madrid",
            hi: "मद्देश",
          },
          // mode: "manual",
          // voice: true,
          // output: "none",
        },
      ],
    },
    validation: {},
  },
  // Add more questions as needed
];
