import { z } from "zod";
import { i18nMessageSchema, i18nMessage } from "./message";
import { languageCode } from "./lang";
import { copilotStyleVoiceButtonSchema } from "./copilot";

export const listenConfig = z.object({
  maxAnswerLength: z.number().default(-1),
  userNoSpeechTimeout: z.number().default(30000), // User have not spoken any single word
  // userNoSpeechNudgeAfter: z.number().default(2), // no of retries in case of no speech
  userPauseTimeout: z.number().default(5000), // User is speaking but take a pause in between

  record: z.boolean().default(false),
});

export type ListenConfig = z.infer<typeof listenConfig>;

export const ListenConfigDefaults = {
  record: false,
  maxAnswerLength: -1,
  userNoSpeechTimeout: 30000, // User have not spoken any single word
  userNoSpeechRetry: 2,
  userPauseTimeout: 5000, // User is speaking but take a pause in between
};

export const CharcterPerSec = 20;

export const formConfig = z.object({
  // id: z.string(),
  // userId: z.string().optional(),

  characterPerSec: z.number().optional().default(CharcterPerSec),
  // lang: z.string().optional().default("auto"),
  // defaultLang: z.string().optional().default("en"),
  listen: listenConfig,

  voiceButton: copilotStyleVoiceButtonSchema.optional(),
});
export type FormConfig = z.infer<typeof formConfig>;

export const FormConfigDefaults: FormConfig = {
  // id: "",
  characterPerSec: CharcterPerSec,

  // maxAnswerLength
  listen: ListenConfigDefaults,
};

export const formFieldValidator = z.enum(["mobile"]);
export type FormFieldValidator = z.infer<typeof formFieldValidator>;

export const questionType = z.enum([
  "single_choice",
  "multiple_choice",
  "text",
  "number",
]);
export type QuestionType = z.infer<typeof questionType>;

export const validationType = z.enum(["none", "ai"]);
export type ValidationType = z.infer<typeof validationType>;

export const qualificationType = z.enum(["none", "ai", "manual"]);
export type QualificationType = z.infer<typeof qualificationType>;

export const QualificationSegmentsDefaults = ["low", "mid", "high"];
export const qualificationSegment = z.array(z.string());
export type QualificationSegment = z.infer<typeof qualificationSegment>;

export const questionSchema = z.object({
  id: z.string(),
  question_type: questionType,
  question_text: i18nMessageSchema,
  question_params: z
    .object({
      options: z.array(i18nMessageSchema).optional(),
    })
    .passthrough(),
  validation: z
    .object({
      type: validationType.default(validationType.Enum.ai),
      criteria: z.string().optional(),
      // evaluation: z.boolean().optional().default(true),
      max_length: z.number().default(120),
      validators: z.array(formFieldValidator).default([]),
    })
    .passthrough(),
  qualification: z.object({
    type: qualificationType.default(qualificationType.Enum.ai),
    segments: qualificationSegment.default(QualificationSegmentsDefaults),
    criteria: z.string().optional(),
  }),
  order: z.number().optional(),
  active: z.boolean().default(true),
});
export type Question = z.infer<typeof questionSchema>;

export const streamingi18nTextSchema = z.object({
  auto: z.boolean().optional(),
  message: i18nMessageSchema.optional(),
  messageKey: z.string().optional(),
  formConfig: formConfig.optional(),
  // beforeSpeak: z.function().optional(),
  // afterSpeak: z.function().optional(),
  klasses: z.string().optional(),
  style: z.any().optional(),
  beforeSpeak: z.function().args().returns(z.promise(z.any())).optional(),
  afterSpeak: z.function().args().returns(z.promise(z.any())).optional(),
});
export type Streamingi18nTextProps = z.infer<typeof streamingi18nTextSchema>;

// Define the Streamingi18nTextRef schema
export const StreamingTextRefSchema = z.object({
  startStreaming: z.function().returns(z.void()),
  focusElement: z.function().returns(z.void()),
});

// Define the TypeScript type based on the Zod schema
export type Streamingi18nTextRef = z.infer<typeof StreamingTextRefSchema>;

export const aiEvaluationResponse = z.object({
  answer: z.string(),
  followupQuestion: z.string().nullable(),
  followupResponse: z.string().nullable(),
  qualificationScore: z.string().nullable(),
  qualificationSummary: z.string().nullable(),
});

// Recording Schema
export const recording = z.object({
  audioUrl: z.string(),
  audioFile: z.instanceof(File),
});

// AudioResponse
export const audioResponse = z.object({
  text: z.string(),
  autoStopped: z.boolean(),
  recording: recording.nullable(),
});

// QuestionEvaluation
export const questionEvaluation = z.object({
  userResponse: audioResponse,
  aiResponse: aiEvaluationResponse,
});

// Exporting the type inferred from Zod schemas
export type Recording = z.infer<typeof recording>;
export type AiEvaluationResponse = z.infer<typeof aiEvaluationResponse>;
export type AudioResponse = z.infer<typeof audioResponse>;
export type QuestionEvaluation = z.infer<typeof questionEvaluation>;

export const voiceFormStates = z.enum([
  "none",
  "listening",
  "evaluating",
  "speaking",
  "waiting",
]);
export type VoiceFormStates = z.infer<typeof voiceFormStates>;

export const streamingi18nHtmlSchema = z.object({
  message: i18nMessageSchema,
  messageKey: z.string().optional(),
  formConfig: formConfig.optional(),
  // beforeSpeak: z.function().optional(),
  // afterSpeak: z.function().optional(),
  htmlTag: z.string().optional().default("div"),
  customStyle: z.string().optional().default(""),
  beforeSpeak: z.function().args().returns(z.promise(z.any())).optional(),
  afterSpeak: z.function().args().returns(z.promise(z.any())).optional(),
});
export type Streamingi18nHtmlProps = z.infer<typeof streamingi18nHtmlSchema>;

// Define the Streamingi18nHtmlRef schema
export const StreamingHtmlRefSchema = z.object({
  startStreaming: z.function().returns(z.void()),
  focusElement: z.function().returns(z.void()),
});

export type Streamingi18nHtmlRef = z.infer<typeof StreamingHtmlRefSchema>;

export const formMessageType = z.enum(["welcome", "submit"]);

export type FormMessageType = z.infer<typeof formMessageType>;

// export const formMessages = z.record(formMessageType, i18nMessageSchema);
export const formMessages = z.object({
  welcome: i18nMessageSchema,
  submit: i18nMessageSchema,
});

export type FormMessages = z.infer<typeof formMessages>;

export const voiceForm = z.object({
  id: z.string(),
  name: z.string(),
  description: i18nMessageSchema,
  startButtonText: i18nMessageSchema,

  questions: z.array(questionSchema),
  messages: formMessages,

  languages: z.array(languageCode),
  formConfig: formConfig,
});
export type VoiceForm = z.infer<typeof voiceForm>;

export const answeredBy = z.enum(["voice", "keyboard"]);
export type AnsweredBy = z.infer<typeof answeredBy>;

// Question answer
// 1. raw audio
// 2. transcribed text
// 3. ai processed text
// Eithre raw audio is captured or transcribed text,
// atleast one of them should be present
export const questionAnswer = z
  .object({
    recording: recording.nullable(),
    rawAnswer: z.string().nullable(),
    evaluatedAnswer: z.string().nullable(),
    by: answeredBy,
    qualificationScore: z.string().nullable(),
    qualificationSummary: z.string().nullable(),
  })
  .refine(
    (data) => data.recording || data.evaluatedAnswer || data.rawAnswer, // At least one of recording or rawAnswer must be present
    {
      message:
        "Either recording or rawAnswer or evaluatedAnswer must be provided.",
      path: ["recording", "rawAnswer", "evaluatedAnswer"], // These are the paths that will be checked
    },
  );
export type QuestionAnswer = z.infer<typeof questionAnswer>;

export const defaultFormTranslations = {
  description: {
    en: "Please fill out this form.",
    "pt-BR": "Por favor, preencha este formulário.",
    hi: "कृपया इस फॉर्म को भरें।",
    "bn-IN": "এই ফর্মটি পূরণ করুন।",
    "te-IN": "దయచేసి ఈ ఫారాన్ని పూరించండి.",
    "mr-IN": "कृपया हा फॉर्म भरा.",
    "ta-IN": "தயவுசெய்து இந்த படிவத்தை நிரப்பவும்.",
    es: "Por favor complete este formulario.",
    fr: "Veuillez remplir ce formulaire.",
    de: "Bitte füllen Sie dieses Formular aus.",
    zh: "请填写此表格。",
  },
  startButtonText: {
    en: "Start",
    "pt-BR": "Começar",
    hi: "प्रारंभ करें",
    "bn-IN": "শুরু করুন",
    "te-IN": "ప్రారంభించు",
    "mr-IN": "प्रारंभ करा",
    "ta-IN": "தொடங்கு",
    es: "Comenzar",
    fr: "Commencer",
    de: "Start",
    zh: "开始",
  },
  welcome: {
    en: "Welcome",
    "pt-BR": "Bem-vindo",
    hi: "स्वागत है",
    "bn-IN": "স্বাগতম",
    "te-IN": "స్వాగతం",
    "mr-IN": "स्वागत आहे",
    "ta-IN": "வரவேற்கிறோம்",
    es: "Bienvenido",
    fr: "Bienvenue",
    de: "Willkommen",
    zh: "欢迎",
  },
  submit: {
    en: "Thank you for submitting",
    "pt-BR": "Obrigado por enviar",
    hi: "प्रस्तुत करने के लिए धन्यवाद",
    "bn-IN": "জমা দেওয়ার জন্য ধন্যবাদ",
    "te-IN": "సమర్పించినందుకు ధన్యవాదాలు",
    "mr-IN": "सबमिट केल्याबद्दल धन्यवाद",
    "ta-IN": "சமர்ப்பித்ததற்கு நன்றி",
    es: "Gracias por enviar",
    fr: "Merci d'avoir soumis",
    de: "Vielen Dank für Ihre Einreichung",
    zh: "感谢您的提交",
  },
};
