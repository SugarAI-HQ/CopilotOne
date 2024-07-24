import { Question, i18Message } from "@sugar-ai/core";

export const welcomeMessage: i18Message = {
  mode: "manual",
  lang: {
    // en: "Welcome to Healthfix, To book the appointment, please help me with the following details.",
    en: "Welcome to Healthfix. Please answer the questions to book an appointment",
    hi: "हेल्थफिक्स में आपका स्वागत है। अपॉइंटमेंट बुक करने के लिए प्रश्नों का उत्तर दें।",
  },
  voice: true,
  output: "none",
};

export const postSubmissionMessage: i18Message = {
  mode: "manual",
  lang: {
    en: "Thank you for sharing the details. We will send the details of your appointment on your phone.",
    hi: "विवरण के लिए धन्यवाद। आपका अपॉइंटमेंट बुक कर लिया गया है, आपको एसएमएस पर विवरण मिलेगा।",
  },
  voice: true,
  output: "none",
};

export const questions: Question[] = [
  {
    id: "1",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        // en: "Hi, How are you doing, tell me you your name, I will be used for your quiz.",
        en: "What is your name.",
        hi: "आपका नाम क्या है?",
      },
      voice: true,
      output: "none",
    },
    question_params: {},
    validation: {
      max_length: 100,
    },
  },
  {
    id: "2",
    question_type: "number",
    question_text: {
      mode: "manual",
      lang: {
        // en: "Hi, How are you doing, tell me you your name, I will be used for your quiz.",
        en: "Tell me your phone number.",
        hi: "मुझे अपना फोन नंबर बताएं।",
      },
      voice: true,
      output: "none",
    },
    question_params: {},
    validation: {
      max_length: 20,
    },
  },

  {
    id: "3",
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        // en: "On a scale of 1 - 5 (5 being worst), What is the intensity of your pain?",
        en: "On a scale of 1 to 5 (5 being worst), how would you rate the intensity of your pain?",
        // hi: "1 से 5 के पैमाने पर (5 सबसे खराब होने पर), आपको कितना दर्द हो रहा है?",
        hi: "1 से 5 के पैमाने पर (5 सबसे खराब), आप अपने दर्द की तीव्रता को कैसे रेट करेंगे?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Very Mild",
            hi: "बहुत हल्का",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Slight Pain",
            hi: "थोड़ा दर्द",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Moderate Pain",
            hi: "मध्यम दर्द",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Quite Severe",
            hi: "काफी गंभीर",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "Extremely Severe",
            hi: "अत्यंत गंभीर",
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
    id: "4",
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "How long have you been experiencing the problem?",
        hi: "आप इस समस्या का अनुभव कब से कर रहे हैं?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Less than 15 days",
            hi: "15 दिन से कम",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "15 to 30 days",
            hi: "15 से 30 दिन",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "1 to 6 months",
            hi: "1 से 6 महीने",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "6 to 12 months",
            hi: "6 से 12 महीने",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "More than a year",
            hi: "1 साल से अधिक",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "5",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "What's your age ?",
        hi: "आपकी उम्र कितने साल है?",
      },
      voice: true,
      output: "none",
    },
    question_params: {},
    validation: {
      max_length: 50,
    },
  },
  {
    id: "6",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "What is your occupation?",
        hi: "आप क्या काम करते हैं?",
      },
      voice: true,
      output: "none",
    },
    question_params: {},
    validation: {
      max_length: 50,
    },
  },
  {
    id: "7",
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "Please explain your current problem. Mention the pain, affected areas etc.",
        hi: "आप अपने दर्द और समस्या के बारे में बताएं",
      },
      voice: true,
      output: "none",
    },
    question_params: {},
    validation: {
      max_length: 200,
    },
  },
  // Add more questions as needed
];
