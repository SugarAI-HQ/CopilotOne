import {
  Question,
  i18nMessage,
  Translations,
  LanguageCode,
} from "@sugar-ai/core";

export const formId = "69930ab7-525e-45ee-8f90-625b2acc36c7";

export const languagesEnabled: LanguageCode[] = ["en", "hi"];

export const translations: Translations = {
  landingText: {
    en: "Welcome to the Meditation Survey. Your responses will help us understand your needs better.",
    hi: "मेडिटेशन सर्वेक्षण में आपका स्वागत है। आपके जवाब हमें आपकी जरूरतों को बेहतर समझने में मदद करेंगे।",
  },
  startButton: {
    en: "Start Survey",
    hi: "सर्वेक्षण शुरू करें",
  },
  welcome: {
    en: "Please answer the following questions to help us understand your meditation habits and challenges.",
    hi: "कृपया निम्नलिखित प्रश्नों का उत्तर दें ताकि हम आपके मेडिटेशन के आदतों और चुनौतियों को समझ सकें।",
  },
  postSubmission: {
    en: "Thank you for completing the survey. Your feedback is valuable to us.",
    hi: "सर्वेक्षण पूरा करने के लिए धन्यवाद। आपकी प्रतिक्रिया हमारे लिए महत्वपूर्ण है।",
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
    validation: {
      max_length: 100,
    },
  },
  {
    id: "2",
    question_type: "text",
    question_text: {
      lang: {
        en: "What is your age?",
        hi: "आपकी उम्र क्या है?",
      },
    },
    question_params: {},
    evaluation: "ai",
    validation: {
      max_length: 3,
    },
  },
  {
    id: "3",
    question_type: "text",
    question_text: {
      lang: {
        en: "Which city do you live in?",
        hi: "आप किस शहर में रहते हैं?",
      },
    },
    question_params: {},
    evaluation: "ai",
    validation: {
      max_length: 50,
    },
  },
  {
    id: "4",
    question_type: "text",
    question_text: {
      lang: {
        en: "What is your  phone number?",
        hi: "आपका फोन नंबर क्या है?",
      },
    },
    question_params: {},
    validation: {
      max_length: 50,
      validators: ["mobile"],
    },
  },
  {
    id: "5",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What is your current role?",
        hi: "आपकी वर्तमान भूमिका क्या है?",
      },
    },
    question_params: {
      options: [
        { lang: { en: "Student", hi: "छात्र" } },
        { lang: { en: "Business Owner", hi: "व्यवसाय मालिक" } },
        { lang: { en: "Homemaker", hi: "गृहिणी" } },
        {
          lang: {
            en: "Top Management at Work",
            hi: "कार्यस्थल पर शीर्ष प्रबंधन",
          },
        },
        {
          lang: {
            en: "Mid Management at Work",
            hi: "कार्यस्थल पर मध्य प्रबंधन",
          },
        },
        { lang: { en: "Entry Level at Work", hi: "कार्यस्थल पर प्रवेश स्तर" } },
        { lang: { en: "Currently Unemployed", hi: "वर्तमान में बेरोजगार" } },
      ],
    },
    evaluation: "ai",
    validation: {
      max_length: 50,
    },
  },
  {
    id: "6",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What is your gender?",
        hi: "आपका लिंग क्या है?",
      },
    },
    question_params: {
      options: [
        { lang: { en: "Male", hi: "पुरुष" } },
        { lang: { en: "Female", hi: "महिला" } },
        { lang: { en: "Other", hi: "अन्य" } },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "7",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "How long have you been practicing meditation?",
        hi: "आप कितने समय से और कितनी बार मेडिटेशन कर रहे हैं?",
      },
    },
    question_params: {
      options: [
        { lang: { en: "1 to 3 months", hi: "1 से 3 महीने" } },
        { lang: { en: "4 to 12 months", hi: "4 से 12 महीने" } },
        { lang: { en: "More than 12 months", hi: "12 महीने से अधिक" } },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "7.1",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "how frequently have you been practicing meditation?",
        hi: "आप  कितनी बार मेडिटेशन कर रहे हैं?",
      },
    },
    question_params: {
      options: [
        { lang: { en: "Everyday", hi: "हर दिन" } },
        { lang: { en: "4 to 5 times a week", hi: "सप्ताह में 4 से 5 बार" } },
        { lang: { en: "2 to 3 times a week", hi: "सप्ताह में 2 से 3 बार" } },
        {
          lang: {
            en: "At least once a week",
            hi: "कम से कम सप्ताह में एक बार",
          },
        },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "8",
    question_type: "multiple_choice",
    question_text: {
      lang: {
        en: "What was your motivation to start meditating?",
        hi: "मेडिटेशन शुरू करने की आपकी प्रेरणा क्या थी?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Reduce Stress & Anxiety",
            hi: "तनाव और चिंता को कम करना",
          },
        },
        {
          lang: {
            en: "Enhance Sleep Quality",
            hi: "नींद की गुणवत्ता में सुधार",
          },
        },
        {
          lang: {
            en: "Improve Focus and Attention",
            hi: "ध्यान और फोकस में सुधार",
          },
        },
        { lang: { en: "Improve Relationships", hi: "संबंधों में सुधार" } },
        {
          lang: {
            en: "Increase productivity and creativity",
            hi: "उत्पादकता और रचनात्मकता बढ़ाना",
          },
        },
        { lang: { en: "Depression", hi: "अवसाद" } },
        {
          lang: {
            en: "Physical and Mental Health",
            hi: "शारीरिक और मानसिक स्वास्थ्य",
          },
        },
        { lang: { en: "Something else", hi: "कुछ और" } },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "9",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What made you skip your meditation in the past?",
        hi: "पिछले दिनों आपने मेडिटेशन क्यों छोड़ा?",
      },
    },
    question_params: {
      options: [
        { lang: { en: "Time constraints", hi: "समय की कमी" } },
        {
          lang: {
            en: "Did not see immediate results",
            hi: "तुरंत परिणाम नहीं दिखे",
          },
        },
        {
          lang: {
            en: "Did not find a place to meditate",
            hi: "मेडिटेशन के लिए जगह नहीं मिली",
          },
        },
        {
          lang: {
            en: "Physical or mental discomfort",
            hi: "शारीरिक या मानसिक असुविधा",
          },
        },
        { lang: { en: "Lack of guidance", hi: "मार्गदर्शन की कमी" } },
        {
          lang: {
            en: "I don’t skip my meditation sessions",
            hi: "मैं मेडिटेशन सत्र नहीं छोड़ता",
          },
        },
        { lang: { en: "Something else", hi: "कुछ और" } },
      ],
    },
    validation: {
      max_length: 50,
    },
  },
  {
    id: "10",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What are a few life conflicts you have faced in the recent past?",
        hi: "हाल ही में आपने कौन से जीवन संघर्षों का सामना किया है?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Career and work conflicts",
            hi: "करियर और काम के संघर्ष",
          },
        },
        { lang: { en: "Relationship issues", hi: "संबंधित मुद्दे" } },
        { lang: { en: "Grief and loss", hi: "शोक और हानि" } },
        {
          lang: {
            en: "Balancing responsibilities",
            hi: "ज़िम्मेदारियों को संतुलित करना",
          },
        },
        { lang: { en: "Financial struggles", hi: "वित्तीय संघर्ष" } },
        { lang: { en: "Health issues", hi: "स्वास्थ्य समस्याएं" } },
        {
          lang: {
            en: "Unhealthy/sedentary lifestyle",
            hi: "अस्वस्थ/बैठे रहने वाला जीवनशैली",
          },
        },
        { lang: { en: "None", hi: "कोई नहीं" } },
      ],
    },

    validation: {
      max_length: 50,
    },
  },
  {
    id: "11",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What are the emotional challenges you are facing lately?",
        hi: "आप हाल ही में किन भावनात्मक चुनौतियों का सामना कर रहे हैं?",
      },
    },
    question_params: {
      options: [
        { lang: { en: "Loneliness", hi: "अकेलापन" } },
        { lang: { en: "Fear & anxiety", hi: "डर और चिंता" } },
        { lang: { en: "Sorrow and grief", hi: "दुख और शोक" } },
        { lang: { en: "Depression", hi: "अवसाद" } },
        { lang: { en: "Self-esteem issues", hi: "आत्म-सम्मान की समस्याएं" } },
        {
          lang: {
            en: "No emotional challenges as such",
            hi: "कोई विशेष भावनात्मक चुनौतियाँ नहीं",
          },
        },
      ],
    },
    evaluation: "ai",
    validation: {
      max_length: 50,
    },
  },
  {
    id: "12",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What do you do to deal with these challenges?",
        hi: "इन चुनौतियों से निपटने के लिए आप क्या करते हैं?",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Talk to a counselor/therapist",
            hi: "परामर्शदाता/चिकित्सक से बात करें",
          },
        },
        {
          lang: { en: "Talk to family/friend", hi: "परिवार/मित्र से बात करें" },
        },
        {
          lang: {
            en: "Engaging in hobbies/interests",
            hi: "शौक/रुचियों में संलग्न",
          },
        },
        {
          lang: {
            en: "Follow healthy routine (yoga, nutritional food etc.)",
            hi: "स्वस्थ दिनचर्या का पालन करें (योग, पौष्टिक भोजन आदि)",
          },
        },
        { lang: { en: "Meditate", hi: "मेडिटेशन" } },
        { lang: { en: "Substance use", hi: "मादक पदार्थों का उपयोग" } },
        { lang: { en: "Excessive food or sleep", hi: "अत्यधिक भोजन या नींद" } },
        {
          lang: { en: "Consume content online", hi: "ऑनलाइन सामग्री का उपभोग" },
        },
      ],
    },
    evaluation: "ai",
    validation: {
      max_length: 200,
    },
  },
  {
    id: "13",
    question_type: "text",
    question_text: {
      lang: {
        en: "What is the one thing we should do to help you meditate consistently?",
        hi: "हमें आपके नियमित रूप से मेडिटेशन करने में मदद करने के लिए क्या करना चाहिए?",
      },
    },
    question_params: {},
    evaluation: "none",
    validation: {
      max_length: 200,
    },
  },
];
