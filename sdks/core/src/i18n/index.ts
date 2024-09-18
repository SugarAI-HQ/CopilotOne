import { LanguageCode } from "~/schema";
import { Translations, i18nMessage } from "~/schema/message";

const NOT_FOUND = "not found";

export const FormTranslations: Translations = {
  permissionsGranted: {
    en: "Microphone permissions granted. You can now speak.",
    hi: "माइक्रोफोन अनुमतियाँ दी गईं। अब आप बोल सकते हैं।",
    "bn-IN": "মাইক্রোফোন অনুমতি দেওয়া হয়েছে। এখন আপনি কথা বলতে পারেন।",
    "te-IN": "మైక్రోఫోన్ అనుమతులు ఇవ్వబడ్డాయి. ఇప్పుడు మీరు మాట్లాడవచ్చు.",
    "mr-IN": "मायक्रोफोन अनुमती दिली गेली आहे. आपण आता बोलू शकता.",
    "ta-IN": "மைக்ரோபோன் அனுமதிகள் வழங்கப்பட்டுள்ளன. நீங்கள் இப்போது பேசலாம்.",
    "kn-IN": "ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಗಳು ನೀಡಲಾಗಿದೆ. ಈಗ ನೀವು ಮಾತನಾಡಬಹುದು.",
    "as-IN": "মাইক্ৰ'ফোনৰ অনুমতি দিয়া হৈছে। এতিয়া আপুনি কথা পাতিব পাৰে।",
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
    "kn-IN": "ದಯವಿಟ್ಟು ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಗಳನ್ನು ನೀಡಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    "as-IN": "অনুগ্ৰহ কৰি মাইক্ৰ'ফোনৰ অনুমতি দি পুনৰ চেষ্টা কৰক।",
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
    "kn-IN": "ಆಯ್ಕೆಮಾಡಿದ ಉತ್ತರವು",
    "as-IN": "নিৰ্বাচিত উত্তৰ হৈছে",
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
    "kn-IN": "ದಯವಿಟ್ಟು ಮೈಕ್ರೋಫೋನ್ ಅನುಮತಿಗಳನ್ನು ನೀಡಿ.",
    "as-IN": "অনুগ্ৰহ কৰি মাইক্ৰ'ফোনৰ অনুমতি দিয়ক।",
    es: "Por favor, da permisos de micrófono.",
    fr: "Veuillez donner les autorisations de microphone.",
    de: "Bitte geben Sie Mikrofonberechtigungen.",
    zh: "请授予麦克风权限。",
  },
  welcome: {
    en: "Welcome",
    hi: "स्वागत है",
    "bn-IN": "স্বাগতম",
    "te-IN": "స్వాగతం",
    "mr-IN": "स्वागत आहे",
    "ta-IN": "வரவேற்கிறேன்",
    "kn-IN": "ಸ್ವಾಗತ",
    "as-IN": "স্বাগতম",
    es: "Bienvenido",
    fr: "Bienvenue",
    de: "Willkommen",
    zh: "欢迎",
  },
  submit: {
    en: "Submit",
    hi: "जमा करें",
    "bn-IN": "জমা দিন",
    "te-IN": "సమర్పించండి",
    "mr-IN": "प्रस्तुत करा",
    "ta-IN": "சமர்ப்பிக்கவும்",
    "kn-IN": "ಸಲ್ಲಿಸು",
    "as-IN": "পঠিয়াওক",
    es: "Enviar",
    fr: "Soumettre",
    de: "Einreichen",
    zh: "提交",
  },
  noSpeech: {
    en: "Waiting for your answer. Please speak now.",
    hi: "कृपया अपना उत्तर बोलें।",
    "bn-IN": "আপনার উত্তরের অপেক্ষায়। দয়া করে এখন কথা বলুন।",
    "te-IN": "మీ సమాధానానికి వేచి ఉంది. దయచేసి ఇప్పుడే మాట్లాడండి.",
    "mr-IN": "तुमच्या उत्तराची वाट पाहत आहे. कृपया आत्ता बोला.",
    "ta-IN": "உங்கள் பதிலுக்காக காத்திருக்கிறது. தயவுசெய்து இப்போது பேசவும்.",
    "kn-IN": "ನಿಮ್ಮ ಉತ್ತರಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಈಗ ಮಾತನಾಡಿ.",
    "as-IN":
      "আপোনাৰ উত্তৰৰ বাবে অপেক্ষা কৰা হৈছে। অনুগ্ৰহ কৰি এতিয়া কথা পাতক।",
    es: "Esperando tu respuesta. Por favor, habla ahora.",
    fr: "En attente de votre réponse. Veuillez parler maintenant.",
    de: "Warten auf Ihre Antwort. Bitte sprechen Sie jetzt.",
    zh: "等待你的回答。请现在说话。",
  },
  validationFailed: {
    en: "Answer is not correct. Please try again.",
    hi: "उत्तर सही नहीं है। कृपया फिर से प्रयास करें।",
    "bn-IN": "উত্তর সঠিক নয়। দয়া করে আবার চেষ্টা করুন।",
    "te-IN": "సమాధానం సరైనది కాదు. దయచేసి మళ్లీ ప్రయత్నించండి.",
    "mr-IN": "उत्तर बरोबर नाही. कृपया पुन्हा प्रयत्न करा.",
    "ta-IN": "பதில் சரியாக இல்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
    "kn-IN": "ಉತ್ತರ ಸರಿಯಾಗಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    "as-IN": "উত্তৰ শুদ্ধ নহয়। অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",
    es: "La respuesta no es correcta. Por favor, inténtalo de nuevo.",
    fr: "La réponse n'est pas correcte. Veuillez réessayer.",
    de: "Die Antwort ist nicht korrekt. Bitte versuchen Sie es erneut.",
    zh: "答案不正确。请再试一次。",
  },
  selectLanguage: {
    en: "Select Language x",
    hi: "भाषा चुनें",
    "bn-IN": "ভাষা নির্বাচন করুন",
    "te-IN": "భాషను ఎంచుకోండి",
    "mr-IN": "भाषा निवडा",
    "ta-IN": "மொழியைத் தேர்ந்தெடுக்கவும்",
    "kn-IN": "ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "as-IN": "ভাষা বাচনি কৰক",
    es: "Seleccionar idioma",
    fr: "Sélectionner la langue",
    de: "Sprache auswählen",
    zh: "选择语言",
  },
  selectVoice: {
    en: "Select Voice",
    hi: "आवाज़ चुनें",
    "bn-IN": "কণ্ঠ নির্বাচন করুন",
    "te-IN": "శబ్దాన్ని ఎంచుకోండి",
    "mr-IN": "आवाज निवडा",
    "ta-IN": "குரலைத் தேர்ந்தெடுக்கவும்",
    "kn-IN": "ಸ್ವರವನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    "as-IN": "শব্দ বাচনি কৰক",
    es: "Seleccionar voz",
    fr: "Sélectionner la voix",
    de: "Stimme auswählen",
    zh: "选择语音",
  },
  close: {
    en: "Close",
    hi: "बंद करें",
    "bn-IN": "বন্ধ করুন",
    "te-IN": "మూసి వేయండి",
    "mr-IN": "बंद करा",
    "ta-IN": "மூடவும்",
    "kn-IN": "ಮುಚ್ಚಿ",
    "as-IN": "বন্ধ কৰক",
    es: "Cerrar",
    fr: "Fermer",
    de: "Schließen",
    zh: "关闭",
  },
};

export function geti18nMessage(
  key: string,
  translations: Translations = FormTranslations,
): i18nMessage {
  const translation = translations[key];
  if (!translation) {
    throw new Error(`translations for "${key}" not found`);
  }
  const msg: i18nMessage = {
    // mode: "manual",
    lang: translation,
    // voice: true,
    // output: "none",
  };

  return msg;
}

export const i18n = (key: string, language: LanguageCode): string => {
  return extracti18nText(geti18nMessage(key), language);
};

export const extracti18nText = (
  message: i18nMessage,
  language: LanguageCode,
) => {
  const userLang: LanguageCode = language.split("-")[0] as LanguageCode;
  let text = NOT_FOUND;
  // text = message?.lang[language] ?? (message?.lang[userLang] as string);
  text =
    message?.lang[language] ||
    (message?.lang[userLang] as string) ||
    (message?.lang["en"] as string);
  if (text == NOT_FOUND) {
    console.error(
      `i18n message not found for ${language}: ${JSON.stringify(message)}`,
    );
  }
  return text;
};
