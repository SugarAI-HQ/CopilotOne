import React, { useState, useEffect } from "react";
import {
  TextField,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Checkbox,
  Typography,
  Chip,
  Tooltip,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import LLMSelector from "./llm_selector";
import LLMConfig from "./llm_config";
import { api } from "~/utils/api";
import PromptOutput from "./prompt_output";
import PromptPerformance from "./prompt_performance";
import PromptDeploy from "./prompt_deploy";
import toast from "react-hot-toast";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import {
  LlmConfigSchema,
  VersionOutput as pv,
} from "~/validators/prompt_version";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import { getUniqueJsonArray, getVariables } from "~/utils/template";
import SaveIcon from "@mui/icons-material/Save";
import { CreateVersion } from "./create_version";
import { inc } from "semver";
import { VersionOutput, VersionSchema } from "~/validators/prompt_version";
import { promptEnvironment } from "~/validators/base";
import { GenerateInput, GenerateOutput } from "~/validators/service";
import LoadingButton from "@mui/lab/LoadingButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { v4 as uuidv4 } from "uuid";

const isDev = process.env.NODE_ENV === "development";
import LabelIcons from "./label_icon";
import _debounce from "lodash/debounce";
import { providerModels } from "~/validators/base";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import PromotOutputLog from "./prompt_output_log";
import { displayModes } from "~/validators/base";
import DownloadButtonImg from "./download_button_img";
import PromptLogTable from "~/pages/dashboard/prompts/[id]/logs";
import Counter from "./counter_responsetime";
import CopyToClipboardButton from "./copy_button";
import { promptRole } from "~/validators/base";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  PromptJsonDataType,
  PromptDataType,
  PromptDataSchemaType,
} from "~/validators/prompt_version";

function PromptVersion({
  ns,
  pp,
  pt,
  pv,
  handleVersionCreate,
  onTemplateUpdate,
}: {
  ns: any;
  pp: pp;
  pt: pt;
  pv: VersionSchema;
  handleVersionCreate: Function;
  onTemplateUpdate: Function;
}) {
  const [lpv, setPv] = useState<VersionSchema>(pv);
  const [version, setVersion] = useState<string>(lpv?.version);
  const [template, setTemplate] = useState(lpv?.template || "");
  const [provider, setProvider] = useState(lpv?.llmProvider || "");
  const [model, setModel] = useState(lpv?.llmModel);
  const [llmConfig, setLLMConfig] = useState<LlmConfigSchema>({
    temperature: 0,
    maxLength: 2000,
    topP: 0,
    freqPenalty: 0,
    presencePenalty: 0,
    logitBias: "",
    stopSequences: "",
  });
  const [checked, setChecked] = useState(isDev);
  const [pl, setPl] = useState<GenerateOutput>(null);
  const [promptOutput, setPromptOutput] = useState("");
  const [promptPerformance, setPromptPerformacne] = useState({});
  const [pvrs, setVariables] = useState<PromptVariableProps[]>(
    getUniqueJsonArray(getVariables(lpv?.template || ""), "key"),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [outputLog, setOutputLog] = useState<GenerateOutput>(null);
  const [prompt, setPrompt] = useState<PromptDataSchemaType>(
    lpv.promptData as PromptDataSchemaType,
  );

  const [promptInputs, setPromptInputs] = useState<PromptDataType>(prompt.data);

  // this is a boolean value which will help to tell when to provide (role:<user, assistant>) editor
  const haveroleUserAssistant = providerModels[
    `${pt?.modelType as keyof typeof providerModels}`
  ].models[`${provider}`]?.find((mod) => mod.name === model)?.role;

  const pvUpdateMutation = api.prompt.updateVersion.useMutation({
    onSuccess: (v) => {
      if (v !== null) {
        setPv(v);
        toast.success("Saved");
      } else {
        toast.error("Failed to save");
      }
    },
  });

  const generateMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service

  const handleTemplateChange = (txt: string) => {
    debouncedHandleTemplateChange(txt);
  };

  // useEffect(() => {
  //   console.log("----------", lpv, "---------------");
  // });

  const debouncedHandleTemplateChange = _debounce((txt: string) => {
    const variables = getUniqueJsonArray(getVariables(txt), "key");
    setVariables([...variables]);
  }, 500);

  const handleVariablesChange = (k: string, v: string) => {
    setVariables((pvrs) => {
      // Step 2: Update the state
      return pvrs.map((pvr) => {
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

  useEffect(() => {
    if (haveroleUserAssistant) {
      setVariables([
        ...getUniqueJsonArray(
          getVariables(JSON.stringify(lpv?.promptData) || ""),
          "key",
        ),
      ]);
    } else {
      setVariables([
        ...getUniqueJsonArray(getVariables(lpv?.template || ""), "key"),
      ]);
    }
    // setOpenAiVariables([...openAivariables]);
  }, []);

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const handleRun = async (e: any) => {
    console.log(`running template version ${version}`);
    // loading
    setIsLoading(true);
    let data: { [key: string]: any } = {};
    for (const item of pvrs) {
      data[`${item.type}${item.key}`] = item.value;
    }

    const pl = await generateMutation.mutateAsync(
      {
        username: ns.username,
        package: pp?.name || "",
        template: pt?.name || "",
        versionOrEnvironment: lpv.version || "",
        isDevelopment: checked,
        // llmModelType: pt?.modelType,
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
      setOutputLog(pl);
    }
  };

  useEffect(() => {
    if (haveroleUserAssistant) {
      setVariables([
        ...getUniqueJsonArray(
          getVariables(JSON.stringify(lpv?.promptData) || ""),
          "key",
        ),
      ]);
    } else {
      setVariables([
        ...getUniqueJsonArray(getVariables(lpv?.template || ""), "key"),
      ]);
    }
    handleSave();
  }, [provider, model]);

  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    if (!lpv.publishedAt && isDirty) {
      saveTimer = setTimeout(() => {
        handleSave();
      }, 1000);
    }
    return () => {
      clearTimeout(saveTimer);
    };
  }, [template, isDirty]);

  const handleSave = () => {
    pvUpdateMutation.mutate({
      promptPackageId: lpv.promptPackageId,
      promptTemplateId: lpv.promptTemplateId,
      id: lpv.id,
      template: template,
      promptData: { v: prompt.v, data: promptInputs },
      llmProvider: provider,
      llmModel: model,
      llmConfig: llmConfig,
    });
    setIsDirty(false);
  };

  const handleTest = () => {
    console.log("TTD");
  };

  const onDeployUpdate = (pv: VersionSchema, pt: pt) => {
    setPv(pv);
    onTemplateUpdate(pt);
  };

  // CRUD functionality for Json promptData

  const addNewPropmtInput = () => {
    const length = promptInputs.length;
    const newObj = {
      id: uuidv4(),
      role: promptRole.Enum.user as string,
      content: "",
    };
    if (
      length > 0 &&
      promptInputs[length - 1]!.role === (promptRole.Enum.user as string)
    ) {
      newObj.role = promptRole.Enum.assistant as string;
    }
    const tempArray = [...promptInputs, newObj];
    handleTemplateChange(JSON.stringify(tempArray));
    setPromptInputs(tempArray);
  };

  const changePromptInputRole = (index: number) => {
    const tempArray = promptInputs.map(
      (prompt: PromptJsonDataType, idx: number) => ({
        ...prompt,
        role:
          index === idx
            ? prompt.role === (promptRole.Enum.user as string)
              ? (promptRole.Enum.assistant as string)
              : (promptRole.Enum.user as string)
            : prompt.role,
      }),
    );
    handleTemplateChange(JSON.stringify(tempArray));
    setPromptInputs([...tempArray]);
  };

  const changePromptInputContent = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => {
    const tempArray = [
      ...promptInputs.map((prompt: PromptJsonDataType, idx: number) => ({
        ...prompt,
        content: idx === index ? e.target.value : prompt.content,
      })),
    ];

    handleTemplateChange(JSON.stringify(tempArray));
    setPromptInputs([...tempArray]);
  };
  const deletePrompt = (index: number) => {
    const tempArray = promptInputs.filter(
      (_: any, idx: number) => index !== idx,
    );
    handleTemplateChange(JSON.stringify(tempArray));
    setPromptInputs([...tempArray]);
  };

  return (
    <>
      <Box>
        <Box display="inline" id={"prompt-version-" + pt?.id}>
          <Box display="inline" id={"prompt-version-actions" + pt?.id}>
            {!lpv.publishedAt && (
              <Tooltip title="Save Version" placement="top-start">
                <Button color="success" variant="text" onClick={handleSave}>
                  <SaveIcon />
                </Button>
              </Tooltip>
            )}
            <CreateVersion
              pp={pp}
              pt={pt}
              forkedFromId={lpv.id}
              v={inc(version, "patch") as string}
              onCreate={handleVersionCreate}
            ></CreateVersion>

            <PromptDeploy
              ns={ns}
              pp={pp}
              pt={pt}
              pv={lpv}
              onUpdate={onDeployUpdate}
            ></PromptDeploy>
            {/* {isDev &&
              `published: ${lpv.publishedAt?.toDateString()} id: ${
                lpv.id
              } version: ${lpv.version}`} */}
          </Box>
        </Box>
        <Box>
          {/* add all the code from promptEditor here */}
          <>
            {!haveroleUserAssistant ? (
              <>
                <TextField
                  label="Template"
                  disabled={!!lpv.publishedAt}
                  multiline
                  fullWidth
                  style={{ width: "100%" }}
                  minRows={5}
                  maxRows={10}
                  defaultValue={template}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  variant="outlined"
                />
              </>
            ) : (
              <>
                <Box sx={{ maxHeight: "300px", overflowY: "auto" }}>
                  {promptInputs.map(
                    (prompts: PromptJsonDataType, ind: number) => {
                      return (
                        <>
                          <Box sx={{ margin: "1rem" }} key={prompts.id}>
                            <Grid container spacing={2}>
                              <Grid item xs={2} sm={2} md={2} lg={2}>
                                <Button
                                  onClick={() => {
                                    prompts.role !== "system"
                                      ? changePromptInputRole(ind)
                                      : "";
                                  }}
                                  sx={{ padding: "1rem" }}
                                >
                                  {prompts.role}
                                </Button>
                              </Grid>
                              <Grid item xs={8} sm={8} md={8} lg={8}>
                                <TextField
                                  fullWidth
                                  multiline
                                  defaultValue={prompts.content}
                                  onChange={(e) =>
                                    changePromptInputContent(e, ind)
                                  }
                                />
                              </Grid>
                              <Grid item xs={2} sm={2} md={2} lg={2}>
                                <Box sx={{ display: "flex" }}>
                                  <Button
                                    sx={{
                                      padding: "1rem",
                                      display: `${
                                        prompts.role !== "system"
                                          ? "block"
                                          : "none"
                                      }`,
                                    }}
                                    onClick={() => deletePrompt(ind)}
                                  >
                                    <RemoveCircleIcon />
                                  </Button>
                                  {ind === promptInputs.length - 1 ? (
                                    <>
                                      <Button
                                        onClick={addNewPropmtInput}
                                        sx={{
                                          padding: "1rem",
                                          display: `${
                                            prompts.role !== "system"
                                              ? "block"
                                              : "none"
                                          }`,
                                        }}
                                      >
                                        <AddIcon />
                                      </Button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </>
                      );
                    },
                  )}
                </Box>

                {promptInputs.length === 1 ? (
                  <>
                    <Tooltip title="Add Input" placement="top">
                      <Button
                        onClick={addNewPropmtInput}
                        color="primary"
                        variant="outlined"
                        sx={{ margin: "1rem" }}
                      >
                        <AddIcon sx={{ fontSize: "2rem" }} />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>

          {/*  */}

          <Divider textAlign="right"></Divider>
          <Stack direction="row" spacing={1} sx={{ p: 1 }}>
            {isDev && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    color="primary" // Change the color to your preference
                  />
                }
                label="Dummy"
              />
            )}

            <LoadingButton
              color="success"
              variant="outlined"
              onClick={handleRun}
              disabled={
                haveroleUserAssistant
                  ? // promptInputs.length >0 || openAivariables.some((v) => v.value === "")
                    promptInputs.length > 0 &&
                    !promptInputs.some(
                      (input: { id: string; role: string; content: string }) =>
                        input.content.length === 0,
                    )
                    ? pvrs.some((v) => v.value === "")
                    : true
                  : template.length <= 10 || pvrs.some((v) => v.value === "")
              }
              loadingPosition="start"
              startIcon={<PlayArrowIcon />}
              loading={isLoading}
              sx={{ width: "8rem" }}
            >
              {isLoading ? (
                <>
                  <Counter />s
                </>
              ) : (
                <>Run</>
              )}
            </LoadingButton>
            {/* <Typography>
              Length: {template.length}
              Vars: {pvrs.some((v) => v.value === "") ? true : false}
            </Typography> */}

            <Button
              color="success"
              variant="outlined"
              onClick={handleTest}
              disabled={true}
            >
              Backtest
            </Button>

            <Button
              color="success"
              variant="outlined"
              onClick={handleTest}
              disabled={true}
            >
              Finetune
            </Button>

            <Grid container justifyContent={"flex-end"}>
              <Chip
                sx={{ m: 1 }}
                label={
                  providerModels[pt?.modelType as keyof typeof providerModels]
                    ?.label
                }
              />
              <LLMSelector
                initialProvider={provider}
                initialModel={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
                pv={lpv}
                pt={pt}
              ></LLMSelector>
              <LLMConfig
                config={llmConfig}
                setConfig={setLLMConfig}
                pv={lpv}
                pt={pt}
              ></LLMConfig>
            </Grid>
          </Stack>
          <Box sx={{ m: 1 }}>
            <PromptVariables
              vars={pvrs}
              onChange={handleVariablesChange}
              mode={displayModes.Enum.VIEW}
            />
          </Box>
        </Box>

        <Box sx={{ m: 1 }}>
          {promptOutput && (
            <Stack direction="row" spacing={2} sx={{ p: 1 }}>
              <Grid
                container
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
              >
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <PromptOutput
                    output={promptOutput}
                    modelType={pt?.modelType as ModelTypeType}
                  ></PromptOutput>
                  {pl && (
                    <Box
                      sx={{
                        ml: 5,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <LabelIcons
                        logId={pl?.id}
                        labelledState={pl?.labelledState}
                      />
                      |
                      {pt?.modelType !== ModelTypeSchema.Enum.TEXT2TEXT ? (
                        <div
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <DownloadButtonImg base64image={promptOutput} />|
                        </div>
                      ) : (
                        <div
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <CopyToClipboardButton
                            textToCopy={promptOutput}
                            textToDisplay={"Copy"}
                          />
                          |
                        </div>
                      )}
                      <PromotOutputLog pl={pl} />
                    </Box>
                  )}
                </Grid>
                {pt?.modelType === ModelTypeSchema.Enum.TEXT2TEXT && (
                  <Grid item lg={3} md={3} sm={12} xs={12}>
                    <PromptPerformance
                      data={promptPerformance}
                    ></PromptPerformance>
                  </Grid>
                )}
              </Grid>
            </Stack>
          )}
        </Box>

        <Box sx={{ m: 1 }} padding={2}>
          <Typography variant="h6">Log History</Typography>
          <PromptLogTable
            logModeMax={false}
            promptTemplateId={pt?.id}
            promptVersionId={pv?.version}
            itemsPerPage={5}
            outputLog={outputLog}
          />
        </Box>
      </Box>
    </>
  );
}

export default PromptVersion;
