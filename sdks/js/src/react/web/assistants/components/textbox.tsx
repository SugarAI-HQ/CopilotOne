import Keyboard from "../../../icons/keyboard";
import Mic from "../../../icons/mic";
import {
  TextBox as TextBoxStyled,
  TextBoxButton,
  TextBoxContainer,
} from "../base_styled";

const TextBox = ({
  currentStyle,
  position,
  buttonId,
  setTextMessage,
  textMessage,
  startSending,
  enableKeyboard,
  iskeyboard,
}) => {
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
        onChange={(e) => {
          setTextMessage(e.target.value);
        }}
        onKeyUp={(e) => {
          if (e.key === "Enter") startSending();
        }}
        id={`sugar-ai-text-box-${buttonId}`}
        className="sugar-ai-text-box"
      />
      <TextBoxButton
        onClick={enableKeyboard}
        iskeyboard={iskeyboard.toString()}
      >
        {iskeyboard ? (
          <Keyboard
            width={"20"}
            height={"14"}
            color={currentStyle?.keyboardButton?.bgColor}
            size={currentStyle?.keyboardButton?.iconSize}
          />
        ) : (
          <Mic
            color={currentStyle?.keyboardButton?.bgColor}
            size={currentStyle?.keyboardButton?.iconSize}
            width={"26"}
            height={"30"}
          />
        )}
      </TextBoxButton>
    </TextBoxContainer>
  );
};

export default TextBox;
