import Mic from "../../icons/mic";
import {
  TextBox as TextBoxStyled,
  TextBoxButton,
  TextBoxContainer,
} from "../base_styled";
import { useState } from "react";
import Chat from "../../icons/chat";
import Send from "../../icons/send";
import Loader from "../../icons/loader";

const TextBox = ({
  currentStyle,
  position,
  buttonId,
  setTextMessage,
  textMessage,
  startSending,
  enableKeyboard,
  isprocessing,
  iskeyboard,
}) => {
  const [isTyping, setIsTyping] = useState(false);

  const onTyping = (text: string) => {
    setTextMessage(text);
    setIsTyping(text.length !== 0);
  };

  const commonProps = {
    width: "26",
    height: "30",
    color: currentStyle?.keyboardButton?.bgColor,
    size: currentStyle?.keyboardButton?.iconSize,
    onClick: (e) => {
      e.preventDefault();
      if (isTyping) {
        startSending();
        setIsTyping(false);
      } else {
        enableKeyboard();
      }
    },
  };

  const loaderProps = {
    color: currentStyle?.keyboardButton?.bgColor,
    width: "30",
    height: "30",
  };

  return (
    <TextBoxContainer
      container={currentStyle?.container}
      position={position}
      id={`sugar-ai-text-box-container-${buttonId}`}
      className="sugar-ai-text-box-container"
    >
      <TextBoxStyled
        type="text"
        placeholder={currentStyle?.keyboardButton?.placeholder}
        value={textMessage}
        color={currentStyle?.keyboardButton?.bgColor}
        bgColor={currentStyle?.keyboardButton?.color}
        onChange={(e) => {
          onTyping(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter" && textMessage.trim() !== "") {
            startSending();
            setIsTyping(false);
          }
        }}
        id={`sugar-ai-text-box-${buttonId}`}
        className="sugar-ai-text-box"
        disabled={isprocessing}
      />
      <TextBoxButton iskeyboard={iskeyboard.toString()}>
        {isTyping || iskeyboard ? (
          isTyping ? (
            <Send {...commonProps} />
          ) : isprocessing ? (
            <Loader {...loaderProps} />
          ) : (
            <Chat {...commonProps} />
          )
        ) : isprocessing ? (
          <Loader {...loaderProps} />
        ) : (
          <Mic {...commonProps} />
        )}
      </TextBoxButton>
    </TextBoxContainer>
  );
};

export default TextBox;
