import {
  Question,
  i18nMessage,
  Translations,
  LanguageCode,
} from "@sugar-ai/core";

export const languagesEnabled: LanguageCode[] = ["en", "hi"];

export const translations: Translations = {
  landingText: {
    en: "Welcome to Get Fit. Get guidance from our experienced Doctors for any Pain related problems",
    hi: "Get Fit में आपका स्वागत है! किसी भी दर्द के लिए हमारे अनुभवी डॉक्टर्स से सलाह लें ",
  },
  startButton: {
    en: "Book an Appointment",
    hi: "अपॉइंटमेंट बुक करें",
  },
  welcome: {
    en: "Please answer the questions. It will help us to find the right doctor for your problem",
    hi: "कृपया सवालों का जवाब दें। इससे हमें आपकी समस्या के लिए सही डॉक्टर ढूँढने में मदद मिलेगी।",
  },
  postSubmission: {
    en: "Thank you for sharing the details. Our team will get back to you with further details.",
    hi: "डिटेल्स के लिए धन्यवाद। हमारी टीम आपसे जल्द ही संपर्क करेगी",
  },
};

export const questions: Question[] = [
  {
    id: "1",
    question_type: "text",
    question_text: {
      lang: {
        en: "What is your name?",
        hi: "आपका नाम क्या है?",
      },
    },
    question_params: {},
    evaluation: "ai",
    // evalyuation: "none",
    validation: {
      max_length: 100,
    },
  },
  {
    id: "2",
    question_type: "text",
    question_text: {
      lang: {
        en: "Tell me your phone number.",
        hi: "मुझे अपना फोन नंबर बताएं।",
      },
    },
    question_params: {},
    validation: {
      max_length: 20,
      validators: ["mobile"],
    },
  },
  {
    id: "3",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "How long have you been experiencing the problem?",
        hi: "आप इस समस्या का अनुभव कब से कर रहे हैं?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Less than 15 days",
            hi: "15 दिन से कम",
          },
        },
        {
          lang: {
            en: "15 to 30 days",
            hi: "15 से 30 दिन",
          },
        },
        {
          lang: {
            en: "1 to 6 months",
            hi: "1 महीने से 6 महीने",
          },
        },
        {
          lang: {
            en: "6 to 12 months",
            hi: "6 से 12 महीने",
          },
        },
        {
          lang: {
            en: "More than a year",
            hi: "1 साल से अधिक",
          },
        },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "4",
    question_type: "text",
    question_text: {
      lang: {
        en: "Please explain your current problem. Mention the pain, affected areas etc.",
        hi: "आप अपने दर्द और समस्या के बारे में बताएं",
      },
    },
    question_params: {},
    evaluation: "none",
    validation: {
      max_length: 200,
    },
  },
  {
    id: "5",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What will the most convenient time for the treatment of your pain?",
        hi: "आपके दर्द के इलाज के लिए सबसे सुविधाजनक समय क्या होगा?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "7 AM to 10 AM",
            hi: "7 बजे से 10 बजे तक",
          },
        },
        {
          lang: {
            en: "10 AM to 5 PM",
            hi: "10 बजे से 5 बजे तक",
          },
        },
        {
          lang: {
            en: "5 PM to 8 PM",
            hi: "5 बजे से 8 बजे तक",
          },
        },
        {
          lang: {
            en: "Any other time",
            hi: "कोई और समय",
          },
        },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
];
