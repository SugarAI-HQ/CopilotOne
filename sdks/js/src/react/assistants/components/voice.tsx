import Mic from "../../icons/mic";
import Spinner from "../../icons/spinner";
import { VoiceButton } from "../base_styled";

const Voice = ({
  currentStyle,
  voiceButtonStyle,
  startListening,
  ispermissiongranted,
  isprocessing,
  islistening,
  buttonId,
}) => {
  return (
    <VoiceButton
      id={`sugar-ai-voice-button-${buttonId}`}
      className="sugar-ai-copilot-voice-button"
      style={voiceButtonStyle}
      onClick={(e) => {
        void startListening(e);
      }}
      button={currentStyle?.voiceButton}
      ispermissiongranted={ispermissiongranted.toString()}
      isprocessing={isprocessing.toString()}
      islistening={islistening.toString()}
    >
      <Mic
        color={currentStyle?.voiceButton.color}
        size={currentStyle?.voiceButton?.iconSize}
      />
      {isprocessing && (
        <Spinner
          style={{
            position: "absolute",
            bottom: "-6px",
            left: "54px",
            opacity: "0.4",
          }}
          size={"72"}
          color={currentStyle?.voiceButton.bgColor}
        />
      )}
    </VoiceButton>
  );
};

export default Voice;
