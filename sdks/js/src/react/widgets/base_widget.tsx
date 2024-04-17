import styled, { css, keyframes } from "styled-components";
import {
  type CopilotStylePositionType,
  type CopilotSyleContainerType,
} from "../../schema";

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
