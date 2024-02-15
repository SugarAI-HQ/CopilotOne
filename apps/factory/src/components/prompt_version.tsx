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
import { LLM, promptEnvironment } from "~/validators/base";
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
import { PromptRoleEnum } from "~/validators/base";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  PromptJsonDataType,
  PromptDataType,
  PromptDataSchemaType,
} from "~/validators/prompt_version";
import DownloadButtonBase64 from "./download_button_base64";
import { getTemplate } from "~/services/providers";
import { LogSchema } from "~/validators/prompt_log";
import CircularProgress from "@mui/material/CircularProgress";
import {
  LlmResponse,
  getCompletionResponse,
  ImageResponseV1,
  TextResponseV1,
  processLlmResponse,
} from "~/validators/llm_respose";

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

  const [llm, setLLM] = useState<LLM>({
    modelType: pt?.modelType as ModelTypeType,
    provider:
      lpv?.llmProvider ||
      providerModels[pt?.modelType as ModelTypeType].defaultProvider,
    model:
      lpv?.llmModel ||
      providerModels[pt?.modelType as ModelTypeType].defaultModel,
  });

  const [tllm, setTllm] = useState<LLM>(llm);

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
  // const [promptOutput, setPromptOutput] = useState("");

  const [promptPerformance, setPromptPerformacne] = useState({});
  const [pvrs, setVariables] = useState<PromptVariableProps[]>(
    getUniqueJsonArray(getVariables(lpv?.template || ""), "key"),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // isLLMChanged is used to detect change in Provider and Model using LLM selector,
  //  if true we will change the template otherwise template remains same
  const [isLLMChanged, setIsLLMChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [outputLog, setOutputLog] = useState<GenerateOutput>(null);
  const [prompt, setPrompt] = useState<PromptDataSchemaType>(
    lpv.promptData as PromptDataSchemaType,
  );

  const [promptInputs, setPromptInputs] = useState<PromptDataType>(
    prompt.data as PromptDataType,
  );

  // this is a boolean value which will help to tell when to provide (role:<user, assistant>) editor
  const getRole = (providerName: string, modelName: string) => {
    return providerModels[
      `${pt?.modelType as keyof typeof providerModels}`
    ].models[`${providerName}`]?.find((mod) => mod.name === modelName)?.hasRole;
  };

  const pvUpdateMutation = api.prompt.updateVersion.useMutation({
    onSuccess: (v) => {
      if (v !== null) {
        setPv(v);
        // console.log(`pv: Updated ${JSON.stringify(v)}`);
        // console.log(`pv: Updated ${JSON.stringify(lpv)}`);
        onUpdateSuccess(v);
        toast.success("Saved");
      } else {
        toast.error("Failed to save");
      }
    },
  });

  const onUpdateSuccess = (lpv: VersionSchema) => {
    const prompt = lpv.promptData as PromptDataSchemaType;
    const promptinput = prompt.data;
    setPrompt(prompt);
    setPromptInputs(promptinput);
    if (getRole(lpv.llmProvider, lpv.llmModel) !== 0) {
      handleSetVariable(JSON.stringify(promptinput));
    } else {
      handleSetVariable(JSON.stringify(lpv.template));
    }
    setIsLoading(false);
  };

  const generateMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service

  const handleTemplateChange = (txt: string) => {
    setIsDirty(!isDirty);
    debouncedHandleTemplateChange(txt);
  };

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
  };

  const handleSetVariable = (prompt: string) => {
    // logic to change the variables array as per the change in provider
    setVariables([...getUniqueJsonArray(getVariables(prompt || ""), "key")]);
  };

  useEffect(() => {
    if (getRole(llm.provider, llm.model) !== 0) {
      handleSetVariable(JSON.stringify(lpv?.promptData));
    } else {
      handleSetVariable(lpv?.template);
    }
  }, []);

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const handleRun = async (e: any) => {
    console.log(`running template version ${version}`);
    // loading
    setIsRunning(true);
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
        onSettled(lPl, error) {
          let lr = lPl?.llmResponse as LlmResponse;
          setIsRunning(false);
          if (lr?.error) {
            toast.error(lr.error?.message as string);
          }
        },
      },
    );
    console.log(`pl >>>>>>>: ${JSON.stringify(pl)}`);

    if (pl) {
      setPl(pl);
      // setPromptOutput(
      //   processLlmResponse(pl?.llmResponse as LlmResponse) as string,
      // );
      setPromptPerformacne({
        latency: pl.latency,
        prompt_tokens: pl?.prompt_tokens,
        completion_tokens: pl?.completion_tokens,
        total_tokens: pl?.total_tokens,
      });
    }
  };

  const onLLMChange = () => {
    setIsDirty(true);
    setIsLoading(true);
    setIsLLMChanged(true);
  };

  const handleLLMChange = (llm: LLM) => {
    console.log(`pv: llm >>>>>>>: ${JSON.stringify(llm)}`);
    setLLM(llm);
    onLLMChange();
  };

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

  // if current and nextProvide will be same i will not do anything other wise i will call getTemplate fumction

  const handleSave = () => {
    let currentTemplate = { v: prompt.v, p: prompt.p, data: promptInputs };
    if (
      isLLMChanged &&
      getRole(tllm.provider, tllm.model) !== getRole(llm.provider, llm.model)
    ) {
      currentTemplate = getTemplate(llm.provider, llm.model);
    } else {
      currentTemplate.p = llm.provider;
    }
    setTllm(llm);
    pvUpdateMutation.mutate({
      promptPackageId: lpv.promptPackageId,
      promptTemplateId: lpv.promptTemplateId,
      id: lpv.id,
      template: template,
      promptData: currentTemplate,
      llmProvider: llm.provider,
      llmModel: llm.model,
      llmConfig: llmConfig,
    });
    setIsLLMChanged(false);
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
      role: PromptRoleEnum.enum.USER,
      content: "",
    };
    if (
      length > 0 &&
      promptInputs[length - 1]!.role === (PromptRoleEnum.enum.USER as string)
    ) {
      newObj.role = PromptRoleEnum.enum.ASSISTANT;
    }
    const tempArray = [...promptInputs, newObj];
    setPromptInputs(tempArray);
    handleTemplateChange(JSON.stringify(tempArray));
  };

  const changePromptInputRole = (index: number) => {
    const tempArray = promptInputs.map(
      (prompt: PromptJsonDataType, idx: number) => ({
        ...prompt,
        role:
          index === idx
            ? prompt.role === (PromptRoleEnum.enum.USER as string)
              ? PromptRoleEnum.enum.ASSISTANT
              : PromptRoleEnum.enum.USER
            : prompt.role,
      }),
    );
    setPromptInputs([...tempArray]);
    handleTemplateChange(JSON.stringify(tempArray));
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

    setPromptInputs([...tempArray]);
    handleTemplateChange(JSON.stringify(tempArray));
  };
  const deletePrompt = (index: number) => {
    const tempArray = promptInputs.filter(
      (_: any, idx: number) => index !== idx,
    );
    setPromptInputs([...tempArray]);
    handleTemplateChange(JSON.stringify(tempArray));
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {isLoading && (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: "2",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <Box display="inline" id={"prompt-version-" + pt?.id}>
          <Box display="inline" id={"prompt-version-actions" + pt?.id}>
            <Tooltip title="Save Version" placement="top-start">
              <Button
                color="success"
                variant="text"
                onClick={handleSave}
                disabled={lpv.publishedAt ? true : false}
              >
                <SaveIcon />
              </Button>
            </Tooltip>
            <CreateVersion
              key={lpv.id + "2"}
              pp={pp}
              pt={pt}
              forkedFrom={lpv}
              v={inc(version, "patch") as string}
              onCreate={handleVersionCreate}
            ></CreateVersion>

            {/* {isDev &&
              `published: ${lpv.publishedAt?.toDateString()} id: ${
                lpv.id
              } version: ${lpv.version}`} */}
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        ></Box>
        <Grid container spacing={2}>
          {/* add all the code from promptEditor here */}
          <Grid item xs={12} md={6}>
            <Box>
              {getRole(llm.provider, llm.model) === 0 ? (
                <>
                  <TextField
                    label="Template"
                    disabled={!!lpv.publishedAt}
                    multiline
                    fullWidth
                    style={{ width: "100%" }}
                    minRows={9}
                    // maxRows={10}
                    defaultValue={template}
                    onChange={(e) => {
                      setTemplate(e.target.value);
                      handleTemplateChange(e.target.value);
                    }}
                    variant="outlined"
                  />
                </>
              ) : (
                <>
                  <Box sx={{ maxHeight: "400px", overflowY: "auto" }}>
                    {promptInputs.map(
                      (prompts: PromptJsonDataType, ind: number) => {
                        return (
                          <>
                            <Box sx={{ margin: "1rem" }} key={prompts.id}>
                              <Grid container spacing={2}>
                                <Grid item xs={2} sm={2} md={2} lg={2}>
                                  <Button
                                    onClick={() => {
                                      prompts.role !==
                                      (PromptRoleEnum.enum.SYSTEM as string)
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
                                          promptInputs.length === 1 ||
                                          prompts.role ===
                                            (PromptRoleEnum.enum
                                              .SYSTEM as string)
                                            ? "none"
                                            : "block"
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
                </>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ p: 1 }}>
            <PromptVariables
              vars={pvrs}
              onChange={handleVariablesChange}
              mode={displayModes.Enum.VIEW}
            />
          </Grid>
        </Grid>
        <Divider sx={{ mt: 1 }} textAlign="right"></Divider>

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
            // disabled={
            //   getRole(llm.provider, llm.model) !== 0
            //     ? promptInputs.length > 0 &&
            //       !promptInputs.some(
            //         (input: { id: string; role: string; content: string }) =>
            //           input.content.length === 0,
            //       )
            //       ? pvrs.some((v) => v.value.length === 0)
            //       : true
            //     : template.length <= 10 ||
            //       pvrs.some((v) => v.value.length === 0)
            // }
            loadingPosition="start"
            startIcon={<PlayArrowIcon />}
            loading={isRunning}
            sx={{ width: "8rem" }}
          >
            {isRunning ? (
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

          <PromptDeploy
            ns={ns}
            pp={pp}
            pt={pt}
            pv={lpv}
            onUpdate={onDeployUpdate}
          ></PromptDeploy>

          <Button
            color="success"
            variant="outlined"
            onClick={handleTest}
            disabled={true}
            sx={{
              width: "9rem",
            }}
          >
            Backtest
          </Button>

          <Button
            color="success"
            variant="outlined"
            onClick={handleTest}
            disabled={true}
            sx={{
              width: "9rem",
            }}
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
              key={lpv.id + llm.modelType + llm.model + llm.provider}
              initialLLM={llm}
              onLLMChange={handleLLMChange}
              publishedAt={lpv.publishedAt}
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
          {pl && (
            <Stack direction="row" spacing={2} sx={{ p: 1 }}>
              <Grid
                container
                justifyContent={"center"}
                alignItems={"center"}
                flexDirection={"row"}
              >
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <PromptOutput pl={pl as LogSchema}></PromptOutput>
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
                      {pt?.modelType === ModelTypeSchema.Enum.TEXT2IMAGE ? (
                        <div
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            display: "flex",
                          }}
                        >
                          <DownloadButtonBase64
                            base64image={pl.completion as string}
                          />
                          |
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
                            textToCopy={pl.completion as string}
                            textToDisplay={"Copy"}
                          />
                          |
                        </div>
                      )}
                      <PromotOutputLog pl={pl as LogSchema} />
                    </Box>
                  )}
                </Grid>
                {pt?.modelType !== ModelTypeSchema.Enum.TEXT2IMAGE && (
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
            outputLog={pl as GenerateOutput}
          />
        </Box>
      </Box>
    </>
  );
}

export default PromptVersion;
