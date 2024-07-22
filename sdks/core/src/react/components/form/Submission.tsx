import { Streamingi18TextRef, VoiceConfig } from "~/react/schema/form";
import React, { useEffect, useRef } from "react";
import Streamingi18Text from "../streaming/Streamingi18Text";
import { i18Message } from "~/react/schema/message";
import { useLanguage } from "..";
import MessageWorkflow from "~/workflow/MessageWorkflow";

export const Submission: React.FC<{
  postSubmissionMessage: i18Message;
  answers: any[];
  voiceConfig: VoiceConfig;
}> = ({ postSubmissionMessage, answers, voiceConfig }) => {
  const { language, voice } = useLanguage();
  const postSubmissionMessageRef = useRef<Streamingi18TextRef>(null);

  const runWorkflow = async () => {
    const workflow = new MessageWorkflow();
    workflow.addMessage(postSubmissionMessageRef);

    await workflow.run();
  };

  useEffect(() => {
    if (postSubmissionMessageRef && language && voice) {
      setTimeout(() => runWorkflow(), 1000);
    }
  }, [postSubmissionMessageRef, language, voice]);

  useEffect(() => {
    // Submit answers to the server
    fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(answers),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [answers]);

  return (
    <div className="p-4">
      <Streamingi18Text
        ref={postSubmissionMessageRef}
        message={postSubmissionMessage}
        voiceConfig={voiceConfig}
      />
    </div>
  );
};

export default Submission;
