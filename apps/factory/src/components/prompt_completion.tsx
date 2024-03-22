import React from "react";
import Typography from "@mui/material/Typography";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import OutputTextAnimation from "./output_text_animation";
import { Box } from "@mui/material";
import { LogSchema } from "~/validators/prompt_log";
import {
  LlmResponse,
  TextResponseV1,
  TextResponseV2,
} from "~/validators/llm_respose";
import Image from "next/image";
import { hasImageModels } from "~/utils/template";
import { getAppUrl } from "~/utils/log";
import PromptViewResponse from "./prompt_view_response";

interface PromptCompletionProps {
  pl: LogSchema;
  imgClassName?: string;
  textAnimation: boolean;
  cube?: boolean;
}

const PromptCompletion: React.FC<PromptCompletionProps> = ({
  pl,
  imgClassName,
  textAnimation,
  cube,
}) => {
  let lr = pl?.llmResponse as LlmResponse;
  const lrCompletion = lr.data as TextResponseV1 | TextResponseV2;
  const lrSkillCompletion = lrCompletion as TextResponseV2["completion"];

  if (!hasImageModels(pl?.llmModelType as ModelTypeType)) {
    return (
      <>
        {textAnimation === false ? (
          <Box
            sx={{
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "Highlight",
              },
              maxHeight: "150px",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                boxShadow: "none",
              },
            }}
          >
            {pl.completion_tokens ? (
              <>
                {pl.completion ? (
                  pl.completion
                ) : (
                  <PromptViewResponse
                    lrCompletion={
                      (lr.data as TextResponseV1 | TextResponseV2)
                        .completion as LlmResponse["data"]
                    }
                  />
                )}
                <p>tokens: {pl.completion_tokens}</p>
              </>
            ) : (
              <Typography variant="body2" textAlign={"left"}>
                <pre>
                  <code
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                    }}
                  >
                    {pl.completion ? (
                      pl.completion
                    ) : (
                      <PromptViewResponse
                        lrCompletion={
                          (lr.data as TextResponseV1 | TextResponseV2)
                            .completion as LlmResponse["data"]
                        }
                      />
                    )}
                  </code>
                </pre>
              </Typography>
            )}
          </Box>
        ) : lrSkillCompletion.tool_calls ? (
          <PromptViewResponse
            lrCompletion={
              (lr.data as TextResponseV1 | TextResponseV2)
                .completion as LlmResponse["data"]
            }
          />
        ) : (
          <OutputTextAnimation
            output={(lr.data as TextResponseV1).completion as string}
            modelType={pl.llmModelType}
          />
        )}
      </>
    );
  } else if (hasImageModels(pl?.llmModelType as ModelTypeType)) {
    const w = cube ? 1024 : 128;
    const h = cube ? 1024 : 128;
    console.log(cube);
    return (
      <Image
        src={`${getAppUrl()}/generated/assets/logs/${
          pl.id
        }/image.png?w=${w}&h=${h}`}
        blurDataURL={`${getAppUrl()}/generated/assets/og.png`}
        alt="Image"
        style={
          {
            // objectFit: "cover",
            // objectFit: "contain",
            // width: "100%",
            // height: "100%",
            // // borderRadius: "10px",
            // transition: "opacity 0.3s ease",
            // zIndex: 2,
          }
        }
        className={`${
          cube ? "outputImage h-full w-full" : imgClassName
        } object-fill`}
        placeholder="blur"
        loading="lazy"
        width={w}
        height={h}
      />
    );
  }
};

export default PromptCompletion;
