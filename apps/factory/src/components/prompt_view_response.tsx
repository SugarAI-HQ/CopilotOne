import React from "react";
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
  const lrSkillCompletion = lrCompletion as TextResponseV2["completion"];
  return (
    <>
      {lrSkillCompletion.tool_calls ? (
        <ul>
          {lrSkillCompletion.tool_calls.map((toolCall: any, index: any) => (
            <li key={index}>
              <div>
                <p>Function Name: {toolCall.function.name}</p>
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
