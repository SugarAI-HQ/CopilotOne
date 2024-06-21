import Mic from "../../icons/mic";
import OpenMic from "../../icons/open_mic";
import Speak from "../../icons/speak";
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
  isSpeaking = false,
  stopSpeaking,
}) => {
  return (
    <VoiceButton
      id={`sugar-ai-voice-button-${buttonId}`}
      className="sugar-ai-copilot-voice-button"
      style={voiceButtonStyle}
      button={currentStyle?.voiceButton}
      ispermissiongranted={ispermissiongranted.toString()}
      isprocessing={isprocessing.toString()}
      islistening={islistening.toString()}
    >
      {islistening ? (
        <OpenMic
          size={currentStyle?.voiceButton?.iconSize}
          color={currentStyle?.voiceButton.color}
          onClick={(e) => {
            void startListening(e);
          }}
        />
      ) : isSpeaking ? (
        <Speak
          size={currentStyle?.voiceButton?.iconSize}
          color={currentStyle?.voiceButton.color}
          onClick={(e) => {
            void stopSpeaking(e);
          }}
        />
      ) : (
        <Mic
          color={currentStyle?.voiceButton.color}
          size={currentStyle?.voiceButton?.iconSize}
          onClick={(e) => {
            void startListening(e);
          }}
        />
      )}
      {isprocessing && (
        <Spinner
          style={{
            position: "absolute",
            bottom: "0px",
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
