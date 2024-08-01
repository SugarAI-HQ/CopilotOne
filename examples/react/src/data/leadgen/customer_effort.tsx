import { LanguageCode, Question, Translations } from "@sugar-ai/core";

export const languagesEnabled: LanguageCode[] = ["en", "hi"];

export const translations: Translations = {
  landingText: {
    en: "Experience Customer Effort Survey with Our Multilingual Voice Form",
    hi: "हमारे बहुभाषी वॉइस फॉर्म के साथ ग्राहक प्रयास सर्वेक्षण का अनुभव करें।",
  },
  startButton: {
    en: "Start Survey",
    hi: "सर्वेक्षण शुरू करें",
  },
  welcome: {
    en: "Thank you for using our app! We'd love to hear about your experience.",
    hi: "हमारी ऐप का इस्तेमाल करने के लिए धन्यवाद! आपके अनुभव के बारे में हमें बताएं।",
  },
  postSubmission: {
    en: "Thanks for your feedback! We're committed to improving your experience.",
    hi: "आपके फीडबैक के लिए धन्यवाद! हम आपके अनुभव को बेहतर बनाने के लिए प्रयास करेंगे।",
  },
};

export const questions: Question[] = [
  {
    id: "1",
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "Based on your most recent experience, how easy or difficult was it to interact with our company?",
        hi: "आपके हालिया अनुभव के आधार पर, हमारी कंपनी के साथ इंटरैक्ट करना कितना आसान या मुश्किल था?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Very Difficult",
            hi: "बहुत मुश्किल",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Somewhat Difficult",
            hi: "थोड़ा मुश्किल",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Neutral",
            hi: "तटस्थ",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Somewhat Easy",
            hi: "थोड़ा आसान",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Very Easy",
            hi: "बहुत आसान",
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
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "Were you able to accomplish your goal?",
        hi: "क्या आप अपना लक्ष्य पूरा कर पाए?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Yes",
            hi: "हाँ",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "No",
            hi: "नहीं",
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
    id: "3",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "How could we make your experience with us better?",
        hi: "हम आपकी अनुभव को और बेहतर कैसे बना सकते हैं?",
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
