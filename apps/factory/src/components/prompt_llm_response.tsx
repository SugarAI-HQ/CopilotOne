import React from "react";
import Typography from "@mui/material/Typography";
import OutputTextAnimation from "./output_text_animation";
import { Box } from "@mui/material";
import {
  ImageResponseV1,
  LlmResponse,
  ResponseType,
  TextResponseV1,
  TextResponseV2,
  TextResponseVersion,
} from "~/validators/llm_respose";
import { LogOutput } from "~/validators/prompt_log";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import DownloadButtonBase64 from "./download_button_base64";
import CopyToClipboardButton from "./copy_button";
import Image from "next/image";
import { hasImageModels } from "~/utils/template";
import { getAppUrl } from "~/utils/log";
import PromptViewResponse from "./prompt_view_response";

interface PromptLlmResponseProps {
  pl: LogOutput;
  imgClassName?: string;
  textAnimation?: boolean;
  cube?: boolean;
}

const PromptLlmResponse: React.FC<PromptLlmResponseProps> = ({
  pl,
  imgClassName,
  textAnimation,
  cube,
}) => {
  const lr = pl?.llmResponse as LlmResponse;
  return (
    <>
      {lr.data ? (
        <LlmDataResponse
          pl={pl}
          imgClassName={imgClassName}
          textAnimation={textAnimation}
          cube={cube}
        />
      ) : (
        <LlmLlmErrorResponse
          pl={pl}
          imgClassName={imgClassName}
          textAnimation={textAnimation}
          cube={cube}
        />
      )}
    </>
  );
};

const LlmDataResponse: React.FC<PromptLlmResponseProps> = ({
  pl,
  imgClassName,
  textAnimation,
  cube,
}) => {
  let lr = pl?.llmResponse as LlmResponse;
  const lrCompletion = lr.data as TextResponseVersion;
  // const lrSkillCompletion = lrCompletion as TextResponseV2["completion"];

  if (lr?.data?.t === ResponseType.TEXT || lr.data?.t === ResponseType.CODE) {
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
            {pl?.completion_tokens ? (
              <>
                <PromptViewResponse
                  lrResponseData={lr.data as TextResponseVersion}
                />
                <p>tokens: {pl?.completion_tokens}</p>
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
                    <PromptViewResponse
                      lrResponseData={lr.data as TextResponseVersion}
                    />
                  </code>
                </pre>
              </Typography>
            )}
          </Box>
        ) : lr.data.completion instanceof Array ? (
          <PromptViewResponse lrResponseData={lr.data as TextResponseVersion} />
        ) : (
          <OutputTextAnimation
            output={(lr.data as TextResponseVersion).completion}
            modelType={pl?.llmModelType as string}
          />
        )}
      </>
    );
  } else if (lr.data?.t === ResponseType.IMAGE) {
    let llr = lr.data as ImageResponseV1;
    return (
      <Image
        src={`${getAppUrl()}/generated/assets/logs/${pl?.id}/image.png?w=${128}&h=${128}`}
        blurDataURL={`${getAppUrl()}/generated/assets/og.png`}
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

const LlmLlmErrorResponse: React.FC<PromptLlmResponseProps> = ({ pl }) => {
  let lr = pl?.llmResponse as LlmResponse;
  return (
    <Typography variant="body2" color="error">
      {`${lr.error?.code} - ${lr.error?.message}`}
    </Typography>
  );
};

export const LlmResponseAction: React.FC<PromptLlmResponseProps> = ({ pl }) => {
  let lr = pl?.llmResponse as LlmResponse;
  let llrImage = lr.data as ImageResponseV1;
  let llrText = lr.data as TextResponseV1;
  return (
    <>
      {pl?.completion &&
        (hasImageModels(pl.llmModelType) ? (
          <DownloadButtonBase64 logId={pl?.id} />
        ) : (
          <CopyToClipboardButton
            textToCopy={pl?.completion}
            textToDisplay={"Copy"}
          />
        ))}
      {lr?.data &&
        (hasImageModels(pl?.llmModelType as ModelTypeType) ? (
          <DownloadButtonBase64 logId={pl?.id as string} />
        ) : (
          lr?.data && (
            <CopyToClipboardButton
              textToCopy={llrText?.completion}
              textToDisplay={"Copy"}
            />
          )
        ))}

      {lr?.error && (
        <CopyToClipboardButton
          textToCopy={`${lr.error.code} - ${lr.error.message}` as string}
          textToDisplay={"Copy"}
        />
      )}
    </>
  );
};

export default PromptLlmResponse;
