import { z } from "zod";
import styled from "styled-components/native";
import { View, Dimensions, Text } from "react-native";
import {
  type CopilotSyleThemeType,
  type CopilotStylePositionType,
  type CopilotSyleContainerType,
  type CopilotSyleTooltipType,
  type MessageRoleType,
  copilotStyleVoiceButtonSchema,
  messageRoleEnum,
  copilotStyleKeyboardButtonSchema,
} from "@sugar-ai/core";

import { type FC } from "react";

const copilotVoiceButtonProps = z.object({
  button: copilotStyleVoiceButtonSchema,
  isprocessing: z.string().optional(),
  ispermissiongranted: z.string().optional(),
  islistening: z.string().optional(),
});

const copilotKeyboardButtonProps = z.object({
  button: copilotStyleKeyboardButtonSchema.optional(),
});

type CopilotVoiceButtonPropsType = z.infer<typeof copilotVoiceButtonProps>;
type CopilotKeyboardButtonPropsType = z.infer<
  typeof copilotKeyboardButtonProps
>;

const DEVICE_WIDTH = Dimensions.get("window").width;
// const DEVICE_HEIGHT = Dimensions.get("window").height;

export const ViewCopilotContainer: FC<{
  container: CopilotSyleContainerType;
  position: CopilotStylePositionType;
  children?: React.ReactNode;
  id: string;
  style: string;
}> = styled(View)`
  position: absolute;
  ${({ container, position }) => {
    const positions =
      (position as CopilotStylePositionType) ||
      (container?.position as CopilotStylePositionType);

    switch (positions) {
      case "top-left":
        return `
          top: 25px;
          left: 25px;
        `;
      case "top-right":
        return `
          top: 25px;
          right: 25px;
        `;
      case "bottom-left":
        return `
          bottom: 25px;
          left: 25px;
        `;
      case "bottom-right":
        return `
          bottom: 25px;
          right: 20px;
        `;
      case "top-center":
        return `
          top: 25px;
          left: 0;
          right: 0;
          align-items: center;
          justify-content: center;
        `;
      case "bottom-center":
        return `
          bottom: 25px;
          left: 0;
          right: 0;
          align-items: center;
          justify-content: center;
        `;
      default:
        return `
          bottom: 25px;
          right: 25px;
        `;
    }
  }}
  margin: ${({ container }) => container?.margin ?? "0px"};

  z-index: 9999999; /* Ensure the widget is above other elements */
`;

export const ViewChatMessage: FC<{
  container: CopilotSyleContainerType;
  position: CopilotStylePositionType;
  style: string;
  id: string;
  children?: React.ReactNode;
}> = styled(View)`
  position: absolute;

  width: ${DEVICE_WIDTH - 60}px;
  background-color: transparent;
  border-radius: 10px;

  ${({ container, position }) => {
    const positions =
      (position as CopilotStylePositionType) ||
      (container?.position as CopilotStylePositionType);

    switch (positions) {
      case "top-left":
        return `
          top: 60px;
          left: 20px;
        `;
      case "top-right":
        return `
          top: 60px;
          right: 20px;
        `;
      case "bottom-left":
        return `
          bottom: 60px;
          left: 20px;
        `;
      case "bottom-right":
        return `
          bottom: 60px;
          right: 10px;
        `;
      case "top-center":
        return `
          top: 60px;
          align-items: center;
          justify-content: center;
        `;
      case "bottom-center":
        return `
          bottom: 60px;
          align-items: center;
          justify-content: center;
        `;
      default:
        return ""; // If no position matches, default to an empty string
    }
  }}
`;

export const ViewVoiceButton: FC<{
  button: CopilotVoiceButtonPropsType["button"];
  children?: React.ReactNode;
  style: string;
  onPress: () => void;
  isprocessing: string;
  islistening: string;
  disabled?: boolean;
}> = styled.TouchableOpacity`
  background-color: ${({ button }) => button?.bgColor};
  color: ${({ button }) => button?.color};
  border: none;
  border-radius: 50px;
  width: ${({ button }) => button?.width};
  height: ${({ button }) => button?.height};
  justify-content: center;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 12px;
  cursor: pointer;
  opacity: ${({ isprocessing }) => (isprocessing === "true" ? "0.5" : "1")};
`;

export const ViewKeyboardButton: FC<{
  button: CopilotKeyboardButtonPropsType["button"];
  style: string;
  children?: React.ReactNode;
  onPress: () => void;
}> = styled.TouchableOpacity`
  position: relative;
  background-color: ${({ button }) => button?.bgColor};
  width: 50px;
  height: 50px;
  justify-content: center;
  cursor: "pointer";
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 12px;
  border-radius: 25px;
  elevation: 3;
`;

export const ViewButtonContainer = styled.View``;

export const ViewMessage: FC<{
  theme: CopilotSyleThemeType;
  role?: string;
  isfading?: string;
  id: string;
  children?: React.ReactNode;
}> = styled(Text)`
  background-color: ${({ theme, role }) =>
    messageRoleEnum.options.includes(role as MessageRoleType)
      ? "white"
      : theme?.primaryColor};
  color: ${({ theme, role }) =>
    messageRoleEnum.options.includes(role as MessageRoleType)
      ? "black"
      : theme?.secondaryColor};
  font-size: ${({ theme }) => theme?.fontSize};
  font-family: ${({ theme }) => theme?.fontFamily};
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 10px;

  border: ${({ isfading }) =>
    isfading === "true" ? "none" : "1px solid #ccc"};
  elevation: ${({ isfading }) => (isfading === "true" ? 0 : 2)};
`;

export const ViewToolTipContainer: FC<{
  config: CopilotSyleTooltipType;
}> = styled(ViewChatMessage)`
  width: 200px;
  text-align: center;
  border: 1px solid #ccc;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);
  opacity: 0;
`;

export const ViewTootTipMessage = styled(ViewMessage)`
  font-weight: 700;
  border: none;
  box-shadow: none;
  margin-bottom: 0px;
`;

// Wrapper component to contain input box and button
export const ViewTextBoxContainer: FC<{
  container: CopilotSyleContainerType;
  position: CopilotStylePositionType;
  id: string;
  children?: React.ReactNode;
}> = styled(View)`
  position: absolute;
  right: 25px;
  margin: 0;
  z-index: 9999999;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;

  ${({ container, position }) => {
    const positions =
      (position as CopilotStylePositionType) ||
      (container?.position as CopilotStylePositionType);
    switch (positions) {
      case "top-left":
      case "top-right":
      case "top-center":
        return `
          top: 20px;
        `;
      case "bottom-right":
      case "bottom-left":
      case "bottom-center":
        return `
          bottom: 20px;
        `;
      default:
        return ""; // If no position matches, default to an empty string
    }
  }}
`;

export const ViewTextBox: FC<{
  bgColor: string;
  children?: React.ReactNode;
  placeholder?: string;
  defaultValue: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
}> = styled.TextInput`
  padding: 15px 32px 15px 8px;
  border: 1px solid ${({ bgColor }) => bgColor};
  border-radius: 5px;
  outline: none;
  width: 100%;
  margin-left: 25px;
`;

// Styled button
export const ViewTextBoxButton: FC<{
  iskeyboard?: string;
  onPress: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  activeOpacity?: number;
}> = styled.TouchableOpacity`
  position: absolute;
  top: 5px;
  right: 0;
  padding: 8px;
  border: none;
  border-radius: 0 5px 5px 0;
  color: #fff;
  background-color: transparent;

  ${({ iskeyboard }) =>
    iskeyboard === "true" &&
    `
      top: 5px;
      right: 5px;
    `}
`;

// button, voice -> theme -> defaults

export const ViewKeyboardEmptyContainer = styled(ViewKeyboardButton)`
  box-shadow: none;
  height: 0px;
  background: unset;
`;
