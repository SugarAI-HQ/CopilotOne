import {
  copilotAssistantVoiceType,
  type CopilotStylePositionType,
  type CopilotSyleKeyboardPositionSchema,
  type EmbeddingScopeType,
  type PromptTemplateType,
  type PromptVariablesType,
} from "../../../schema";

export interface BaseAssistantProps {
  id?: string | null;
  promptTemplate?: PromptTemplateType | null;
  promptVariables?: PromptVariablesType;
  scope?: EmbeddingScopeType;
  style?: any;
  keyboardButtonStyle?: any;
  messageStyle?: any;
  voiceButtonStyle?: any;
  toolTipContainerStyle?: any;
  toolTipMessageStyle?: any;
  position?: CopilotStylePositionType;
  keyboardPosition?: CopilotSyleKeyboardPositionSchema;
  actionsFn?: Function;
  actionCallbacksFn?: Function;
}

export const shouldForwardProp = (prop: string) =>
  prop !== "container" && prop !== "position";

export const findAvailableVoice = async (
  voiceName: string,
  lang: string,
  synth: SpeechSynthesis,
) => {
  const voices = await new Promise<SpeechSynthesisVoice[]>((resolve) => {
    let voices = synth.getVoices();

    if (voices.length) {
      resolve(voices);
      return;
    }

    const voiceschanged = () => {
      voices = synth.getVoices();
      resolve(voices);
    };

    synth.onvoiceschanged = voiceschanged;
  });

  return voices.find(
    (voice) => voice.lang.startsWith(lang) && voice.name.includes(voiceName),
  );
};

export const determinePreferredVoice = async (
  inputVoice,
  preferredLang,
  synth,
) => {
  if (inputVoice === "auto") {
    if (preferredLang === "hi-IN") {
      return (
        (await findAvailableVoice("Google हिन्दी", preferredLang, synth)) ??
        (await findAvailableVoice("Lekha", preferredLang, synth))
      );
    } else {
      return await findAvailableVoice("Nicky", preferredLang, synth);
    }
  }
  if (inputVoice) {
    const preferredVoice = await findAvailableVoice(
      inputVoice,
      preferredLang,
      synth,
    );
    if (preferredVoice) {
      return preferredVoice;
    }
  }

  const defaultVoices = Object.values(copilotAssistantVoiceType.Values);
  for (const defaultVoice of defaultVoices) {
    const voice = await findAvailableVoice(defaultVoice, preferredLang, synth);
    if (voice) {
      return voice;
    }
  }
  return null; // Return null if no default voice found
};

export const determinePreferredLang = (inputLang) => {
  const defaultLang =
    Intl.DateTimeFormat().resolvedOptions().timeZone === "Asia/Calcutta"
      ? "hi-IN"
      : "en-US";
  if (inputLang === "auto") {
    return defaultLang;
  }
  return inputLang || defaultLang;
};

export const getPreferredVoiceAndLang = async (
  inputVoice,
  inputLang,
  synth,
) => {
  const preferredLang = determinePreferredLang(inputLang);
  const preferredVoice = await determinePreferredVoice(
    inputVoice,
    preferredLang,
    synth,
  );
  return { lang: preferredLang, voice: preferredVoice };
};
