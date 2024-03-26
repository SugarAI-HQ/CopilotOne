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

  return (
    <>
      {lrCompletion instanceof Array &&
      lrCompletion.length > 0 &&
      lrCompletion[0].message.tool_calls &&
      lrCompletion[0].message.tool_calls.length > 0 ? (
        <ul>
          {lrCompletion[0].message.tool_calls.map(
            (toolCall: any, index: any) => (
              <li key={index}>
                <div>
                  <p>Function: {toolCall.function.name}</p>
                  <p>Arguments:</p>
                  <ul>
                    {Object.entries(
                      JSON.parse(toolCall.function.arguments),
                    ).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value as string}
                      </li>
                    ))}
                  </ul>
                </div>
                <hr style={{ margin: "10px 0" }} />
              </li>
            ),
          )}
        </ul>
      ) : (
        <>
          {lrCompletion instanceof Array &&
          lrCompletion.length > 0 &&
          lrCompletion[0].message.content
            ? lrCompletion[0].message.content
            : lrCompletion}
        </>
      )}
    </>
  );
};

export default PromptViewResponse;
