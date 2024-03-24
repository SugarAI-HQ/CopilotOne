import React, { useEffect, useState } from "react";
import {
  LlmResponse,
  TextResponseV1,
  TextResponseV2,
} from "~/validators/llm_respose";
import { LogOutput } from "~/validators/prompt_log";
import { skillSchema } from "~/validators/service";

const PromptViewResponse = ({
  lrCompletion,
}: {
  lrCompletion: LlmResponse["data"];
}) => {
  return (
    <>
      {lrCompletion instanceof Array &&
      lrCompletion.length > 0 &&
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
        <>{lrCompletion}</>
      )}
    </>
  );
};

export default PromptViewResponse;
