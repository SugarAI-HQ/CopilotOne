import { Translations, i18nMessage } from "~/schema/message";

export const FormTranslations: Translations = {
  permissionsGranted: {
    en: "Microphone permissions granted. You can now speak.",
    hi: "माइक्रोफोन अनुमतियाँ दी गईं। अब आप बोल सकते हैं।",
    "bn-IN": "মাইক্রোফোন অনুমতি দেওয়া হয়েছে। এখন আপনি কথা বলতে পারেন।",
    "te-IN": "మైక్రోఫోన్ అనుమతులు ఇవ్వబడ్డాయి. ఇప్పుడు మీరు మాట్లాడవచ్చు.",
    "mr-IN": "मायक्रोफोन अनुमती दिली गेली आहे. आपण आता बोलू शकता.",
    "ta-IN": "மைக்ரோபோன் அனுமதிகள் வழங்கப்பட்டுள்ளன. நீங்கள் இப்போது பேசலாம்.",
    es: "Permisos de micrófono concedidos. Ahora puedes hablar.",
    fr: "Permissions de microphone accordées. Vous pouvez maintenant parler.",
    de: "Mikrofonberechtigungen erteilt. Sie können jetzt sprechen.",
    zh: "麦克风权限已授予。你现在可以说话了。",
  },
  permissionFailed: {
    en: "Please try again by giving microphone permissions.",
    hi: "कृपया माइक्रोफोन अनुमतियाँ देकर पुनः प्रयास करें।",
    "bn-IN": "অনুগ্রহ করে মাইক্রোফোন অনুমতি দিয়ে আবার চেষ্টা করুন।",
    "te-IN": "దయచేసి మైక్రోఫోన్ అనుమతులు ఇచ్చి మరలా ప్రయత్నించండి.",
    "mr-IN": "कृपया मायक्रोफोन अनुमती देऊन पुन्हा प्रयत्न करा.",
    "ta-IN": "தயவுசெய்து மைக்ரோபோன் அனுமதிகளை வழங்கி மீண்டும் முயற்சிக்கவும்.",
    es: "Inténtalo de nuevo dando permisos de micrófono.",
    fr: "Veuillez réessayer en donnant les autorisations de microphone.",
    de: "Bitte versuchen Sie es erneut, indem Sie Mikrofonberechtigungen erteilen.",
    zh: "请通过授予麦克风权限再试一次。",
  },
  selectedAnswer: {
    en: "Selected Answer is",
    hi: "चयनित उत्तर है",
    "bn-IN": "নির্বাচিত উত্তর হল",
    "te-IN": "ఎంచుకున్న సమాధానం ఇది",
    "mr-IN": "निवडलेला उत्तर आहे",
    "ta-IN": "தேர்ந்தெடுக்கப்பட்ட பதில்",
    es: "La respuesta seleccionada es",
    fr: "La réponse sélectionnée est",
    de: "Die ausgewählte Antwort ist",
    zh: "选择的答案是",
  },
  requestMicPermissions: {
    en: "Please give microphone permissions.",
    hi: "कृपया माइक्रोफ़ोन की अनुमतियाँ दें।",
    "bn-IN": "অনুগ্রহ করে মাইক্রোফোন অনুমতি দিন।",
    "te-IN": "దయచేసి మైక్రోఫోన్ అనుమతులు ఇవ్వండి.",
    "mr-IN": "कृपया मायक्रोफोनला अनुमती द्या.",
    "ta-IN": "தயவுசெய்து மைக்ரோபோன் அனுமதிகளை வழங்கவும்.",
    es: "Por favor, da permisos de micrófono.",
    fr: "Veuillez donner les autorisations de microphone.",
    de: "Bitte geben Sie Mikrofonberechtigungen.",
    zh: "请授予麦克风权限。",
  },
  noSpeech: {
    en: "Waiting for your answer. Please speak now.",
    hi: "कृपया अपना उत्तर बोलें।",
    "bn-IN": "আপনার উত্তরের অপেক্ষায়। দয়া করে এখন কথা বলুন।",
    "te-IN": "మీ సమాధానానికి వేచి ఉంది. దయచేసి ఇప్పుడే మాట్లాడండి.",
    "mr-IN": "तुमच्या उत्तराची वाट पाहत आहे. कृपया आत्ता बोला.",
    "ta-IN": "உங்கள் பதிலுக்காக காத்திருக்கிறது. தயவுசெய்து இப்போது பேசவும்.",
    es: "Esperando tu respuesta. Por favor, habla ahora.",
    fr: "En attente de votre réponse. Veuillez parler maintenant.",
    de: "Warten auf Ihre Antwort. Bitte sprechen Sie jetzt.",
    zh: "等待你的回答。请现在说话。",
  },
};

export function geti18nMessage(
  key: string,
  translations: Translations = FormTranslations,
) {
  const translation = translations[key];
  if (!translation) {
    throw new Error(`translations for "${key}" not found`);
  }
  const msg: i18nMessage = {
    mode: "manual",
    lang: translation,
    voice: true,
    output: "none",
  };

  return msg;
}
