import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Easing, Platform } from "react-native";
import Voice, {
  type SpeechErrorEvent,
  type SpeechRecognizedEvent,
  type SpeechResultsEvent,
} from "@react-native-voice/voice";
import Tts from "react-native-tts";
import RNSystemSounds from "@dashdoc/react-native-system-sounds";

import {
  ViewChatMessage,
  ViewCopilotContainer,
  ViewMessage,
  ViewTextBox,
  ViewTextBoxButton,
  ViewTextBoxContainer,
  ViewVoiceButton,
} from "./base_styled";
import Svg, { Path } from "react-native-svg";
import {
  type CopilotStylePositionType,
  type EmbeddingScopeWithUserType,
  type BaseAssistantProps,
  copilotStyleDefaults,
  scopeDefaults,
  loadCurrentConfig,
  useCopilot,
} from "@sugar-ai/core";
import { Mic } from "../icons/mic";
import { OpenMic } from "../icons/open_mic";

export const VoiceAssistant = ({
  id = null,
  promptTemplate = null,
  promptVariables = {},
  scope = scopeDefaults,
  style = {},
  voiceButtonStyle = {},
  keyboardButtonStyle = {},
  messageStyle = {},
  toolTipContainerStyle = {},
  toolTipMessageStyle = {},
  position = copilotStyleDefaults.container.position || "bottom-right",
  keyboardPosition = copilotStyleDefaults.keyboardButton.position,
  actionsFn,
  actionCallbacksFn,
}: BaseAssistantProps) => {
  const [buttonId, setButtonName] = useState<string>(position as string);
  const [islistening, setIslistening] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [hideToolTip, setHideToolTip] = useState(true);
  const [isprocessing, setIsprocessing] = useState(false);
  const [partialOutput, setPartialOutput] = useState<string>("");
  const [finalOutput, setFinalOutput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [hideTextButton, setHideTextButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const { config, clientUserId, textToAction } = useCopilot();

  const { actions, actionCallbacks, currentStyle, currentAiConfig } =
    loadCurrentConfig(config, actionsFn, actionCallbacksFn);

  const [tipMessage, setTipMessage] = useState(
    currentStyle.toolTip.welcomeMessage,
  );

  if (promptTemplate == null && config?.ai?.defaultPromptTemplate == null) {
    throw new Error(
      "Both promptTemplate and config.prompt.defaultTemplate are null. Set atleast one of them",
    );
  }
  if (!promptTemplate && config?.ai?.defaultPromptTemplate) {
    promptTemplate = config?.ai?.defaultPromptTemplate;
  }

  const timeout = useRef<ReturnType<typeof setTimeout>>();
  const script = useRef<string | undefined>();

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechRecognized = onSpeechRecognized;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;

    console.log(hideToolTip, tipMessage);
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = (e: any) => {
    DEV: console.log("onSpeechStart: ", e);
    setIslistening(true);
  };

  const onSpeechRecognized = (e: SpeechRecognizedEvent) => {
    DEV: console.log("onSpeechRecognized: ", e);
  };

  const onSpeechEnd = (e: any) => {
    DEV: console.log("onSpeechEnd: ", e);
    setIslistening(false);
    setIsprocessing(false);
  };

  const onSpeechError = (e: SpeechErrorEvent) => {
    DEV: console.log("onSpeechError: ", e);
    setIslistening(false);
    setIsprocessing(false);
    setIsDisabled(false);
  };

  const stop = useCallback(async () => {
    try {
      Voice.destroy();
      const text = script.current as string;
      setPartialOutput("");
      setFinalOutput(text);
      setIslistening(false);
      await processTextToText(text);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const onSpeechResults = async (e: SpeechResultsEvent) => {
    const text: string = e?.value?.[0] as string;
    DEV: console.log("onSpeechResults: ", text);
    script.current = text;
    if (Platform.OS === "ios") {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => {
        if (script.current === text) {
          stop();
        }
      }, 1000);
    } else {
      stop();
    }
  };

  const onSpeechPartialResults = async (e: SpeechResultsEvent) => {
    const text: string = e?.value?.[0] as string;
    setPartialOutput((pO) => {
      return text;
    });
    setFinalOutput("");
  };

  const _startRecognizing = async () => {
    try {
      await Voice.start(currentAiConfig.lang ?? "en-US");
      setIsDisabled(true);
      PROD: console.log("called start");
      setTextMessage("");
      setAiResponse("");
      setPartialOutput("");
      setFinalOutput("");
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setButtonName(id ?? (position as string));
    const timer = setTimeout(() => {
      setHideToolTip(false);
    }, currentStyle?.toolTip?.delay);
    setHideToolTip(true);
    setTipMessage(currentStyle.toolTip.welcomeMessage);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const enableKeyboard = () => {
    setHideTextButton(!hideTextButton);
  };

  scope = { ...scopeDefaults, ...scope };

  const processTextToText = async (input: string) => {
    const newScope: EmbeddingScopeWithUserType = {
      clientUserId: clientUserId!,
      ...scope,
    };

    setIsprocessing(true);
    const currentPromptVariables = {
      ...currentAiConfig?.defaultPromptVariables,
      ...promptVariables,
    };
    const aiResponse = await textToAction(
      promptTemplate as string,
      input,
      currentPromptVariables,
      newScope,
      actions,
      actionCallbacks,
    ).finally(() => {
      setIsprocessing(false);
    });
    if (typeof aiResponse === "string") {
      if (currentAiConfig.successResponse !== aiResponse) {
        setAiResponse(aiResponse);
        speak(aiResponse);
      }
      if (currentAiConfig.successResponse === aiResponse) {
        setIsDisabled(false);
        RNSystemSounds.play(
          Platform.select({
            android:
              currentAiConfig?.successSound?.android ??
              RNSystemSounds.AndroidSoundIDs.TONE_PROP_BEEP,
            ios:
              currentAiConfig?.successSound?.ios ??
              RNSystemSounds.iOSSoundIDs.Headset_AnswerCall,
          }),
        );
      }
    }
  };

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isDisabled) {
      fadeAnim.setValue(1);
      setIsFading(false);

      const timer = setTimeout(() => {
        setIsFading(true);
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          setIsFading(false);
        });
      }, 10000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isDisabled, fadeAnim]);

  Tts.addEventListener("tts-start", async (event) => {
    await Voice.cancel();
  });

  Tts.addEventListener("tts-finish", (event) => {
    setIsDisabled(false);
  });

  const speak = (text) => {
    DEV: console.log("speak: ", text);
    DEV: console.log("lang: ", currentAiConfig.lang);
    Tts.setDefaultLanguage(currentAiConfig.lang);
    Tts.speak(text);
  };

  const startSending = async () => {
    const newTextMessage = textMessage;
    setTextMessage("");
    setAiResponse("");
    setIsTyping(false);
    setFinalOutput(newTextMessage);
    await processTextToText(newTextMessage);
  };

  const onTyping = (text: string) => {
    setTextMessage(text);
    setIsTyping(text.length !== 0);
  };

  return (
    <>
      <ViewCopilotContainer
        id={`sugar-ai-copilot-id-${buttonId}`}
        container={currentStyle?.container}
        position={position as CopilotStylePositionType}
        style={style}
      >
        {!hideTextButton && (
          <ViewVoiceButton
            style={voiceButtonStyle}
            button={currentStyle?.voiceButton}
            onPress={() => _startRecognizing()}
            isprocessing={isprocessing.toString()}
            islistening={islistening.toString()}
            disabled={isDisabled}
          >
            {isprocessing ? (
              <ActivityIndicator color={currentStyle.voiceButton.color} />
            ) : islistening ? (
              <OpenMic
                // width={26}
                // height={26}
                size={currentStyle?.voiceButton.iconSize}
                color={currentStyle?.voiceButton.color}
              />
            ) : (
              <Mic
                // width={26}
                // height={26}
                size={currentStyle?.voiceButton.iconSize}
                color={currentStyle?.voiceButton.color}
              />
            )}
          </ViewVoiceButton>
        )}

        {(aiResponse || finalOutput || partialOutput) && (
          <ViewChatMessage
            container={currentStyle?.container}
            position={position}
            id={`sugar-ai-chat-message-${buttonId}`}
            style={messageStyle}
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {(partialOutput || finalOutput) && (
                <ViewMessage
                  theme={currentStyle?.theme}
                  id={`sugar-ai-message-${buttonId}`}
                  isfading={isFading.toString()}
                >
                  {partialOutput || finalOutput}
                </ViewMessage>
              )}
              {aiResponse && (
                <ViewMessage
                  theme={currentStyle?.theme}
                  id={`sugar-ai-message-${buttonId}`}
                  role="assistant"
                  isfading={isFading.toString()}
                >
                  {aiResponse}
                </ViewMessage>
              )}
            </Animated.View>
          </ViewChatMessage>
        )}
      </ViewCopilotContainer>
      {hideTextButton && (
        <ViewTextBoxContainer
          container={currentStyle?.container}
          position={position}
          id={`sugar-ai-text-box-container-${buttonId}`}
        >
          <ViewTextBox
            placeholder={currentStyle?.keyboardButton?.placeholder}
            defaultValue={textMessage}
            bgColor={currentStyle?.keyboardButton?.bgColor as string}
            onChangeText={(newText) => {
              onTyping(newText);
            }}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmitEditing={startSending}
          />
          <ViewTextBoxButton
            iskeyboard={"true"}
            onPress={enableKeyboard}
            disabled={isprocessing}
            activeOpacity={1}
          >
            {isTyping || isprocessing ? (
              isprocessing ? (
                <ActivityIndicator
                  color={currentStyle.keyboardButton.bgColor}
                  style={{ top: 5 }}
                />
              ) : (
                <Svg
                  width={24}
                  height={21}
                  viewBox={`0 0 24 21`}
                  style={{ top: 5 }}
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onPress={startSending}
                >
                  <Path
                    d="M1.55538 13.1554C1.77934 13.1554 1.99413 13.2444 2.15249 13.4028C2.31086 13.5611 2.39983 13.7759 2.39983 13.9999C2.39936 15.1834 2.67531 16.3507 3.2057 17.4087C3.73609 18.4668 4.50626 19.3863 5.45484 20.0941C6.40342 20.8019 7.50419 21.2784 8.66945 21.4855C9.83471 21.6927 11.0323 21.6249 12.1667 21.2874C12.3539 21.5966 12.6084 21.8595 12.9114 22.0566C13.2143 22.2537 13.5579 22.3799 13.9164 22.4257C12.9478 22.8767 11.9084 23.1562 10.8443 23.2516V26.6665C10.8443 26.8905 10.7553 27.1053 10.5969 27.2637C10.4386 27.422 10.2238 27.511 9.99983 27.511C9.77587 27.511 9.56108 27.422 9.40271 27.2637C9.24435 27.1053 9.15538 26.8905 9.15538 26.6665V23.2516C6.84737 23.0409 4.7015 21.975 3.13909 20.2633C1.57668 18.5515 0.710611 16.3175 0.710938 13.9999C0.710938 13.7759 0.799906 13.5611 0.95827 13.4028C1.11663 13.2444 1.33142 13.1554 1.55538 13.1554ZM13.5465 20.2792C13.5957 20.4191 13.6871 20.5403 13.8081 20.626C13.9291 20.7117 14.0737 20.7578 14.222 20.7578C14.3703 20.7578 14.515 20.7117 14.636 20.626C14.757 20.5403 14.8484 20.4191 14.8976 20.2792L15.4853 18.4704C15.6682 17.9205 15.9768 17.4209 16.3867 17.0113C16.7966 16.6017 17.2964 16.2935 17.8464 16.111L19.6552 15.5233C19.7947 15.4741 19.9155 15.383 20.001 15.2622C20.0865 15.1415 20.1324 14.9973 20.1324 14.8494C20.1324 14.7015 20.0865 14.5572 20.001 14.4365C19.9155 14.3158 19.7947 14.2246 19.6552 14.1755L19.6214 14.1671L17.8109 13.5777C17.2608 13.3952 16.7607 13.0869 16.3506 12.6773C15.9404 12.2678 15.6314 11.7682 15.4482 11.2183L14.8604 9.41117C14.8117 9.27107 14.7205 9.14963 14.5996 9.06369C14.4787 8.97775 14.3341 8.93157 14.1857 8.93157C14.0374 8.93157 13.8927 8.97775 13.7718 9.06369C13.6509 9.14963 13.5598 9.27107 13.511 9.41117L12.9233 11.2183C12.7439 11.7643 12.4406 12.2614 12.0372 12.6707C11.6337 13.08 11.141 13.3904 10.5977 13.5777L8.7872 14.1654C8.64769 14.2145 8.52687 14.3057 8.4414 14.4264C8.35592 14.5471 8.31002 14.6914 8.31002 14.8393C8.31002 14.9872 8.35592 15.1314 8.4414 15.2521C8.52687 15.3728 8.64769 15.464 8.7872 15.5131L10.5977 16.1009C11.1489 16.2845 11.6496 16.5943 12.0598 17.0057C12.47 17.4171 12.7784 17.9187 12.9604 18.4704L13.5465 20.2792ZM14.1883 7.24433C14.4906 7.24433 14.7895 7.30175 15.0682 7.41153V5.55544C15.0682 4.21167 14.5344 2.92295 13.5842 1.97276C12.634 1.02258 11.3453 0.48877 10.0015 0.48877C8.65775 0.48877 7.36903 1.02258 6.41884 1.97276C5.46866 2.92295 4.93485 4.21167 4.93485 5.55544V13.9999C4.93454 14.7777 5.11334 15.5452 5.45739 16.2428C5.80143 16.9405 6.30148 17.5495 6.91879 18.0228C7.53611 18.4961 8.2541 18.8209 9.01713 18.972C9.78016 19.1231 10.5677 19.0965 11.3188 18.8943C11.2104 18.6169 11.0424 18.3667 10.8268 18.1612C10.6111 17.9558 10.3531 17.8002 10.0708 17.7053L8.24676 17.1142L8.22818 17.1057C7.75917 16.9404 7.35302 16.6335 7.06573 16.2276C6.77844 15.8216 6.62416 15.3366 6.62416 14.8393C6.62416 14.3419 6.77844 13.8569 7.06573 13.4509C7.35302 13.045 7.75917 12.7382 8.22818 12.5728L8.24845 12.566L10.0606 11.9783C10.3548 11.8749 10.6214 11.7055 10.8398 11.483C11.0582 11.2604 11.2227 10.9908 11.3205 10.6947L11.9133 8.86735L11.9201 8.84708C12.0858 8.37804 12.393 7.97197 12.7992 7.68489C13.2055 7.39782 13.6908 7.24388 14.1883 7.24433ZM23.5413 22.3852L24.835 22.8041L24.8604 22.8108C24.9349 22.8371 25.0022 22.8803 25.0573 22.937C25.1123 22.9937 25.1534 23.0623 25.1775 23.1376C25.2015 23.2128 25.2078 23.2926 25.1959 23.3707C25.1839 23.4488 25.1541 23.5231 25.1086 23.5877C25.0472 23.6739 24.9604 23.7388 24.8604 23.7735L23.5684 24.1923C23.1751 24.3229 22.8176 24.5434 22.5244 24.8362C22.2313 25.1291 22.0104 25.4864 21.8795 25.8795L21.4606 27.1698C21.4257 27.2696 21.3606 27.356 21.2743 27.4172C21.1881 27.4783 21.085 27.5112 20.9793 27.5112C20.8736 27.5112 20.7705 27.4783 20.6843 27.4172C20.598 27.356 20.5329 27.2696 20.498 27.1698L20.0774 25.8795C19.9477 25.4854 19.7275 25.1271 19.4346 24.8333C19.1416 24.5394 18.784 24.3182 18.3902 24.1873L17.0982 23.7667C17.0239 23.7402 16.9567 23.6969 16.9018 23.6402C16.847 23.5834 16.806 23.5147 16.7822 23.4395C16.7583 23.3642 16.7521 23.2845 16.7642 23.2065C16.7762 23.1285 16.8062 23.0543 16.8516 22.9898C16.9127 22.9039 16.9988 22.839 17.0982 22.8041L18.3902 22.3852C18.7784 22.2514 19.1304 22.0296 19.4187 21.7372C19.707 21.4448 19.9238 21.0897 20.0521 20.6997L20.4726 19.4077C20.5076 19.3079 20.5727 19.2215 20.6589 19.1604C20.7452 19.0992 20.8482 19.0664 20.954 19.0664C21.0597 19.0664 21.1628 19.0992 21.249 19.1604C21.3352 19.2215 21.4003 19.3079 21.4353 19.4077L21.8558 20.6997C21.9865 21.0926 22.207 21.4495 22.4999 21.7421C22.7929 22.0348 23.1483 22.255 23.5413 22.3852Z"
                    fill={currentStyle.keyboardButton.bgColor}
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  />
                </Svg>
              )
            ) : (
              <Svg width={26} height={26} viewBox={`0 0 24 26`}>
                <Path
                  d="M1.55538 13.1554C1.77934 13.1554 1.99413 13.2444 2.15249 13.4028C2.31086 13.5611 2.39983 13.7759 2.39983 13.9999C2.39936 15.1834 2.67531 16.3507 3.2057 17.4087C3.73609 18.4668 4.50626 19.3863 5.45484 20.0941C6.40342 20.8019 7.50419 21.2784 8.66945 21.4855C9.83471 21.6927 11.0323 21.6249 12.1667 21.2874C12.3539 21.5966 12.6084 21.8595 12.9114 22.0566C13.2143 22.2537 13.5579 22.3799 13.9164 22.4257C12.9478 22.8767 11.9084 23.1562 10.8443 23.2516V26.6665C10.8443 26.8905 10.7553 27.1053 10.5969 27.2637C10.4386 27.422 10.2238 27.511 9.99983 27.511C9.77587 27.511 9.56108 27.422 9.40271 27.2637C9.24435 27.1053 9.15538 26.8905 9.15538 26.6665V23.2516C6.84737 23.0409 4.7015 21.975 3.13909 20.2633C1.57668 18.5515 0.710611 16.3175 0.710938 13.9999C0.710938 13.7759 0.799906 13.5611 0.95827 13.4028C1.11663 13.2444 1.33142 13.1554 1.55538 13.1554ZM13.5465 20.2792C13.5957 20.4191 13.6871 20.5403 13.8081 20.626C13.9291 20.7117 14.0737 20.7578 14.222 20.7578C14.3703 20.7578 14.515 20.7117 14.636 20.626C14.757 20.5403 14.8484 20.4191 14.8976 20.2792L15.4853 18.4704C15.6682 17.9205 15.9768 17.4209 16.3867 17.0113C16.7966 16.6017 17.2964 16.2935 17.8464 16.111L19.6552 15.5233C19.7947 15.4741 19.9155 15.383 20.001 15.2622C20.0865 15.1415 20.1324 14.9973 20.1324 14.8494C20.1324 14.7015 20.0865 14.5572 20.001 14.4365C19.9155 14.3158 19.7947 14.2246 19.6552 14.1755L19.6214 14.1671L17.8109 13.5777C17.2608 13.3952 16.7607 13.0869 16.3506 12.6773C15.9404 12.2678 15.6314 11.7682 15.4482 11.2183L14.8604 9.41117C14.8117 9.27107 14.7205 9.14963 14.5996 9.06369C14.4787 8.97775 14.3341 8.93157 14.1857 8.93157C14.0374 8.93157 13.8927 8.97775 13.7718 9.06369C13.6509 9.14963 13.5598 9.27107 13.511 9.41117L12.9233 11.2183C12.7439 11.7643 12.4406 12.2614 12.0372 12.6707C11.6337 13.08 11.141 13.3904 10.5977 13.5777L8.7872 14.1654C8.64769 14.2145 8.52687 14.3057 8.4414 14.4264C8.35592 14.5471 8.31002 14.6914 8.31002 14.8393C8.31002 14.9872 8.35592 15.1314 8.4414 15.2521C8.52687 15.3728 8.64769 15.464 8.7872 15.5131L10.5977 16.1009C11.1489 16.2845 11.6496 16.5943 12.0598 17.0057C12.47 17.4171 12.7784 17.9187 12.9604 18.4704L13.5465 20.2792ZM14.1883 7.24433C14.4906 7.24433 14.7895 7.30175 15.0682 7.41153V5.55544C15.0682 4.21167 14.5344 2.92295 13.5842 1.97276C12.634 1.02258 11.3453 0.48877 10.0015 0.48877C8.65775 0.48877 7.36903 1.02258 6.41884 1.97276C5.46866 2.92295 4.93485 4.21167 4.93485 5.55544V13.9999C4.93454 14.7777 5.11334 15.5452 5.45739 16.2428C5.80143 16.9405 6.30148 17.5495 6.91879 18.0228C7.53611 18.4961 8.2541 18.8209 9.01713 18.972C9.78016 19.1231 10.5677 19.0965 11.3188 18.8943C11.2104 18.6169 11.0424 18.3667 10.8268 18.1612C10.6111 17.9558 10.3531 17.8002 10.0708 17.7053L8.24676 17.1142L8.22818 17.1057C7.75917 16.9404 7.35302 16.6335 7.06573 16.2276C6.77844 15.8216 6.62416 15.3366 6.62416 14.8393C6.62416 14.3419 6.77844 13.8569 7.06573 13.4509C7.35302 13.045 7.75917 12.7382 8.22818 12.5728L8.24845 12.566L10.0606 11.9783C10.3548 11.8749 10.6214 11.7055 10.8398 11.483C11.0582 11.2604 11.2227 10.9908 11.3205 10.6947L11.9133 8.86735L11.9201 8.84708C12.0858 8.37804 12.393 7.97197 12.7992 7.68489C13.2055 7.39782 13.6908 7.24388 14.1883 7.24433ZM23.5413 22.3852L24.835 22.8041L24.8604 22.8108C24.9349 22.8371 25.0022 22.8803 25.0573 22.937C25.1123 22.9937 25.1534 23.0623 25.1775 23.1376C25.2015 23.2128 25.2078 23.2926 25.1959 23.3707C25.1839 23.4488 25.1541 23.5231 25.1086 23.5877C25.0472 23.6739 24.9604 23.7388 24.8604 23.7735L23.5684 24.1923C23.1751 24.3229 22.8176 24.5434 22.5244 24.8362C22.2313 25.1291 22.0104 25.4864 21.8795 25.8795L21.4606 27.1698C21.4257 27.2696 21.3606 27.356 21.2743 27.4172C21.1881 27.4783 21.085 27.5112 20.9793 27.5112C20.8736 27.5112 20.7705 27.4783 20.6843 27.4172C20.598 27.356 20.5329 27.2696 20.498 27.1698L20.0774 25.8795C19.9477 25.4854 19.7275 25.1271 19.4346 24.8333C19.1416 24.5394 18.784 24.3182 18.3902 24.1873L17.0982 23.7667C17.0239 23.7402 16.9567 23.6969 16.9018 23.6402C16.847 23.5834 16.806 23.5147 16.7822 23.4395C16.7583 23.3642 16.7521 23.2845 16.7642 23.2065C16.7762 23.1285 16.8062 23.0543 16.8516 22.9898C16.9127 22.9039 16.9988 22.839 17.0982 22.8041L18.3902 22.3852C18.7784 22.2514 19.1304 22.0296 19.4187 21.7372C19.707 21.4448 19.9238 21.0897 20.0521 20.6997L20.4726 19.4077C20.5076 19.3079 20.5727 19.2215 20.6589 19.1604C20.7452 19.0992 20.8482 19.0664 20.954 19.0664C21.0597 19.0664 21.1628 19.0992 21.249 19.1604C21.3352 19.2215 21.4003 19.3079 21.4353 19.4077L21.8558 20.6997C21.9865 21.0926 22.207 21.4495 22.4999 21.7421C22.7929 22.0348 23.1483 22.255 23.5413 22.3852Z"
                  fill={currentStyle.keyboardButton.bgColor}
                />
              </Svg>
            )}
          </ViewTextBoxButton>
        </ViewTextBoxContainer>
      )}
    </>
  );
};
