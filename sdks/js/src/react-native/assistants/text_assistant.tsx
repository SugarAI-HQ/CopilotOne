import { useEffect, useState } from "react";
import {
  // StyleSheet,
  // TouchableOpacity,
  // Animated,
  // TextInput,
  Text,
} from "react-native";

import {
  ViewChatMessage,
  ViewCopilotContainer,
  ViewKeyboardButton,
  ViewMessage,
  ViewTextBox,
  ViewTextBoxButton,
  ViewTextBoxContainer,
} from "./base_styled";
import Svg, { Path } from "react-native-svg";
import {
  type CopilotStylePositionType,
  copilotAiDefaults,
  copilotStyleDefaults,
  scopeDefaults,
  type EmbeddingScopeWithUserType,
} from "../../schema";
import { useCopilot } from "../../react/CopilotContext";
import { type BaseAssistantProps } from "../../react/assistants/components/schema";

const ViewTextAssistant = ({
  id = null,
  promptTemplate = null,
  promptVariables = {},
  scope = scopeDefaults,
  style = {},
  keyboardButtonStyle = {},
  messageStyle = {},
  toolTipContainerStyle = {},
  toolTipMessageStyle = {},
  position = copilotStyleDefaults.container.position || "bottom-right",
  keyboardPostion = copilotStyleDefaults.keyboardButton.position,
  actionsFn,
  actionCallbacksFn,
}: BaseAssistantProps) => {
  const [buttonId, setButtonName] = useState<string>(position as string);
  const [hideToolTip, setHideToolTip] = useState(true);
  const [isprocessing, setIsprocessing] = useState(false);
  const [finalOutput, setFinalOutput] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [hideTextButton, setHideTextButton] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { config, clientUserId, textToAction } = useCopilot();

  const currentTheme = {
    ...copilotStyleDefaults.theme,
    ...config?.style?.theme,
  };

  console.log("hello text");

  const actions = typeof actionsFn === "function" ? actionsFn() : [];
  const actionCallbacks =
    typeof actionCallbacksFn === "function" ? actionCallbacksFn() : [];

  DEV: console.log(`currentTheme ---> ${JSON.stringify(currentTheme)}`);

  const currentStyle: CopilotSytleType = {
    ...copilotStyleDefaults,
    container: {
      ...copilotStyleDefaults.container,
      ...config?.style?.container,
    },
    theme: currentTheme,
    voiceButton: {
      ...copilotStyleDefaults.voiceButton,
      ...config?.style?.voiceButton,
      bgColor: currentTheme.primaryColor,
      color: currentTheme.secondaryColor,
    },
    keyboardButton: {
      ...copilotStyleDefaults.keyboardButton,
      ...config?.style?.keyboardButton,
      bgColor: currentTheme.primaryColor,
      color: currentTheme.secondaryColor,
    },
    toolTip: {
      ...copilotStyleDefaults.toolTip,
      ...config?.style?.toolTip,
    },
  };

  const currentAiConfig = {
    ...copilotAiDefaults,
    ...config?.ai,
  };

  DEV: console.log(currentAiConfig);
  DEV: console.log(isprocessing);

  const [tipMessage, setTipMessage] = useState(
    currentStyle.toolTip.welcomeMessage,
  );

  DEV: console.log(
    `copilotStyleDefaults ---> ${JSON.stringify(copilotStyleDefaults)}`,
  );

  DEV: console.log(`config?.style ---> ${JSON.stringify(config?.style)}`);

  DEV: console.log(`current Style ---> ${JSON.stringify(currentStyle)}`);

  if (promptTemplate == null && config?.ai?.defaultPromptTemplate == null) {
    throw new Error(
      "Both promptTemplate and config.prompt.defaultTemplate are null. Set atleast one of them",
    );
  }
  if (!promptTemplate && config?.ai?.defaultPromptTemplate) {
    promptTemplate = config?.ai?.defaultPromptTemplate;
  }

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
      setAiResponse(aiResponse);
    }
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
          <ViewKeyboardButton
            style={keyboardButtonStyle}
            button={currentStyle?.keyboardButton}
            container={currentStyle?.container}
            position={position}
            onPress={enableKeyboard}
          >
            <Svg width={26} height={26} viewBox={`0 0 26 26`}>
              <Path
                d="M18.83 0.394696L19.3172 1.8941C19.4684 2.35031 19.7243 2.76479 20.0644 3.1044C20.4045 3.44401 20.8194 3.69932 21.2758 3.8499L22.7752 4.3371L22.8046 4.3455C22.9202 4.38621 23.0204 4.4618 23.0912 4.56186C23.1621 4.66192 23.2001 4.78149 23.2001 4.9041C23.2001 5.0267 23.1621 5.14628 23.0912 5.24633C23.0204 5.34639 22.9202 5.42199 22.8046 5.4627L21.3052 5.9499C20.8488 6.10047 20.4339 6.35578 20.0938 6.69539C19.7537 7.035 19.4978 7.44948 19.3466 7.9057L18.8594 9.4037C18.8187 9.51934 18.7431 9.6195 18.643 9.69035C18.543 9.76121 18.4234 9.79926 18.3008 9.79926C18.1782 9.79926 18.0586 9.76121 17.9585 9.69035C17.8585 9.6195 17.7829 9.51934 17.7422 9.4037L17.2536 7.9057C17.1035 7.44847 16.8485 7.03276 16.5088 6.6919C16.1689 6.35038 15.7536 6.09336 15.2964 5.9415L13.797 5.4543C13.6813 5.41359 13.5812 5.33799 13.5103 5.23793C13.4395 5.13788 13.4014 5.0183 13.4014 4.8957C13.4014 4.77309 13.4395 4.65352 13.5103 4.55346C13.5812 4.4534 13.6813 4.37781 13.797 4.3371L15.2964 3.8499C15.7471 3.69524 16.1558 3.43812 16.4903 3.09874C16.8248 2.75937 17.076 2.34701 17.2242 1.8941L17.7114 0.396096C17.7518 0.279964 17.8274 0.179293 17.9276 0.108052C18.0278 0.0368114 18.1477 -0.00146484 18.2707 -0.00146484C18.3936 -0.00146484 18.5136 0.0368114 18.6138 0.108052C18.714 0.179293 18.7896 0.278564 18.83 0.394696ZM25.697 11.4995L24.6246 11.1523C24.2992 11.0435 24.0035 10.8605 23.761 10.6178C23.5185 10.375 23.3358 10.0792 23.2274 9.7537L22.8774 8.6841C22.8484 8.6014 22.7944 8.52975 22.723 8.47907C22.6515 8.42838 22.566 8.40115 22.4784 8.40115C22.3908 8.40115 22.3053 8.42838 22.2338 8.47907C22.1623 8.52975 22.1084 8.6014 22.0794 8.6841L21.7322 9.7537C21.6257 10.0771 21.446 10.3716 21.207 10.6142C20.9681 10.8568 20.6764 11.0409 20.3546 11.1523L19.2836 11.4995C19.2015 11.5291 19.1306 11.5833 19.0805 11.6547C19.0303 11.7261 19.0034 11.8112 19.0034 11.8985C19.0034 11.9857 19.0303 12.0709 19.0805 12.1423C19.1306 12.2137 19.2015 12.2679 19.2836 12.2975L20.3546 12.6461C20.681 12.7549 20.9774 12.9384 21.2205 13.1819C21.4635 13.4255 21.6464 13.7223 21.7546 14.0489L22.1018 15.1185C22.1308 15.2012 22.1847 15.2728 22.2562 15.3235C22.3277 15.3742 22.4132 15.4014 22.5008 15.4014C22.5884 15.4014 22.6739 15.3742 22.7454 15.3235C22.8168 15.2728 22.8708 15.2012 22.8998 15.1185L23.2484 14.0489C23.357 13.7232 23.5399 13.4273 23.7827 13.1846C24.0254 12.9418 24.3213 12.7589 24.647 12.6503L25.718 12.3031C25.8 12.2735 25.871 12.2193 25.9211 12.1479C25.9713 12.0765 25.9982 11.9913 25.9982 11.9041C25.9982 11.8169 25.9713 11.7317 25.9211 11.6603C25.871 11.5889 25.8 11.5347 25.718 11.5051L25.697 11.4995ZM22.5036 16.7999C22.1311 16.7994 21.7673 16.6873 21.4592 16.4779C21.1512 16.2539 20.9272 15.9585 20.7872 15.6085L20.4232 14.4857C20.3862 14.3675 20.3186 14.2612 20.2272 14.1777C20.1401 14.0906 20.035 14.0237 19.9192 13.9817L18.8524 13.6317C18.4744 13.4917 18.1664 13.2663 17.9424 12.9583C17.7184 12.6503 17.6064 12.2849 17.6064 11.9055C17.6064 11.6395 17.6624 11.3735 17.7744 11.1355C17.5504 11.0795 17.3404 10.9815 17.1444 10.8415C16.8113 10.5973 16.5576 10.2603 16.415 9.8727L15.911 8.3439C15.785 8.0219 15.659 7.8399 15.505 7.6859C15.317 7.50432 15.0921 7.36537 14.8456 7.2785L13.3602 6.7885C12.9402 6.6485 12.6042 6.3811 12.3662 6.0437C12.1282 5.7077 12.0008 5.3157 12.0008 4.8957C12.0008 4.4743 12.1268 4.0809 12.3648 3.7449C12.6028 3.4089 12.9388 3.1569 13.3308 3.0155L13.6346 2.9175C12.0427 2.68277 10.419 2.79381 8.87386 3.24305C7.32876 3.69229 5.8986 4.46918 4.68074 5.52084C3.46289 6.57249 2.48594 7.87422 1.8164 9.33739C1.14687 10.8006 0.800465 12.3908 0.800781 13.9999L0.810581 14.4843L0.846981 15.0191C0.975188 16.4276 1.369 17.799 2.00758 19.0609L2.09578 19.2289L0.821782 24.3305L0.802181 24.4467V24.5615C0.811073 24.6624 0.841747 24.7601 0.892084 24.848C0.942421 24.9359 1.01122 25.0118 1.09374 25.0704C1.17626 25.1291 1.27054 25.1692 1.37006 25.188C1.46958 25.2067 1.57197 25.2036 1.67018 25.1789L6.77318 23.9049L6.94118 23.9945C8.43759 24.7516 10.0849 25.1631 11.7615 25.1986C13.4381 25.2342 15.1014 24.893 16.6285 24.2C18.1557 23.5071 19.5079 22.4802 20.5853 21.1951C21.6627 19.91 22.4378 18.3994 22.8536 16.7747C22.7376 16.7904 22.6207 16.7988 22.5036 16.7999Z"
                fill={currentStyle.keyboardButton.color}
              />
            </Svg>
          </ViewKeyboardButton>
        )}

        {(aiResponse || finalOutput) && (
          <ViewChatMessage
            container={currentStyle?.container}
            style={messageStyle}
            position={position}
            id={`sugar-ai-chat-message-${buttonId}`}
          >
            {finalOutput && (
              <ViewMessage
                theme={currentStyle?.theme}
                id={`sugar-ai-message-${buttonId}`}
              >
                {finalOutput}
              </ViewMessage>
            )}
            {aiResponse && (
              <ViewMessage
                theme={currentStyle?.theme}
                id={`sugar-ai-message-${buttonId}`}
                role="assistant"
              >
                {aiResponse}
              </ViewMessage>
            )}
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
            color={currentStyle?.keyboardButton?.bgColor}
            onChangeText={(newText) => {
              onTyping(newText);
            }}
            onSubmitEditing={startSending}
          />
          <ViewTextBoxButton iskeyboard={"true"} onPress={enableKeyboard}>
            {isTyping ? (
              <Svg
                width={24}
                height={21}
                viewBox={`0 0 24 21`}
                style={{ top: 5 }}
                onPress={startSending}
              >
                <Path
                  d="M1.21837 0.0686141C1.05615 0.000421274 0.87718 -0.0174581 0.704674 0.0172948C0.532169 0.0520477 0.374084 0.13783 0.250922 0.263516C0.12776 0.389202 0.0452018 0.548993 0.0139548 0.722168C-0.0172923 0.895343 0.00421333 1.07391 0.0756823 1.23472L3.69692 9.36582H12.5855C12.8184 9.36582 13.0418 9.45833 13.2064 9.62301C13.3711 9.78768 13.4636 10.011 13.4636 10.2439C13.4636 10.4768 13.3711 10.7001 13.2064 10.8648C13.0418 11.0295 12.8184 11.122 12.5855 11.122H3.69692L0.0756823 19.2531C0.00421333 19.4139 -0.0172923 19.5925 0.0139548 19.7657C0.0452018 19.9388 0.12776 20.0986 0.250922 20.2243C0.374084 20.35 0.532169 20.4358 0.704674 20.4705C0.87718 20.5053 1.05615 20.4874 1.21837 20.4192L23.4633 11.0529C23.6224 10.9858 23.7582 10.8732 23.8536 10.7293C23.9491 10.5854 24 10.4166 24 10.2439C24 10.0712 23.9491 9.90238 23.8536 9.75848C23.7582 9.61458 23.6224 9.50203 23.4633 9.4349L1.21837 0.0686141Z"
                  fill={currentStyle.keyboardButton.bgColor}
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                />
              </Svg>
            ) : (
              <Svg width={26} height={26} viewBox={`0 0 24 26`}>
                <Path
                  d="M18.83 0.394696L19.3172 1.8941C19.4684 2.35031 19.7243 2.76479 20.0644 3.1044C20.4045 3.44401 20.8194 3.69932 21.2758 3.8499L22.7752 4.3371L22.8046 4.3455C22.9202 4.38621 23.0204 4.4618 23.0912 4.56186C23.1621 4.66192 23.2001 4.78149 23.2001 4.9041C23.2001 5.0267 23.1621 5.14628 23.0912 5.24633C23.0204 5.34639 22.9202 5.42199 22.8046 5.4627L21.3052 5.9499C20.8488 6.10047 20.4339 6.35578 20.0938 6.69539C19.7537 7.035 19.4978 7.44948 19.3466 7.9057L18.8594 9.4037C18.8187 9.51934 18.7431 9.6195 18.643 9.69035C18.543 9.76121 18.4234 9.79926 18.3008 9.79926C18.1782 9.79926 18.0586 9.76121 17.9585 9.69035C17.8585 9.6195 17.7829 9.51934 17.7422 9.4037L17.2536 7.9057C17.1035 7.44847 16.8485 7.03276 16.5088 6.6919C16.1689 6.35038 15.7536 6.09336 15.2964 5.9415L13.797 5.4543C13.6813 5.41359 13.5812 5.33799 13.5103 5.23793C13.4395 5.13788 13.4014 5.0183 13.4014 4.8957C13.4014 4.77309 13.4395 4.65352 13.5103 4.55346C13.5812 4.4534 13.6813 4.37781 13.797 4.3371L15.2964 3.8499C15.7471 3.69524 16.1558 3.43812 16.4903 3.09874C16.8248 2.75937 17.076 2.34701 17.2242 1.8941L17.7114 0.396096C17.7518 0.279964 17.8274 0.179293 17.9276 0.108052C18.0278 0.0368114 18.1477 -0.00146484 18.2707 -0.00146484C18.3936 -0.00146484 18.5136 0.0368114 18.6138 0.108052C18.714 0.179293 18.7896 0.278564 18.83 0.394696ZM25.697 11.4995L24.6246 11.1523C24.2992 11.0435 24.0035 10.8605 23.761 10.6178C23.5185 10.375 23.3358 10.0792 23.2274 9.7537L22.8774 8.6841C22.8484 8.6014 22.7944 8.52975 22.723 8.47907C22.6515 8.42838 22.566 8.40115 22.4784 8.40115C22.3908 8.40115 22.3053 8.42838 22.2338 8.47907C22.1623 8.52975 22.1084 8.6014 22.0794 8.6841L21.7322 9.7537C21.6257 10.0771 21.446 10.3716 21.207 10.6142C20.9681 10.8568 20.6764 11.0409 20.3546 11.1523L19.2836 11.4995C19.2015 11.5291 19.1306 11.5833 19.0805 11.6547C19.0303 11.7261 19.0034 11.8112 19.0034 11.8985C19.0034 11.9857 19.0303 12.0709 19.0805 12.1423C19.1306 12.2137 19.2015 12.2679 19.2836 12.2975L20.3546 12.6461C20.681 12.7549 20.9774 12.9384 21.2205 13.1819C21.4635 13.4255 21.6464 13.7223 21.7546 14.0489L22.1018 15.1185C22.1308 15.2012 22.1847 15.2728 22.2562 15.3235C22.3277 15.3742 22.4132 15.4014 22.5008 15.4014C22.5884 15.4014 22.6739 15.3742 22.7454 15.3235C22.8168 15.2728 22.8708 15.2012 22.8998 15.1185L23.2484 14.0489C23.357 13.7232 23.5399 13.4273 23.7827 13.1846C24.0254 12.9418 24.3213 12.7589 24.647 12.6503L25.718 12.3031C25.8 12.2735 25.871 12.2193 25.9211 12.1479C25.9713 12.0765 25.9982 11.9913 25.9982 11.9041C25.9982 11.8169 25.9713 11.7317 25.9211 11.6603C25.871 11.5889 25.8 11.5347 25.718 11.5051L25.697 11.4995ZM22.5036 16.7999C22.1311 16.7994 21.7673 16.6873 21.4592 16.4779C21.1512 16.2539 20.9272 15.9585 20.7872 15.6085L20.4232 14.4857C20.3862 14.3675 20.3186 14.2612 20.2272 14.1777C20.1401 14.0906 20.035 14.0237 19.9192 13.9817L18.8524 13.6317C18.4744 13.4917 18.1664 13.2663 17.9424 12.9583C17.7184 12.6503 17.6064 12.2849 17.6064 11.9055C17.6064 11.6395 17.6624 11.3735 17.7744 11.1355C17.5504 11.0795 17.3404 10.9815 17.1444 10.8415C16.8113 10.5973 16.5576 10.2603 16.415 9.8727L15.911 8.3439C15.785 8.0219 15.659 7.8399 15.505 7.6859C15.317 7.50432 15.0921 7.36537 14.8456 7.2785L13.3602 6.7885C12.9402 6.6485 12.6042 6.3811 12.3662 6.0437C12.1282 5.7077 12.0008 5.3157 12.0008 4.8957C12.0008 4.4743 12.1268 4.0809 12.3648 3.7449C12.6028 3.4089 12.9388 3.1569 13.3308 3.0155L13.6346 2.9175C12.0427 2.68277 10.419 2.79381 8.87386 3.24305C7.32876 3.69229 5.8986 4.46918 4.68074 5.52084C3.46289 6.57249 2.48594 7.87422 1.8164 9.33739C1.14687 10.8006 0.800465 12.3908 0.800781 13.9999L0.810581 14.4843L0.846981 15.0191C0.975188 16.4276 1.369 17.799 2.00758 19.0609L2.09578 19.2289L0.821782 24.3305L0.802181 24.4467V24.5615C0.811073 24.6624 0.841747 24.7601 0.892084 24.848C0.942421 24.9359 1.01122 25.0118 1.09374 25.0704C1.17626 25.1291 1.27054 25.1692 1.37006 25.188C1.46958 25.2067 1.57197 25.2036 1.67018 25.1789L6.77318 23.9049L6.94118 23.9945C8.43759 24.7516 10.0849 25.1631 11.7615 25.1986C13.4381 25.2342 15.1014 24.893 16.6285 24.2C18.1557 23.5071 19.5079 22.4802 20.5853 21.1951C21.6627 19.91 22.4378 18.3994 22.8536 16.7747C22.7376 16.7904 22.6207 16.7988 22.5036 16.7999Z"
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

export default ViewTextAssistant;
