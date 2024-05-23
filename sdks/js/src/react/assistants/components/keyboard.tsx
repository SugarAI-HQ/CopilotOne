import React from "react";
import { KeyboardButton } from "../base_styled";
import KeyboardIcon from "../../common/icons/keyboard";
// import KeyboardIcon from "@sugar-ai/core";

const Keyboard = ({ style, currentStyle, enableKeyboard }) => {
  return (
    <KeyboardButton
      className="sugar-ai-copilot-keyboard-button"
      style={style}
      button={currentStyle}
      onClick={enableKeyboard}
    >
      <KeyboardIcon width={"20"} height={"14"} color={currentStyle?.bgColor} />
    </KeyboardButton>
  );
};

export default Keyboard;
