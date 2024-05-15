import React from "react";
import { ToolTipContainer, TootTipMessage } from "../base_styled";

const ToolTip = ({
  currentStyle,
  position,
  buttonId,
  toolTipContainerStyle,
  toolTipMessageStyle,
  tipMessage,
}) => {
  return (
    <ToolTipContainer
      container={currentStyle?.container}
      config={currentStyle?.toolTip}
      position={position}
      style={toolTipContainerStyle}
      id={`sugar-ai-tool-tip-${buttonId}`}
      className="sugar-ai-tool-tip"
    >
      <TootTipMessage
        theme={currentStyle?.theme}
        id={`sugar-ai-tool-tip-message-${buttonId}`}
        style={toolTipMessageStyle}
        className="sugar-ai-tool-tip-message"
      >
        {tipMessage}
      </TootTipMessage>
    </ToolTipContainer>
  );
};

export default ToolTip;
