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

  // return <>{JSON.stringify(lrCompletion)}</>;
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
                    {/* Render arguments */}
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
          lrCompletion[0].message &&
          (lrCompletion[0].message?.content ||
            lrCompletion[0].message?.role === "assistant") ? (
            <span>
              <span>{lrCompletion[0].message.role}:</span>
              <span>{lrCompletion[0].message.content}</span>
            </span>
          ) : (
            JSON.stringify(lrCompletion)
          )}
        </>
      )}
    </>
  );
};

export default PromptViewResponse;
