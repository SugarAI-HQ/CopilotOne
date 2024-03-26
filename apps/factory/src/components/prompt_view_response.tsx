import React, { useEffect, useState } from "react";
import { LlmResponse, TextResponseVersion } from "~/validators/llm_respose";
import { LogOutput } from "~/validators/prompt_log";
import { skillSchema } from "~/validators/service";

const PromptViewResponse = ({
  lrResponseData,
}: {
  lrResponseData: TextResponseVersion;
}) => {
  const lrCompletion =
    lrResponseData.completion as TextResponseVersion["completion"];

  if (typeof lrCompletion === "string") {
    return <>{lrCompletion}</>;
  }

  return (
    <>
      {lrCompletion.tool_calls instanceof Array &&
      lrCompletion.tool_calls.length > 0 ? (
        <ul>
          {lrCompletion.tool_calls.map((toolCall: any, index: any) => (
            <li key={index}>
              <div>
                <p>Function: {toolCall.function.name}</p>
                <p>Arguments:</p>
                <ul>
                  {Object.entries(JSON.parse(toolCall.function.arguments)).map(
                    ([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value as string}
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <hr style={{ margin: "10px 0" }} />
            </li>
          ))}
        </ul>
      ) : (
        <>{lrCompletion}</>
      )}
    </>
  );
};

export default PromptViewResponse;
