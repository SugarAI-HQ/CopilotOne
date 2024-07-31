import { Question, Translations } from "@sugar-ai/core";
// import { type Question, type Translations } from "@sugar-ai/copilot-one-js";

export const translations: Translations = {
  landingText: {
    en: "Experience Customer Satisfaction Survey with Our Multilingual Voice Form",
    hi: "हमारे बहुभाषी वॉइस फॉर्म के साथ ग्राहक संतुष्टि सर्वेक्षण का अनुभव करें।",
  },
  startButton: {
    en: "Start Survey",
    hi: "सर्वेक्षण शुरू करें",
  },
  welcome: {
    en: "Thanks for using our app! Please take a moment to give us your feedback.",
    hi: "हमारे ऐप का इस्तेमाल करने के लिए धन्यवाद! कृपया हमें अपनी प्रतिक्रिया देने के लिए कुछ समय निकालें।",
  },
  postSubmission: {
    en: "Thank you for your feedback! We appreciate your input.",
    hi: "आपकी प्रतिक्रिया के लिए धन्यवाद! हम आपकी राय की सराहना करते हैं।",
  },
};

export const questions: Question[] = [
  {
    id: "1",
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "How would you rate your overall satisfaction with our product?",
        hi: "आप हमारे प्रोडक्ट से कुल मिलाकर कितने संतुष्ट हैं?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Very Unsatisfied",
            hi: "बहुत असंतुष्ट",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Unsatisfied",
            hi: "असंतुष्ट",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Neutral",
            hi: "संतोषजनक",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Satisfied",
            hi: "संतुष्ट",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Very Satisfied",
            hi: "बहुत संतुष्ट",
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
        en: "How often do you usually use our product or service?",
        hi: "आप हमारे प्रोडक्ट/सर्विस का कितनी बार उपयोग करते हैं?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Daily",
            hi: "रोजाना",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Weekly",
            hi: "साप्ताहिक",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Monthly",
            hi: "मासिक",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Rarely",
            hi: "कभी-कभार",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "First time user",
            hi: "पहली बार उपयोग कर रहे हैं",
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
        en: "What could we have improved on today?",
        hi: "हम आज क्या सुधार कर सकते थे?",
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
