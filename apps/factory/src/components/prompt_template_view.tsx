import React, { useEffect, useState } from "react";
import Header from "~/components/marketplace/header";
import humanizeString from "humanize-string";
import LabelIcons from "./label_icon";

import {
  Container,
  Box,
  Stack,
  Checkbox,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { api } from "~/utils/api";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import {
  getUniqueJsonArray,
  getVariables,
  hasImageEditor,
} from "~/utils/template";
import {
  GenerateInput,
  GenerateOutput,
  GetPromptOutput,
} from "~/validators/service";
import FormControlLabel from "@mui/material/FormControlLabel";
import PromptOutput from "./prompt_output";
import {
  EntityTypesSchema,
  ModelTypeSchema,
  ModelTypeType,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";
import { useSession, signIn } from "next-auth/react";
import Link from "@mui/material/Link";
const isDev = process.env.NODE_ENV === "development";
import { displayModes, DisplayModes } from "~/validators/base";
import PromptViewArrow from "./prompt_view_arrow";
import { LoadingButton } from "@mui/lab";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Counter from "./counter_responsetime";
import { PackageOutput as pp } from "~/validators/prompt_package";
import Footer from "./footer";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";
import ShareIcon from "@mui/icons-material/Share";
import ShareCube from "./cubes/share_cube";
import { NextSeo } from "next-seo";
import { providerModels } from "~/validators/base";
import { PromptDataSchemaType } from "~/validators/prompt_version";
import { promptEnvironment } from "~/validators/base";
import CopyToClipboardButton from "./copy_button";
import AddIcon from "@mui/icons-material/Add";
import DownloadButtonBase64 from "./download_button_base64";
import LikeButton from "./marketplace/like_button";
import { LogSchema } from "~/validators/prompt_log";
import toast from "react-hot-toast";
import { LlmResponse, processLlmResponse } from "~/validators/llm_respose";
import { LogOutput } from "~/validators/prompt_log";
import { ImageGallery } from "./image_gallery";
import { FileObject } from "~/utils/images";
import { getEditorVersion, hasImageModels } from "~/utils/template";
import PromptInputAttachment from "./prompt_input_attachment";
import { getDefaults } from "~/services/providers";
import { getAppUrl } from "~/utils/log";

interface PromptTemplateViewProps {
  username: string;
  packageName: string;
  template: string;
  versionOrEnvironment: string;
}

const PromptTemplateView: React.FC<PromptTemplateViewProps> = ({
  username,
  packageName,
  template,
  versionOrEnvironment,
}) => {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(isDev);
  const [pvrs, setVariables] = useState<PromptVariableProps[]>();
  const [pl, setPl] = useState<GenerateOutput>(null);
  const [promptOutput, setPromptOutput] = useState("");
  const [promptPerformance, setPromptPerformacne] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);
  const [isLoadingState, setIsLoading] = useState(false);
  const [openShareModal, setOpenShareModal] = useState<string>("");
  const [attachments, setAttachments] = useState<FileObject>();
  const { query } = useRouter();
  const router = useRouter();

  const { data: pv, isLoading } = api.cube.getPrompt.useQuery(
    {
      username: username,
      package: packageName,
      template: template,
      versionOrEnvironment: versionOrEnvironment?.toUpperCase(),
    },
    {
      onSuccess(item) {
        if (
          !hasImageEditor(
            item?.modelType as ModelTypeType,
            item?.llmProvider as string,
            item?.model as string,
          )
        ) {
          setVariables([
            ...getUniqueJsonArray(
              getVariables(
                JSON.stringify(
                  (item?.promptData as PromptDataSchemaType)?.data,
                ) || "",
              ),
              "key",
            ),
          ]);
        } else {
          setVariables([
            ...getUniqueJsonArray(getVariables(pv?.template || ""), "key"),
          ]);
        }
      },
    },
  );

  if (query.logId) {
    console.log(query.logId);
    const logId = query.logId as string;
    api.log.getLog.useQuery(
      {
        id: logId,
      },
      {
        onSuccess(item: LogOutput) {
          if (item !== null) {
            setPromptOutput(
              (processLlmResponse(
                item?.llmResponse as LlmResponse,
              ) as string) || (item?.completion as string as string),
            );
            setPl(item as GenerateOutput);
          }
        },
      },
    );
  }

  const handleVariablesChange = (k: string, v: string) => {
    setVariables((pvrs) => {
      // Step 2: Update the state
      return pvrs?.map((pvr) => {
        if (pvr.key === k) {
          // pvr.value = v;
          console.log(`gPv  ${pvr.key}: ${pvr.value} => ${v}`);
          return { ...pvr, ...{ value: v } };
        }
        return pvr;
      });
    });

    // console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
  };

  const generateMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service

  const handleRun = async (e: any) => {
    setIsLoading(true);
    console.log(`running template version ${versionOrEnvironment}`);

    // let data: { [key: string]: any } = {};
    // for (const item of pvrs as PromptVariableProps[]) {
    //   data[`${item.type}${item.key}`] = item.value;
    // }

    const data = Object.fromEntries(
      (pvrs ?? []).map((item) => [`${item.type}${item.key}`, item.value]),
    );

    const pl = await generateMutation.mutateAsync(
      {
        username: username,
        package: packageName || "",
        template: template || "",
        versionOrEnvironment: versionOrEnvironment?.toUpperCase() || "",
        isDevelopment: checked,
        environment: promptEnvironment.Enum.DEV,
        variables: data,
        attachments: attachments,
      } as GenerateInput,
      {
        onSettled(lPl: any, error) {
          let lr = lPl?.llmResponse as LlmResponse;
          setIsLoading(false);
          if (lr?.error) {
            toast.error(lr.error?.message as string, { duration: 10000 });
          }
        },
      },
    );

    console.log(`pl >>>>>>>: ${JSON.stringify(pl)}`);
    if (pl) {
      setPl(pl as GenerateOutput);
      setPromptOutput(
        (processLlmResponse(pl?.llmResponse as LlmResponse) as string) ||
          (pl?.completion as string as string),
      );

      setPromptPerformacne({
        latency: pl.latency,
        prompt_tokens: pl.prompt_tokens,
        completion_tokens: pl.completion_tokens,
        total_tokens: pl.total_tokens,
      });
    }
  };

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const handleSubmit = (e: any) => {
    if (session || pv?.runMode === PromptRunModesSchema.Enum.ALL) {
      handleRun(e);
    } else {
      signIn();
    }
    return;
  };

  const url = `${getAppUrl()}/${username}/${packageName}/${template}/${versionOrEnvironment}`;

  const shareUrl = `${url}${
    openShareModal === "imageshare" || query.logId
      ? `?logId=${query.logId || pl?.id}`
      : ""
  }`;
  const imageUrl = `${getAppUrl()}/generated/assets/${
    openShareModal === "imageshare" || query.logId
      ? `logs/${query.logId || pl?.id}/og.png`
      : "og.png"
  }`;

  const loadingButtonClass = {
    "&:hover ": {
      backgroundColor: "var(--sugarcube-component-bg-color-hover) !important",
      borderColor: "!important",
    },

    color: "white",
    backgroundColor: "var(--sugarcube-component-bg-color) !important",
  };

  const onFileUpload = (file: FileObject) => {
    setAttachments(file);
  };

  return (
    <>
      <NextSeo
        title={humanizeString(template)}
        description={pv?.description}
        // canonical={shareUrl}
        openGraph={{
          url: `${shareUrl}`,
          title: `${template}`,
          description: `${pv?.description}`,
          type: "website",
          images: [
            {
              url: `${imageUrl}`,
              width: 1200,
              height: 630,
              type: "image/png",
            },
          ],
        }}
        twitter={{
          cardType: "summary_large_image",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "var(--sugarhub-main-color)",
        }}
      >
        <Header headerName={"Sugar Cube"} />
        <Box
          sx={{
            padding: "1rem 0rem",
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircularProgress size={50} />
            </Box>
          ) : pv || !versionOrEnvironment ? (
            <Container>
              <div
                className="dark:border-gray-70  w-full rounded-lg border pb-2 pt-1 shadow"
                style={{ backgroundColor: "var(--sugarhub-tab-color)" }}
              >
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                  {isLoading ? (
                    <CircularProgress />
                  ) : (
                    pv?.templateId && (
                      <LikeButton
                        entityId={pv?.templateId}
                        entityType={EntityTypesSchema.enum.PromptTemplate}
                      />
                    )
                  )}
                  <Tooltip title="Share Cube" placement="top">
                    <IconButton onClick={() => setOpenShareModal("cubeshare")}>
                      <ShareIcon
                        sx={{
                          color: "var(--sugarhub-text-color)",
                          fontSize: "2rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  {session?.user.username == username && (
                    <Tooltip title="Edit Template" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          router.push(
                            `/dashboard/prompts/${pv?.promptPackageId}?ptid=${pv?.templateId}&edit=${true}`,
                          )
                        }
                      >
                        <EditIcon
                          sx={{
                            color: "var(--sugarhub-text-color)",
                            fontSize: "2rem",
                          }}
                        ></EditIcon>
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <ShareCube
                  setOpenShareModal={setOpenShareModal}
                  open={openShareModal}
                  shareUrl={shareUrl}
                  shareTitle={
                    openShareModal === "imageshare"
                      ? "Share Image"
                      : "Share Cube"
                  }
                />
                <Typography
                  sx={{
                    padding: { xs: "0 15px" },
                    color: "var(--sugarhub-text-color)",
                    fontSize: { xs: "3rem", sm: "3rem", lg: "3rem" },
                    fontWeight: "bold",
                  }}
                >
                  {!template ? "" : humanizeString(template)}
                </Typography>
                <Typography
                  variant="h6"
                  component="h6"
                  sx={{
                    padding: { xs: "0 15px" },
                    color: "var(--sugarhub-text-color)",
                    wordBreak: "break-word",
                  }}
                >
                  {pv?.description}
                </Typography>
                <Box sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
                  {pvrs && (
                    <>
                      {pv?.template && (
                        <PromptViewArrow
                          promptTemplate={pv?.template}
                          promptInputs={
                            (pv?.promptData as PromptDataSchemaType).data
                          }
                          haveroleUserAssistant={getEditorVersion(
                            pv?.modelType,
                            pv?.llmProvider,
                            pv?.model,
                          )}
                        />
                      )}

                      {pv?.modelType === ModelTypeSchema.Enum.IMAGE2IMAGE && (
                        <Box
                          sx={{
                            padding: 2,
                          }}
                        >
                          <PromptInputAttachment
                            onFileUpload={onFileUpload}
                            modelDefaultValues={getDefaults(
                              pv?.llmProvider,
                              pv?.model,
                            )}
                          />
                        </Box>
                      )}
                      <PromptVariables
                        vars={pvrs}
                        onChange={handleVariablesChange}
                        mode={displayModes.Enum.EDIT}
                        cube={true}
                      />
                    </>
                  )}
                </Box>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ padding: { xs: "0 15px" } }}
                >
                  <LoadingButton
                    onClick={handleSubmit}
                    sx={{
                      ...loadingButtonClass,
                      width: "8rem",
                      "&.Mui-disabled": {
                        borderColor: "var(--button-color-disable)",
                        color: "var(--button-color-disable)",
                        cursor: "not-allowed",
                        width: "8rem",
                      },
                    }}
                    loadingPosition="start"
                    startIcon={<PlayArrowIcon />}
                    loading={isLoadingState}
                  >
                    {isLoadingState ? (
                      <>
                        <Counter />s
                      </>
                    ) : (
                      <>Submit</>
                    )}
                  </LoadingButton>

                  <LoadingButton
                    variant="contained"
                    sx={{ ...loadingButtonClass }}
                    startIcon={<AddIcon />}
                  >
                    <Link
                      href="https://www.youtube.com/watch?v=5oeRkHOqW28"
                      sx={{ textDecoration: "none", color: "white" }}
                      target="_blank"
                    >
                      Create your Cube
                    </Link>
                  </LoadingButton>
                </Stack>

                {isDev && (
                  <Box sx={{ display: "flex", mt: "1em", ml: "1em" }}>
                    <FormControlLabel
                      sx={{ color: "var(--sugarhub-text-color)" }}
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={handleChange}
                          sx={{
                            color: "var(--button-color-disable)",
                            "&.Mui-checked": {
                              color: "var(--sugarcube-component-bg-color)",
                            },
                          }}
                        />
                      }
                      label="Dry Run"
                    />
                    <Typography
                      sx={{ color: "var(--sugarhub-text-color)", pt: "10px" }}
                    >
                      Mode: {pv?.runMode}
                    </Typography>
                  </Box>
                )}

                <Box>
                  {promptOutput && (
                    <Stack direction="row" spacing={2}>
                      <Grid>
                        <Box
                          sx={{
                            padding: {
                              xs: "0 16px",
                              sm: "0 16px",
                              md: "16px",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "var(--sugarhub-text-color)",
                                fontWeight: "2rem",
                                marginRight: "2rem",
                              }}
                            >
                              Result
                            </Typography>

                            {(pv?.modelType as ModelTypeType) && (
                              <>
                                <Tooltip title="Share Cube" placement="top">
                                  <IconButton
                                    onClick={() =>
                                      setOpenShareModal("imageshare")
                                    }
                                  >
                                    <ShareIcon
                                      sx={{
                                        color: "var(--sugarhub-text-color)",
                                        fontSize: "1.5rem",
                                      }}
                                    />
                                  </IconButton>
                                </Tooltip>
                                <DownloadButtonBase64
                                  logId={pl?.id as string}
                                />
                              </>
                            )}
                            {pv?.modelType ===
                              ModelTypeSchema.Enum.TEXT2TEXT && (
                              <CopyToClipboardButton
                                textToCopy={promptOutput}
                                textToDisplay={"Copy"}
                              />
                            )}
                          </Box>
                          <div>
                            <PromptOutput pl={pl as LogSchema} cube={true} />
                          </div>
                        </Box>
                      </Grid>
                    </Stack>
                  )}
                </Box>

                {pl && (
                  <Box
                    sx={{
                      ml: 2,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LabelIcons
                      logId={pl?.id}
                      labelledState={pl?.labelledState}
                      cube={true}
                    />
                  </Box>
                )}
              </div>
              {hasImageModels(pv?.modelType as ModelTypeType) && (
                <ImageGallery
                  pv={pv as GetPromptOutput}
                  itemsPerPage={10}
                  outputLog={pl as GenerateOutput}
                  url={url}
                />
              )}
            </Container>
          ) : (
            <>
              <Typography
                sx={{
                  color: "var(--sugarhub-text-color)",
                  textAlign: "center",
                }}
              >
                No template found
              </Typography>
            </>
          )}
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default PromptTemplateView;
