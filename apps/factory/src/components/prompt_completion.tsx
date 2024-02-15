import React from "react";
import Typography from "@mui/material/Typography";
import {
  ModelTypeType,
  ModelTypeSchema,
} from "~/generated/prisma-client-zod.ts";
import OutputTextAnimation from "./output_text_animation";
import { Box } from "@mui/material";
import { LogSchema } from "~/validators/prompt_log";

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
                {pl.completion}
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
                    {pl.completion}
                  </code>
                </pre>
              </Typography>
            )}
          </Box>
        ) : (
          <OutputTextAnimation
            output={pl.completion as string}
            modelType={pl.llmModelType}
          />
        )}
      </>
    );
  } else if (pl?.llmModelType === ModelTypeSchema.Enum.TEXT2IMAGE) {
    const w = cube ? 1024 : 128;
    const h = cube ? 1024 : 128;
    return (
      <img
        className={`${
          cube ? "outputImage h-full w-full" : imgClassName
        } object-fill`}
        src={`${process.env.NEXT_PUBLIC_APP_URL}/generated/assets/logs/${pl.id}?w=${w}&h=${h}`}
        alt="Image"
      />
    );
  }
};

export default PromptCompletion;
