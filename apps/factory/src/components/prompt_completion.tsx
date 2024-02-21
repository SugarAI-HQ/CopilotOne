import React from "react";
import Typography from "@mui/material/Typography";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import OutputTextAnimation from "./output_text_animation";
import { Box } from "@mui/material";
import { LogSchema } from "~/validators/prompt_log";
import { LlmResponse, TextResponseV1 } from "~/validators/llm_respose";
import Image from "next/image";

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
  if (pl?.llmModelType !== ModelTypeSchema.Enum.TEXT2IMAGE) {
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
                {pl.completion
                  ? pl.completion
                  : (lr.data as TextResponseV1).completion}
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
                    {pl.completion
                      ? pl.completion
                      : (lr.data as TextResponseV1).completion}
                  </code>
                </pre>
              </Typography>
            )}
          </Box>
        ) : (
          <OutputTextAnimation
            output={(lr.data as TextResponseV1).completion as string}
            modelType={pl.llmModelType}
          />
        )}
      </>
    );
  } else if (pl?.llmModelType === ModelTypeSchema.Enum.TEXT2IMAGE) {
    const w = cube ? 1024 : 128;
    const h = cube ? 1024 : 128;
    return (
      <Image
        src={`${process.env.NEXT_PUBLIC_APP_URL}/generated/assets/logs/${pl.id}/image.png?w=${w}&h=${h}`}
        blurDataURL={`${process.env.NEXT_PUBLIC_APP_URL}/generated/assets/og.png`}
        alt="Image"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          // borderRadius: "10px",
          transition: "opacity 0.3s ease",
          zIndex: 2,
        }}
        className={`${
          cube ? "outputImage h-full w-full" : imgClassName
        } object-fill`}
        placeholder="blur"
        loading="lazy"
        width={128}
        height={128}
      />
    );
  }
};

export default PromptCompletion;
