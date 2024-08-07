import React, { useEffect, useRef } from "react";
import Streamingi18nText from "../streaming/Streamingi18nText";
import {
  FormConfig,
  Streamingi18nTextRef,
  i18nMessage,
  useLanguage,
  MessageWorkflow,
} from "@sugar-ai/core";

export const Submission: React.FC<{
  postSubmissionMessage: i18nMessage;
  answers: any[];
  formConfig: FormConfig;
}> = ({ postSubmissionMessage, answers, formConfig }) => {
  const { language, voice } = useLanguage();
  const postSubmissionMessageRef = useRef<Streamingi18nTextRef>(null);

  const runWorkflow = async () => {
    const workflow = new MessageWorkflow();
    workflow.addMessage(postSubmissionMessageRef);
    // await workflow.run();
  };

  useEffect(() => {
    if (postSubmissionMessageRef && language && voice) {
      setTimeout(() => runWorkflow(), 1000);
    }
  }, [postSubmissionMessageRef, language, voice]);

  useEffect(() => {
    // Submit all answers to the server
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
      <Streamingi18nText
        ref={postSubmissionMessageRef}
        message={postSubmissionMessage}
        formConfig={formConfig}
      />
    </div>
  );
};

export default Submission;
