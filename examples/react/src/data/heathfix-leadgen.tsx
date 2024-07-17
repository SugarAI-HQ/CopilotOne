import { Question, i18Message, i18MessageSchema } from "@/schema/quizSchema";

export const welcomeMessage: i18Message = {
  mode: "manual",
  lang: {
    // en: "Welcome to Healthfix, To book the appointment, please help me with the following details.",
    en: "Welcome to Healthfix",
    hi: "नमस्ते, आपका स्वागत है, मैं आपका नाम दर्ज करना चाहता हूँ और आपका प्रश्न संपर्क करना चाहता हूँ।",
  },
  voice: true,
  output: "none",
};

export const questions: Question[] = [
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
        // en: "Hi, How are you doing, tell me you your name, I will be used for your quiz.",
        en: "Tell me your phone number.",
        hi: "आपका फोन नंबर दर्ज करें",
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
        en: "One a scale of 1 - 5 (5 being worst), What is the intensity of your pain?",
        hi: "एक स्केल में 1-5 से अधिक (5 या बड़ा) आपकी मृत्यु की गति क्या है?",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      options: [
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
      ],
    },
    validation: {},
  },
  {
    question_type: "multiple_choice",
    question_text: {
      mode: "manual",
      lang: {
        en: "How long have you been experiencing the problem",
        hi: "आपका मृत्यु से समय की संख्या कैसे है?",
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
            en: "15-30 days",
            hi: "15-30 दिन",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "1-6 months",
            hi: "1-6 महीने",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "6-12 months",
            hi: "6-12 महीने",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
        {
          lang: {
            en: "More than a year",
            hi: "1 वर्ष से अधिक",
          },
          mode: "manual",
          voice: true,
          output: "none",
        },
      ],
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
    question_type: "text",
    question_text: {
      mode: "manual",
      lang: {
        en: "Occupation",
        hi: "व्यवसाय",
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
        en: "Please describe your current problem",
        hi: "कृपया अपनी वर्तमान समस्या का वर्णन करें।",
      },
      voice: true,
      output: "none",
    },
    question_params: {
      max_chars: 120,
    },
    validation: {},
  },
  // Add more questions as needed
];
