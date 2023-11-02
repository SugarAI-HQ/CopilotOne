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
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { VersionOutput, VersionSchema } from "~/validators/prompt_version";
import { PromptEnvironment, promptEnvironment } from "~/validators/base";
import LogLabel from "./dataset/log_label";
import { GenerateInput, GenerateOutput } from "~/validators/service";
import LoadingButton from "@mui/lab/LoadingButton";

const isDev = process.env.NODE_ENV === "development";
import LabelIcons from "./label_icon";
import _debounce from "lodash/debounce";
import { providerModels } from "~/validators/base";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import PromotOutputLog from "./prompt_output_log";

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
  const [version, setVersion] = useState<string>(pv?.version);
  const [template, setTemplate] = useState(pv?.template || "");
  const [provider, setProvider] = useState(pv?.llmProvider || "");
  const [model, setModel] = useState(pv?.llmModel);
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
    getUniqueJsonArray(getVariables(pv?.template || ""), "key"),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pvUpdateMutation = api.prompt.updateVersion.useMutation({
    onSuccess: (v) => {
      if (v !== null) {
        toast.success("Saved");
      } else {
        toast.error("Failed to save");
      }
    },
  });

  const generateMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const txt = e.target.value;
    debouncedHandleTemplateChange(txt);
    // console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
  };

  const debouncedHandleTemplateChange = _debounce((txt: string) => {
    setTemplate(txt);
    setIsDirty(true);
    const variables = getUniqueJsonArray(getVariables(txt), "key");
    setVariables(variables);
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
        versionOrEnvironment: pv.version || "",
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
    }
  };

  useEffect(() => {
    let saveTimer: NodeJS.Timeout;
    if (!pv.publishedAt && isDirty) {
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
      promptPackageId: pv.promptPackageId,
      promptTemplateId: pv.promptTemplateId,
      id: pv.id,

      template: template,
      llmProvider: provider,
      llmModel: model,
      llmConfig: llmConfig,
    });
    setIsDirty(false);
  };

  const handleTest = () => {
    console.log("TTD");
  };

  return (
    <>
      <Box>
        <Box display="inline" id={"prompt-version-" + pt?.id}>
          {/* <TextField
            variant="outlined"
            label="Version"
            value={version}
            disabled={true}
            onChange={(e) => setVersion(e.target.value)}
          ></TextField> */}
          <Box display="inline" id={"prompt-version-actions" + pt?.id}>
            {!pv.publishedAt && (
              <Tooltip title="Deploy" placement="top-start">
                <Button color="success" variant="text" onClick={handleSave}>
                  <SaveIcon />
                </Button>
              </Tooltip>
            )}

            <CreateVersion
              pp={pp}
              pt={pt}
              forkedFromId={pv.id}
              v={inc(version, "patch") as string}
              onCreate={handleVersionCreate}
            ></CreateVersion>

            {pv.publishedAt ? (
              <PublishedWithChangesIcon />
            ) : (
              <PromptDeploy
                ns={ns}
                pp={pp}
                pt={pt}
                pv={pv}
                onTemplateUpdate={onTemplateUpdate}
              ></PromptDeploy>
            )}
          </Box>
        </Box>
        <Box>
          <TextField
            label="Template"
            disabled={!!pv.publishedAt}
            multiline
            fullWidth
            style={{ width: "100%" }}
            minRows={5}
            maxRows={10}
            defaultValue={template}
            onChange={handleTemplateChange}
            variant="outlined"
          />
          {/* <TextareaAutosize
            minRows={5}
            maxRows={10}
            placeholder="Write your Smart Template"
            value={template}
            onChange={handleTemplateChange}
            style={{ width: '100%' }}
          /> */}

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
              disabled={template.length <= 10}
              loadingPosition="start"
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
                pv={pv}
                pt={pt}
              ></LLMSelector>
              <LLMConfig
                config={llmConfig}
                setConfig={setLLMConfig}
                pv={pv}
                pt={pt}
              ></LLMConfig>
            </Grid>
          </Stack>
          <Box sx={{ m: 1 }}>
            <PromptVariables vars={pvrs} onChange={handleVariablesChange} />
          </Box>
        </Box>

        <Box sx={{ m: 1 }}>
          {promptOutput && (
            <Stack direction="row" spacing={2} sx={{ p: 1 }}>
              <Grid container justifyContent={"flex-start"}>
                <PromptOutput
                  output={promptOutput}
                  modelType={pt?.modelType as ModelTypeType}
                ></PromptOutput>
                {pl && (
                  <Box
                    sx={{
                      ml: 5,
                      justifyContent: "space-evenly",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <LabelIcons
                      logId={pl?.id}
                      labelledState={pl?.labelledState}
                    />
                    |
                    <PromotOutputLog pl={pl} />
                  </Box>
                )}
              </Grid>
              {pt?.modelType === ModelTypeSchema.Enum.TEXT2TEXT && (
                <Grid container alignItems="center" alignContent={"center"}>
                  <PromptPerformance
                    data={promptPerformance}
                  ></PromptPerformance>
                </Grid>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </>
  );
}

export default PromptVersion;

const Counter = () => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);
  return <>{seconds}</>;
};
