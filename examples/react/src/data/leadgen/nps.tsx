import { Question, Translations } from "@sugar-ai/core";

export const translations: Translations = {
  landingText: {
    en: "Experience NPS with Our Multilingual Voice Form",
    hi: "हमारे बहुभाषी वॉइस फॉर्म के साथ एनपीएस अनुभव करें।",
  },
  startButton: {
    en: "Take NPS Survey",
    hi: "एनपीएस सर्वे करें",
  },
  welcome: {
    en: "Thanks for using our service.",
    hi: "हमारी सर्विस यूज़ करने के लिए धन्यवाद! कुछ सवालों का जवाब देकर हमें अपनी राय दें।",
  },
  postSubmission: {
    en: "Thank you for sharing your feedback. We appreciate your input.",
    hi: "आपके फीडबैक के लिए धन्यवाद! हम आपकी राय की कदर करते हैं।",
  },
};

export const questions: Question[] = [
  {
    id: "1",
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "On a scale of 0 to 10, how likely are you to recommend our product/service to a friend or colleague?",
        hi: "0 से 10 के बीच, आप हमारे प्रोडक्ट/सर्विस को अपने दोस्त या सहकर्मी को कितना recommend करेंगे?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "0 (Not at all likely)",
            hi: "0 (बिल्कुल भी नहीं)",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "1",
            hi: "1",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "2",
            hi: "2",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "3",
            hi: "3",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "4",
            hi: "4",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "5",
            hi: "5",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "6",
            hi: "6",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "7",
            hi: "7",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "8",
            hi: "8",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "9",
            hi: "9",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "10 (Extremely likely)",
            hi: "10 (बहुत ज़्यादा)",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
      ],
    },
    validation: {
      max_length: 100,
    },
  },
  {
    id: "2",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "What is the primary reason for your score?",
        hi: "आपके इस स्कोर का मुख्य कारण क्या है?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [],
    },
    validation: {
      max_length: 500,
    },
  },
  {
    id: "3",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "How can we improve our product/service to better meet your needs?",
        hi: "हम अपने प्रोडक्ट/सर्विस को आपकी जरूरतों के हिसाब से कैसे सुधार सकते हैं?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [],
    },
    validation: {
      max_length: 500,
    },
  },
];
