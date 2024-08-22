import {
  Question,
  i18nMessage,
  Translations,
  LanguageCode,
} from "@sugar-ai/core";

export const languagesEnabled: LanguageCode[] = ["en", "hi"];

export const translations: Translations = {
  landingText: {
    en: "Customer Support Job Form",
    hi: "कस्टमर सपोर्ट जॉब फॉर्म",
  },
  startButton: {
    en: "Submit Your Details",
    hi: "डिटेल्स सबमिट करें",
  },
  welcome: {
    en: "Thanks for applying for Customer Support Executive at Sugar AI. Please provide the following details for screening of the next round.",
    hi: "Sugar AI में Customer Support Executive के लिए आवेदन करने के लिए धन्यवाद। कृपया अगले चरण की स्क्रीनिंग के लिए विवरण प्रदान करें।",
  },
  postSubmission: {
    en: "Thank you for sharing the details. Our team will get back to you with further details.",
    hi: "डिटेल्स के लिए धन्यवाद। हमारी टीम आपसे जल्द ही संपर्क करेगी।",
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
    validation: {
      max_length: 100,
    },
    qualification: {
      type: "ai",
      criteria: "",
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
    qualification: {
      type: "ai",
      criteria: "",
    },
  },
  {
    id: "3",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "Which languages do you know?",
        hi: "आप कौन-कौन सी भाषाएँ जानते हैं?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "English",
            hi: "अंग्रेज़ी",
          },
        },
        {
          lang: {
            en: "Hindi",
            hi: "हिन्दी",
          },
        },
        {
          lang: {
            en: "Both English and Hindi",
            hi: "दोनों, अंग्रेज़ी और हिन्दी",
          },
        },
      ],
    },
    validation: {
      max_length: 50,
    },
    qualification: {
      type: "ai",
      criteria: "",
    },
  },
  {
    id: "4",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "Are you comfortable working on an incentive-based calling system?",
        hi: "क्या आप इंसेंटिव आधारित कॉलिंग में काम करने के लिए तैयार हैं?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Yes",
            hi: "हां",
          },
        },
        {
          lang: {
            en: "No",
            hi: "नहीं",
          },
        },
      ],
    },
    validation: {
      max_length: 50,
    },
    qualification: {
      type: "ai",
      criteria: "",
    },
  },
  {
    id: "5",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "When are you available to join the job?",
        hi: "आप इस काम को कब से जॉइन कर सकते हैं?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Immediate",
            hi: "तुरंत",
          },
        },
        {
          lang: {
            en: "Within 15 days",
            hi: "15 दिनों के भीतर",
          },
        },
        {
          lang: {
            en: "15 to 30 days",
            hi: "15 से 30 दिनों के बीच",
          },
        },
        {
          lang: {
            en: "More than 30 days",
            hi: "30 दिनों से अधिक",
          },
        },
      ],
    },
    validation: {
      max_length: 50,
    },
    qualification: {
      type: "ai",
      criteria: "",
    },
  },
  {
    id: "6",
    question_type: "text",
    question_text: {
      lang: {
        en: "Describe your previous experience in phone calling or customer support.",
        hi: "फ़ोन कॉलिंग या ग्राहक सहायता में अपने पिछले अनुभव का वर्णन करें।",
      },
    },
    qualification: {
      type: "manual",
      criteria: "previous_experience",
    },
    question_params: {},
    validation: {
      max_length: 500,
    },
  },
];
