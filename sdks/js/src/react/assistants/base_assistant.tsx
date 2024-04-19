import { z } from "zod";
import { styled, css, keyframes } from "styled-components";
import {
  copilotSyleButtonSchema,
  type CopilotSyleThemeType,
  type CopilotStylePositionType,
  type CopilotSyleContainerType,
} from "../../schema";

const copilotButtonProps = z.object({
  button: copilotSyleButtonSchema,
  isprocessing: z.string(),
  ispermissiongranted: z.string(),
  islistening: z.string(),
});
type CopilotButtonPropsType = z.infer<typeof copilotButtonProps>;

export const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

export const sparkle = keyframes`
  0%, 100% {
    opacity: 0.5;
    transform: scale(1.1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }`;

export const ChatContainer = styled.div<{
  container: CopilotSyleContainerType;
  position: CopilotStylePositionType;
}>`
  position: fixed;
  ${({ container, position }) => {
    const positions =
      (position as CopilotStylePositionType) ||
      (container?.position as CopilotStylePositionType);

    switch (positions) {
      case "top-left":
        return css`
          top: 25px;
          left: 25px;
        `;
      case "top-right":
        return css`
          top: 25px;
          right: 25px;
        `;
      case "bottom-left":
        return css`
          bottom: 25px;
          left: 25px;
        `;
      case "bottom-right":
        return css`
          bottom: 25px;
          right: 25px;
        `;
      case "top-center":
        return css`
          top: 25px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom-center":
        return css`
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
        `;
      default:
        return ""; // If no position matches, default to an empty string
    }
  }}
  margin: ${({ container }) => container?.margin};
  width: fit-content;
  height: fit-content;
  z-index: 1000; /* Ensure the widget is above other elements */
`;

export const ChatMessage = styled.div<{
  container: CopilotSyleContainerType;
  position: CopilotStylePositionType;
}>`
  position: fixed;
  width: 300px;
  max-height: calc(100vh - 120px);
  background-color: transparent;
  border-radius: 10px;
  animation-duration: 0.5s;
  animation-name: d;
  animation-fill-mode: forwards;
  overflow-y: auto;
  z-index: 1000; // Ensure the chat window is above most elements

  ${({ container, position }) => {
    const positions =
      (position as CopilotStylePositionType) ||
      (container?.position as CopilotStylePositionType);

    switch (positions) {
      case "top-left":
        return css`
          top: 95px;
          left: 20px;
        `;
      case "top-right":
        return css`
          top: 95px;
          right: 20px;
        `;
      case "bottom-left":
        return css`
          bottom: 95px;
          left: 20px;
        `;
      case "bottom-right":
        return css`
          bottom: 95px;
          right: 20px;
        `;
      case "top-center":
        return css`
          top: 70px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case "bottom-center":
        return css`
          bottom: 70px;
          left: 50%;
          transform: translateX(-50%);
        `;
      default:
        return ""; // If no position matches, default to an empty string
    }
  }}
`;

export const ChatButton = styled.button<CopilotButtonPropsType>`
  background-color: ${({ button }) => button?.bgColor};
  color: ${({ button }) => button?.color};
  border: none;
  border-radius: 50%;
  width: ${({ button }) => button?.width};
  height: ${({ button }) => button?.height};
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 3px 12px;
  text-align: -webkit-center;
  cursor: ${({ isprocessing, ispermissiongranted }) =>
    isprocessing === "true" || ispermissiongranted !== "true"
      ? "not-allowed"
      : "pointer"};
  opacity: ${({ isprocessing, ispermissiongranted }) =>
    isprocessing === "true" || ispermissiongranted !== "true" ? "0.5" : "1"};
  ${({ islistening }) =>
    islistening === "true"
      ? css`
          animation: ${pulse} 1s infinite;
        `
      : css`
          animation: ${sparkle} 3s ease-in-out 4s infinite;
        `}
  &:hover {
    background-color: ${({ isprocessing, ispermissiongranted, button }) =>
      isprocessing === "true" || ispermissiongranted !== "true"
        ? button?.bgColor
        : button?.bgColor}
`;

export const Message = styled.div<{ theme: CopilotSyleThemeType }>`
  background-color: ${({ theme }) => theme?.primaryColor};
  color: ${({ theme }) => theme?.secondaryColor};
  font-size: ${({ theme }) => theme?.fontSize};
  font-family: ${({ theme }) => theme?.fontFamily};
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);
`;

export const ToolTipWindow = styled(ChatMessage)`
  width: 200px;
  text-align: center;
  border: 1px solid #ccc;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.2);
`;

export const TootTipMessage = styled(Message)`
  font-weight: 700;
  border: none;
  box-shadow: none;
  margin-bottom: 0px;
`;
