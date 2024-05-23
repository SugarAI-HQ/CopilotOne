import React from "react";
import { ChatMessage, Message as MessageStyled } from "../base_styled";

const Message = ({
  finalOutput,
  aiResponse,
  currentStyle,
  position,
  buttonId,
  messageStyle,
}) => {
  return (
    <ChatMessage
      container={currentStyle?.container}
      position={position}
      style={messageStyle}
      id={`sugar-ai-chat-message-${buttonId}`}
      className="sugar-ai-chat-message"
    >
      {finalOutput && (
        <MessageStyled
          theme={currentStyle?.theme}
          id={`sugar-ai-message-${buttonId}`}
          className="sugar-ai-message"
        >
          {finalOutput}
        </MessageStyled>
      )}
      {aiResponse && (
        <MessageStyled
          theme={currentStyle?.theme}
          id={`sugar-ai-message-${buttonId}`}
          className="sugar-ai-message"
          role="assistant"
        >
          {aiResponse}
        </MessageStyled>
      )}
    </ChatMessage>
  );
};

export default Message;
