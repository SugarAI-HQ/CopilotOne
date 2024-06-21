import React from "react";
import { KeyboardButton } from "../base_styled";
import KeyboardIcon from "../../icons/keyboard";
import Chat from "../../icons/chat";
// import KeyboardIcon from "@sugar-ai/core";

const Keyboard = ({
  style,
  currentStyle,
  enableKeyboard,
  withvoice = "false",
}) => {
  return (
    <KeyboardButton
      className="sugar-ai-copilot-keyboard-button"
      style={style}
      button={currentStyle}
      onClick={enableKeyboard}
      withvoice={withvoice}
    >
      {/* <KeyboardIcon width={"20"} height={"14"} color={currentStyle?.bgColor} /> */}
      {withvoice === "true" ? (
        <KeyboardIcon
          width={"20"}
          height={"14"}
          color={currentStyle?.bgColor}
        />
      ) : (
        <Chat
          width={"26"}
          height={"30"}
          color={currentStyle?.color}
          size={currentStyle?.iconSize}
        />
      )}
    </KeyboardButton>
  );
};

export default Keyboard;
