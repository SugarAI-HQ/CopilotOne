import React, { useEffect, useState } from "react";
import Header from "~/components/marketplace/header";
import {
  Container,
  Box,
  Stack,
  Button,
  Checkbox,
  Grid,
  Typography,
  Dialog,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { api } from "~/utils/api";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import { getUniqueJsonArray, getVariables } from "~/utils/template";
import { GenerateInput, GenerateOutput } from "~/validators/service";
import FormControlLabel from "@mui/material/FormControlLabel";
import PromptOutput from "./prompt_output";
import {
  ModelTypeSchema,
  ModelTypeType,
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
import DownloadButtonImg from "./download_button_img";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";
import { providerModels } from "~/validators/base";
import {
  PromptDataSchemaType,
  PromptDataType,
} from "~/validators/prompt_version";
import { promptEnvironment } from "~/validators/base";

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
  const [packageData, setPackageData] = useState<pp>({} as pp);
  const handleOpen = () => setIsOpen(true);
  const [isLoadingState, setIsLoading] = useState(false);
  const [openShareModal, setOpenShareModal] = useState<boolean>(false);

  const router = useRouter();
  const { data, isLoading } = api.cube.getPrompt.useQuery({
    username: username,
    package: packageName,
    template: template,
    versionOrEnvironment: versionOrEnvironment?.toUpperCase(),
  });

  api.prompt.getPackage.useQuery(
    {
      id: data?.promptPackageId as string,
    },
    {
      onSuccess(item) {
        setPackageData(item);
      },
    },
  );

  const haveroleUserAssistant = providerModels[
    `${data?.modelType as keyof typeof providerModels}`
  ]?.models[`${data?.llmProvider}`]?.find((mod) => mod.name === data?.model)
    ?.role;

  useEffect(() => {
    if (haveroleUserAssistant) {
      setVariables([
        ...getUniqueJsonArray(
          getVariables(
            JSON.stringify((data?.promptData as PromptDataSchemaType).data) ||
              "",
          ),
          "key",
        ),
      ]);
    } else {
      setVariables([
        ...getUniqueJsonArray(getVariables(data?.template || ""), "key"),
      ]);
    }
  }, []);

  useEffect(() => {
    setVariables(getUniqueJsonArray(getVariables(data?.template || ""), "key"));
  }, [data]);

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

    let data: { [key: string]: any } = {};
    for (const item of pvrs as PromptVariableProps[]) {
      data[`${item.type}${item.key}`] = item.value;
    }

    const pl = await generateMutation.mutateAsync(
      {
        username: username,
        package: packageName || "",
        template: template || "",
        versionOrEnvironment: versionOrEnvironment?.toUpperCase() || "",
        isDevelopment: checked,
        environment: promptEnvironment.Enum.DEV,
        data: data,
      } as GenerateInput,
      {
        onSuccess() {
          setIsLoading(false);
        },
        onError() {
          setIsLoading(false);
        },
      },
    );

    console.log(`pl >>>>>>>: ${JSON.stringify(pl)}`);
    if (pl) {
      setPl(pl);
      setPromptOutput(pl.completion);
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

  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${username}/${packageName}/${template}/${versionOrEnvironment}`;
  const imageUrl = `${process.env.NEXT_PUBLIC_APP_URL}/generated/assets/og`;

  return (
    <>
      <NextSeo
        title={template}
        description={data?.description}
        // canonical={shareUrl}
        openGraph={{
          url: `${shareUrl}`,
          title: `${template}`,
          description: `${data?.description}`,
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
          <Container className="center">
            <div
              className="dark:border-gray-70  w-full rounded-lg border p-4 shadow sm:p-6"
              style={{ backgroundColor: "var(--sugarhub-tab-color)" }}
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
              ) : data || !versionOrEnvironment ? (
                <>
                  <Box sx={{ flexGrow: 1, paddingRight: "1rem" }}>
                    <Grid container columnSpacing={2}>
                      <Grid item xs={1.5} sm={1} md={1} lg={1}></Grid>
                      <Grid item xs={9} sm={10} md={10} lg={10}>
                        <Typography
                          sx={{
                            textAlign: "center",
                            color: "var(--sugarhub-text-color)",
                            fontSize: { xs: "2rem", sm: "3rem", lg: "3rem" },
                          }}
                        >
                          {!template ? "" : template.replaceAll("-", " ")}
                        </Typography>
                      </Grid>
                      <Grid item xs={1.5} sm={1} md={1} lg={1}>
                        <Tooltip title="Share Cube" placement="top">
                          <IconButton
                            onClick={() => setOpenShareModal(!openShareModal)}
                          >
                            <ShareIcon
                              sx={{
                                color: "var(--sugarhub-text-color)",
                                fontSize: "2rem",
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        {/* modal to show sharing option */}
                        <ShareCube
                          setOpenShareModal={setOpenShareModal}
                          open={openShareModal}
                          shareUrl={shareUrl}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ flexGrow: 1, paddingRight: "1rem" }}>
                    <Grid container wrap="nowrap" columnSpacing={2}>
                      <Grid item xs={1.3} sm={1} md={1} lg={1}></Grid>
                      <Grid item xs={9.4} sm={10} md={10} lg={10}>
                        <Typography
                          variant="h6"
                          component="h6"
                          sx={{
                            textAlign: "center",
                            color: "var(--sugarhub-text-color)",
                            wordBreak: "break-word",
                          }}
                        >
                          {data?.description}
                        </Typography>
                      </Grid>
                      <Grid item xs={1.3} sm={1} md={1} lg={1}>
                        <Tooltip title="Edit Template" placement="top">
                          <IconButton color="primary">
                            {session?.user.username == username && (
                              <EditIcon
                                onClick={() =>
                                  router.push(
                                    `/dashboard/prompts/${data?.promptPackageId}?ptid=${data?.templateId}&edit=${true}`,
                                  )
                                }
                                sx={{
                                  color: "var(--sugarhub-text-color)",
                                  fontSize: "2rem",
                                }}
                              ></EditIcon>
                            )}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
                  <Box sx={{ m: 1 }}>
                    {pvrs && (
                      <>
                        {data && (
                          <PromptViewArrow
                            promptTemplate={data?.template}
                            promptInputs={
                              (data?.promptData as PromptDataSchemaType).data
                            }
                            haveroleUserAssistant={haveroleUserAssistant}
                          />
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
                    spacing={1}
                    sx={{ p: 1, marginLeft: "1rem" }}
                  >
                    {isDev && (
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
                        label="Dummy"
                      />
                    )}
                    <LoadingButton
                      color="success"
                      variant="outlined"
                      onClick={session ? handleRun : handleOpen}
                      // disabled={pvrs?.some((v) => v.value === "")}
                      sx={{
                        "&.Mui-disabled": {
                          borderColor: "var(--button-color-disable)",
                          color: "var(--button-color-disable)",
                          cursor: "not-allowed",
                          width: "8rem",
                        },
                        width: "8rem",
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
                        <>Run</>
                      )}
                    </LoadingButton>
                    {!session && isOpen && (
                      <Box>
                        <Typography
                          className="mt-2"
                          sx={{ color: "var(--sugarhub-text-color)" }}
                        >
                          <Link
                            href="#"
                            onClick={() => void signIn()}
                            sx={{
                              textDecoration: "none",
                            }}
                          >
                            Signup
                          </Link>{" "}
                          to run the cube!
                        </Typography>
                      </Box>
                    )}
                  </Stack>

                  <Box sx={{ m: 1 }}>
                    {promptOutput && (
                      <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                        <Grid>
                          <Box padding={2}>
                            <Typography
                              variant="h6"
                              className="mb-5"
                              sx={{ color: "var(--sugarhub-text-color)" }}
                            >
                              Output
                            </Typography>
                            <div
                              style={{
                                flexDirection: "row",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <PromptOutput
                                output={promptOutput}
                                modelType={data?.modelType as ModelTypeType}
                              />
                              {data?.modelType !==
                                ModelTypeSchema.Enum.TEXT2TEXT && (
                                <DownloadButtonImg base64image={promptOutput} />
                              )}
                            </div>
                          </Box>
                        </Grid>
                      </Stack>
                    )}
                  </Box>
                </>
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
            </div>
          </Container>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default PromptTemplateView;
