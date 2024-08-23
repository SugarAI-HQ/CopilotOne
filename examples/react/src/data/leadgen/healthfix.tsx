import { LanguageCode, Question, Translations } from "@sugar-ai/core";

// export const languagesEnabled: LanguageCode[] = ["en", "hi"];

export const formId = "292885b3-efed-4ce9-846f-21f1e50275a0";

export const languagesEnabled: LanguageCode[] = [
  "en",
  "hi",
  "bn-IN",
  "te-IN",
  "mr-IN",
  "ta-IN",
  "es",
  "fr",
  "de",
  "zh",
];

export const translations: Translations = {
  landingText: {
    en: "Experience Lead Generation with Our Multilingual Voice Form",
    hi: "हमारे वॉइस फॉर्म से लीड जनरेशन करें।",
    "bn-IN": "আমাদের ভয়েস ফর্ম দিয়ে লিড জেনারেশন করুন।",
    "te-IN": "మా వాయిస్ ఫారంతో లీడ్ జనరేషన్ చేయండి.",
    "mr-IN": "आमच्या व्हॉइस फॉर्मसह लीड जनरेशन करा.",
    "ta-IN": "எங்கள் குரல் படிவத்தைப் பயன்படுத்தி லீட் ஜெனரேஷன் செய்யுங்கள்.",
    es: "Experimente la generación de clientes potenciales con nuestro formulario de voz multilingüe.",
    fr: "Découvrez la génération de leads avec notre formulaire vocal multilingue.",
    de: "Erleben Sie Lead-Generierung mit unserem mehrsprachigen Sprachformular.",
    zh: "通过我们的多语言语音表单体验潜在客户生成。",
  },
  startButton: {
    en: "Book Appointment",
    hi: "अपॉइंटमेंट बुक करें",
    "bn-IN": "অ্যাপয়েন্টমেন্ট বুক করুন",
    "te-IN": "అపాయింట్మెంట్ బుక్ చేయండి",
    "mr-IN": "अपॉइंटमेंट बुक करा",
    "ta-IN": "நியமனத்தைப் பதிவு செய்யுங்கள்",
    es: "Reservar Cita",
    fr: "Prendre rendez-vous",
    de: "Termin buchen",
    zh: "预约",
  },
  welcome: {
    en: "Welcome to Healthfix. Please answer the questions to book an appointment",
    hi: "हेल्थफिक्स में आपका स्वागत है। अपॉइंटमेंट बुक करने के लिए प्रश्नों का उत्तर दें।",
    "bn-IN":
      "হেলথফিক্সে স্বাগতম। অ্যাপয়েন্টমেন্ট বুক করতে অনুগ্রহ করে প্রশ্নগুলির উত্তর দিন।",
    "te-IN":
      "హెల్త్ఫిక్స్‌కు స్వాగతం. అపాయింట్మెంట్ బుక్ చేయడానికి దయచేసి ప్రశ్నలకు సమాధానం చెప్పండి.",
    "mr-IN":
      "हेल्थफिक्समध्ये आपले स्वागत आहे. अपॉइंटमेंट बुक करण्यासाठी कृपया प्रश्नांची उत्तरे द्या.",
    "ta-IN":
      "ஹெல்த்ஃபிக்சுக்கு வரவேற்கிறோம். நியமனத்தைப் பதிவு செய்ய இந்தக் கேள்விகளுக்கு பதிலளிக்கவும்.",
    es: "Bienvenido a Healthfix. Por favor, responda las preguntas para reservar una cita",
    fr: "Bienvenue chez Healthfix. Veuillez répondre aux questions pour prendre rendez-vous",
    de: "Willkommen bei Healthfix. Bitte beantworten Sie die Fragen, um einen Termin zu buchen",
    zh: "欢迎来到Healthfix。请回答问题以预约",
  },
  postSubmission: {
    en: "Thank you for sharing the details. We will send the details of your appointment on your phone.",
    hi: "विवरण के लिए धन्यवाद। आपका अपॉइंटमेंट बुक कर लिया गया है, आपको एसएमएस पर विवरण मिलेगा।",
    "bn-IN":
      "বিবরণ শেয়ার করার জন্য আপনাকে ধন্যবাদ। আমরা আপনার ফোনে আপনার অ্যাপয়েন্টমেন্টের বিবরণ পাঠাব।",
    "te-IN":
      "వివరాలను పంచుకున్నందుకు ధన్యవాదాలు. మీ అపాయింట్మెంట్ వివరాలను మీ ఫోన్లో పంపిస్తాము.",
    "mr-IN":
      "तपशील शेअर केल्याबद्दल धन्यवाद. आम्ही आपल्या फोनवर आपल्या अपॉइंटमेंटचा तपशील पाठवू.",
    "ta-IN":
      "விவரங்களைப் பகிர்ந்ததற்கு நன்றி. உங்கள் போனில் உங்கள் நியமன விவரங்களை நாங்கள் அனுப்புவோம்.",
    es: "Gracias por compartir los detalles. Enviaremos los detalles de su cita a su teléfono.",
    fr: "Merci d'avoir partagé les détails. Nous vous enverrons les détails de votre rendez-vous sur votre téléphone.",
    de: "Vielen Dank für die Angaben. Wir senden Ihnen die Details Ihres Termins auf Ihr Telefon.",
    zh: "感谢您分享详细信息。我们会将您的预约详情发送到您的手机上。",
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
        "bn-IN": "তোমার নাম কি?",
        "te-IN": "మీ పేరు ఏమిటి?",
        "mr-IN": "तुझं नाव काय?",
        "ta-IN": "உங்கள் பெயர் என்ன?",
        es: "¿Cuál es tu nombre?",
        fr: "Quel est votre nom?",
        de: "Wie heißen Sie?",
        zh: "你叫什么名字？",
      },
    },
    question_params: {},
    qualification: {
      type: "ai",
      criteria: "Must match a valid name format",
    },
    validation: {
      max_length: 100,
      validators: [],
    },
    order: 1,
  },
  {
    id: "2",
    question_type: "number",
    question_text: {
      lang: {
        en: "Tell me your phone number.",
        hi: "मुझे अपना फोन नंबर बताएं।",
        "bn-IN": "আপনার ফোন নম্বর বলুন।",
        "te-IN": "మీ ఫోన్ నంబర్ చెప్పండి.",
        "mr-IN": "मला तुमचा फोन नंबर सांगा.",
        "ta-IN": "உங்கள் தொலைபேசி எண்ணை சொல்லுங்கள்.",
        es: "Dime tu número de teléfono.",
        fr: "Dites-moi votre numéro de téléphone.",
        de: "Sagen Sie mir Ihre Telefonnummer.",
        zh: "告诉我你的电话号码。",
      },
    },
    question_params: {},
    qualification: {
      type: "ai",
      criteria: "Must be a valid phone number",
    },
    validation: {
      max_length: 20,
      validators: ["mobile"],
    },
    order: 2,
  },
  {
    id: "3",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "What is the intensity of your pain?",
        hi: "आप अभी कितना दर्द महसूस कर रहे हैं?",
        "bn-IN": "আপনার ব্যথার তীব্রতা কত?",
        "te-IN": "మీ నొప్పి తీవ్రత ఎంత?",
        "mr-IN": "आपण किती वेदना अनुभवत आहात?",
        "ta-IN": "உங்கள் வலி எவ்வளவு?",
        es: "¿Cuál es la intensidad de su dolor?",
        fr: "Quelle est l'intensité de votre douleur?",
        de: "Wie stark ist Ihr Schmerz?",
        zh: "你的疼痛程度如何？",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Very Mild",
            hi: "बहुत हल्का",
            "bn-IN": "খুব হালকা",
            "te-IN": "చాలా మృదువైనది",
            "mr-IN": "अत्यंत सौम्य",
            "ta-IN": "மிக மிக மெதுவானது",
            es: "Muy leve",
            fr: "Très doux",
            de: "Sehr mild",
            zh: "非常轻微",
          },
        },
        {
          lang: {
            en: "Slight Pain",
            hi: "थोड़ा दर्द",
            "bn-IN": "হালকা ব্যথা",
            "te-IN": "తేలికపాటి నొప్పి",
            "mr-IN": "थोडा त्रास",
            "ta-IN": "சிறிது வலி",
            es: "Dolor leve",
            fr: "Légère douleur",
            de: "Leichter Schmerz",
            zh: "轻微疼痛",
          },
        },
        {
          lang: {
            en: "Moderate Pain",
            hi: "मध्यम दर्द",
            "bn-IN": "মাঝারি ব্যথা",
            "te-IN": "మోస్తరు నొప్పి",
            "mr-IN": "मध्यम वेदना",
            "ta-IN": "மிதமான வலி",
            es: "Dolor moderado",
            fr: "Douleur modérée",
            de: "Mäßiger Schmerz",
            zh: "中度疼痛",
          },
        },
        {
          lang: {
            en: "Severe Pain",
            hi: "काफ़ी गंभीर दर्द",
            "bn-IN": "তীব্র ব্যথা",
            "te-IN": "తీవ్ర నొప్పి",
            "mr-IN": "गंभीर वेदना",
            "ta-IN": "கடுமையான வலி",
            es: "Dolor severo",
            fr: "Douleur sévère",
            de: "Starke Schmerzen",
            zh: "剧烈疼痛",
          },
        },
        {
          lang: {
            en: "Very Severe Pain",
            hi: "बहुत ज्यादा गंभीर दर्द",
            "bn-IN": "খুব তীব্র ব্যথা",
            "te-IN": "చాలా తీవ్ర నొప్పి",
            "mr-IN": "अत्यंत गंभीर वेदना",
            "ta-IN": "மிகவும் கடுமையான வலி",
            es: "Dolor muy severo",
            fr: "Douleur très sévère",
            de: "Sehr starke Schmerzen",
            zh: "非常剧烈的疼痛",
          },
        },
      ],
    },
    qualification: {
      type: "ai",
      criteria:
        "Ensure the selected option corresponds to the user's reported pain level",
    },
    validation: {
      max_length: 100,
      validators: [],
    },
    order: 3,
  },
  {
    id: "4",
    question_type: "single_choice",
    question_text: {
      lang: {
        en: "How long have you been experiencing the problem?",
        hi: "आप इस समस्या का अनुभव कब से कर रहे हैं?",
        "bn-IN": "আপনি কতদিন ধরে এই সমস্যার সম্মুখীন হচ্ছেন?",
        "te-IN": "మీరు ఈ సమస్యను ఎంతకాలంగా అనుభవిస్తున్నారో చెప్పండి?",
        "mr-IN": "तुम्ही किती दिवसांपासून या समस्येला तोंड देत आहात?",
        "ta-IN":
          "நீங்கள் எவ்வளவு காலமாக இந்த பிரச்சினையை அனுபவித்து வருகிறீர்கள்?",
        es: "¿Cuánto tiempo lleva experimentando el problema?",
        fr: "Depuis combien de temps ressentez-vous ce problème?",
        de: "Wie lange haben Sie das Problem schon?",
        zh: "您经历这个问题有多长时间了？",
      },
    },
    question_params: {
      options: [
        {
          lang: {
            en: "Less than 15 days",
            hi: "15 दिन से कम",
            "bn-IN": "১৫ দিনের কম",
            "te-IN": "15 రోజులకు తక్కువ",
            "mr-IN": "१५ दिवसांपेक्षा कमी",
            "ta-IN": "15 நாட்களுக்கும் குறைவாக",
            es: "Menos de 15 días",
            fr: "Moins de 15 jours",
            de: "Weniger als 15 Tage",
            zh: "少于15天",
          },
        },
        {
          lang: {
            en: "15 to 30 days",
            hi: "15 से 30 दिन",
            "bn-IN": "১৫ থেকে ৩০ দিন",
            "te-IN": "15 నుండి 30 రోజులు",
            "mr-IN": "१५ ते ३० दिवस",
            "ta-IN": "15 முதல் 30 நாட்கள்",
            es: "15 a 30 días",
            fr: "15 à 30 jours",
            de: "15 bis 30 Tage",
            zh: "15至30天",
          },
        },
        {
          lang: {
            en: "1 to 6 months",
            hi: "1 से 6 महीने",
            "bn-IN": "১ থেকে ৬ মাস",
            "te-IN": "1 నుండి 6 నెలలు",
            "mr-IN": "१ ते ६ महिने",
            "ta-IN": "1 முதல் 6 மாதங்கள்",
            es: "1 a 6 meses",
            fr: "1 à 6 mois",
            de: "1 bis 6 Monate",
            zh: "1到6个月",
          },
        },
        {
          lang: {
            en: "6 to 12 months",
            hi: "6 से 12 महीने",
            "bn-IN": "৬ থেকে ১২ মাস",
            "te-IN": "6 నుండి 12 నెలలు",
            "mr-IN": "६ ते १२ महिने",
            "ta-IN": "6 முதல் 12 மாதங்கள்",
            es: "6 a 12 meses",
            fr: "6 à 12 mois",
            de: "6 bis 12 Monate",
            zh: "6到12个月",
          },
        },
        {
          lang: {
            en: "More than a year",
            hi: "1 साल से अधिक",
            "bn-IN": "১ বছরের বেশি",
            "te-IN": "ఒక సంవత్సరం కంటే ఎక్కువ",
            "mr-IN": "१ वर्षाहून अधिक",
            "ta-IN": "ஒரு வருடத்திற்கு மேல்",
            es: "Más de un año",
            fr: "Plus d'un an",
            de: "Mehr als ein Jahr",
            zh: "一年以上",
          },
        },
      ],
    },
    qualification: {
      type: "ai",
      criteria: "Answer must align with the reported duration of the issue",
    },
    validation: {
      max_length: 50,
      validators: [],
    },
    order: 4,
  },
  {
    id: "5",
    question_type: "text",
    question_text: {
      // mode: "manual",
      lang: {
        en: "What's your age?",
        hi: "आपकी उम्र कितने साल है?",
        "bn-IN": "আপনার বয়স কত?",
        "te-IN": "మీ వయసు ఎంత?",
        "mr-IN": "तुमचे वय किती आहे?",
        "ta-IN": "உங்கள் வயது என்ன?",
        es: "¿Cuál es tu edad?",
        fr: "Quel âge avez-vous?",
        de: "Wie alt sind Sie?",
        zh: "你多大了？",
      },
      // voice: true,
      // output: "none",
    },
    qualification: {
      type: "none",
      criteria: "Answer must align with the user's reported age",
    },
    question_params: {},
    validation: {
      max_length: 50,
      validators: [],
    },
    order: 4,
  },
  {
    id: "6",
    question_type: "text",
    question_text: {
      // mode: "manual",
      lang: {
        en: "What is your occupation?",
        hi: "आप क्या काम करते हैं?",
        "bn-IN": "আপনি কি কাজ করেন?",
        "te-IN": "మీరు ఏమి చేస్తారు?",
        "mr-IN": "आपण काय करता?",
        "ta-IN": "நீங்கள் என்ன வேலை செய்கிறீர்கள்?",
        es: "¿Cuál es tu ocupación?",
        fr: "Quelle est votre profession?",
        de: "Was machen Sie beruflich?",
        zh: "你是做什么工作的？",
      },
      // voice: true,
      // output: "none",
    },
    question_params: {},
    qualification: {
      type: "ai",
      criteria: "Respondent should provide their current occupation clearly",
    },

    validation: {
      max_length: 50,
      validators: [],
    },
    order: 5,
  },
  {
    id: "7",
    question_type: "text",
    question_text: {
      // mode: "manual",
      lang: {
        en: "Please explain your current problem. Mention the pain, affected areas etc.",
        hi: "आप अपने दर्द और समस्या के बारे में बताएं",
        "bn-IN":
          "আপনার বর্তমান সমস্যার ব্যাখ্যা করুন। ব্যথা, ক্ষতিগ্রস্থ অঞ্চল উল্লেখ করুন ইত্যাদি।",
        "te-IN":
          "మీ ప్రస్తుత సమస్యను వివరించండి. నొప్పి, ప్రభావిత ప్రాంతాలు మొదలైనవి.",
        "mr-IN": "तुमची सध्याची समस्या स्पष्ट करा. वेदना, प्रभावित भाग इ.",
        "ta-IN":
          "உங்கள் தற்போதைய பிரச்சினையை விளக்கவும். வலி, பாதிக்கப்பட்ட பகுதிகளைப் குறிப்பிடவும்.",
        es: "Explique su problema actual. Mencione el dolor, las áreas afectadas, etc.",
        fr: "Veuillez expliquer votre problème actuel. Mentionnez la douleur, les zones touchées, etc.",
        de: "Bitte erklären Sie Ihr aktuelles Problem. Erwähnen Sie den Schmerz, betroffene Bereiche usw.",
        zh: "请解释您的当前问题。提及疼痛、受影响的区域等。",
      },
      // voice: true,
      // output: "none",
    },
    question_params: {},
    qualification: {
      type: "ai",
      criteria:
        "Must provide a clear description of the pain and affected areas, and must be in the context of the current problem",
    },
    validation: {
      max_length: 200,
      validators: [],
    },
    order: 6,
  },
];
