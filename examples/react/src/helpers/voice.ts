let synth: any = null;

export const speakMessage = (
  message: string,
  language: string,
  voice: SpeechSynthesisVoice,
  callback?: () => void,
  failureCallback?: () => void
) => {
  console.log(`${voice?.name} Speaking in ${language}: ${message}`);

  const utterance = new SpeechSynthesisUtterance(message);
  synth = synth ?? window.speechSynthesis;

  utterance.voice = voice;
  utterance.lang = language;

  utterance.onend = () => {
    if (callback) callback();
  };

  utterance.onerror = (event) => {
    if (failureCallback) failureCallback();
    console.error(`speechSynthesisUtterance.onerror ${JSON.stringify(event)}`);
  };

  synth.speak(utterance);
};

export const speakMessageAsync = async (
  message: string,
  language: string,
  voice: SpeechSynthesisVoice
): Promise<void> => {
  return new Promise((resolve, reject) => {
    speakMessage(message, language, voice, resolve, reject);
  });
};

export const cancelMessage = () => {
  if (!synth) return;
  synth.cancel();
};
