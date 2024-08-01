import { CopilotSyleButtonType, copilotStyleDefaults } from "@sugar-ai/core";
import Mic from "../../icons/mic";
import OpenMic from "../../icons/open_mic";
import Speak from "../../icons/speak";
import Spinner from "../../icons/spinner";
import { VoiceButton } from "../base_styled";
import { Hourglass } from "lucide-react";

const VoiceButtonWithStates = ({
  startListening,
  ispermissiongranted,
  isprocessing,
  islistening,
  iswaiting = false,
  buttonId,
  isSpeaking = false,
  stopSpeaking,
  currentStyle = copilotStyleDefaults,
  voiceButtonStyle, //= copilotStyleDefaults.voiceButton,
}) => {
  const latestCurrentStyle = { ...copilotStyleDefaults, ...currentStyle };

  const latestVoiceButtonStyle = {
    ...voiceButtonStyle,
    ...{
      position: "relative",
      // width: "100px",
      // height: "100px",
    },
  };

  const showSpinner = isprocessing || iswaiting;

  const iconStyle = {
    margin: "17px",
  };

  return (
    <VoiceButton
      id={`sugar-ai-voice-button-${buttonId}`}
      className="sugar-ai-copilot-voice-button"
      style={latestVoiceButtonStyle}
      button={latestCurrentStyle?.voiceButton as CopilotSyleButtonType}
      ispermissiongranted={ispermissiongranted.toString()}
      isprocessing={isprocessing.toString()}
      islistening={islistening.toString()}
    >
      <div
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          // pointer-events: none; /* Ensure SVGs do not interfere with button clicks */</VoiceButton>
        }}
      >
        {islistening ? (
          <OpenMic
            style={iconStyle}
            size={latestCurrentStyle?.voiceButton?.iconSize}
            color={latestCurrentStyle?.voiceButton?.color}
            onClick={(e) => {
              void startListening(e);
            }}
          />
        ) : isSpeaking ? (
          <Speak
            style={iconStyle}
            size={latestCurrentStyle?.voiceButton?.iconSize}
            color={latestCurrentStyle?.voiceButton?.color}
            onClick={(e) => {
              void stopSpeaking(e);
            }}
          />
        ) : iswaiting ? (
          <Hourglass style={iconStyle} />
        ) : (
          <Mic
            style={iconStyle}
            color={latestCurrentStyle?.voiceButton?.color}
            size={latestCurrentStyle?.voiceButton?.iconSize}
            onClick={(e) => {
              void startListening(e);
            }}
          />
        )}
        {showSpinner && (
          <Spinner
            style={{
              position: "absolute",
              opacity: "0.4",
              display: "block",
              top: "-6px",
              left: "-6px",
            }}
            size={"72"}
            color={latestCurrentStyle?.voiceButton?.bgColor}
          />
        )}
      </div>
    </VoiceButton>
  );
};

export default VoiceButtonWithStates;
