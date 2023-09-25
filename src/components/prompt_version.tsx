import React, { useState } from "react";
import {
  TextField,
  Box,
  Button,
  Divider,
} from "@mui/material";
import LLMSelector from "./llm_selector";
import LLMConfig, { LLMConfigProps } from "./llm_config";
import { api } from "~/utils/api";
import PromptOutput from "./prompt_output";
import PromptPerformance from "./prompt_performance";
import PromptDeploy from "./prompt_deploy";
import toast from 'react-hot-toast';
import { PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv } from "@prisma/client";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import { getUniqueJsonArray, getVariables } from "~/utils/template";
import SaveIcon from '@mui/icons-material/Save';
import { CreateVersion } from "./create_version";
import {inc} from 'semver'
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { PromptEnvironment, promptEnvironment } from "~/validators/base";



function PromptVersion({ ns, pp, pt, pv, handleVersionCreate, onTemplateUpdate }:
  { ns:any, pp: pp, pt: pt, pv: pv, handleVersionCreate: Function, onTemplateUpdate: Function }) {  
  const [version, setVersion] = useState<string>(pv?.version);
  const [template, setTemplate] = useState(pv?.template || '');
  const [provider, setProvider] = useState(pv?.llmProvider || '');
  const [model, setModel] = useState(pv?.llmModel);
  const [llmConfig, setLLMConfig] = useState<LLMConfigProps>({
    temperature: 0,
    maxLength: 2000,
    topP: 0,
    freqPenalty: 0,
    presencePenalty: 0,
    logitBias: '',
    stopSequences: '',
  });

  const [promptOutput, setPromptOutput] = useState('');
  const [promptPerformance, setPromptPerformacne] = useState({});
  const [pvrs, setVariables] = useState<PromptVariableProps[]>(getUniqueJsonArray(getVariables(pt?.description || ''), "key"));

  const pvUpdateMutation = api.prompt.updateVersion.useMutation({
    onSuccess: (v) => {
      if (v !== null) {
          toast.success("Saved");
      } else {
        toast.error("Failed to save");
      }
    }
  });

  const runMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service


  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const txt = e.target.value;
    setTemplate(txt);

    const variables = getUniqueJsonArray(getVariables(txt), "key")
    console.log(`variables >>>> ${JSON.stringify(variables)}`);
    setVariables(variables);
    // console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
    
  };
  const handleVariablesChange = (k: string, v: string) => {
    setVariables((pvrs) => {
      // Step 2: Update the state
      return pvrs.map((pvr) => {
        if (pvr.key === k) {
          // pvr.value = v;
          console.log(`value of ${pvr.key}: ${pvr.value} => ${v}`);
          return { ...pvr, ...{ value: v } };
        }
        return pvr;
      });
    });

    // console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
  };

  const handleRun = async (e: any) => {

    console.log(`running template version ${version}`);

    let data = {};
    for (const item of pvrs) {
      data[`${item.type}${item.key}`] = item.value;
    }

    const pl = await runMutation.mutateAsync({
      username: ns.name,
      package: pp.name,
      template: pt.name,
      version: pv.version,

      environment: promptEnvironment.Enum.DEV,
      // TODO: Get this data from the UI
      data: data
      // data: {
      //   "#BOT_NAME": "Riya",
      //   "#PROVIDER": "Open AI",
      //   "@ROLE": "Insurance Agent",
      //   "@DESCRIPTION": "A smart assistant for Insurance Needs",
      //   "@TASKS": [
      //     "buy motor insurance policy",
      //     "answer relevant queries about insurance policies",
      //   ],
      //   "$CHAT_HISTORY": "No recent chat",
      //   "%QUERY": "How are you doing?",
      // },
    });

    console.log(`pl >>>>>>>: ${JSON.stringify(pl)}`);
    if (pl) {
      setPromptOutput(pl.completion);
      setPromptPerformacne({
        latency: pl.latency,
        prompt_tokens: pl.prompt_tokens,
        completion_tokens: pl.completion_tokens,
        total_tokens: pl.total_tokens
      });
    }
  };

  const handleSave = () => {
    pvUpdateMutation.mutate({
      promptPackageId: pv.promptPackageId,
      promptTemplateId: pv.promptTemplateId,

      version: pv.version,

      version: version,
      template: template,
      // input: pvrs,
      llmProvider: provider,
      llmModel: model,
      llmConfig: llmConfig,
    });
  }

  return (
    <>
      <Box>
        <Box display='inline' id={"prompt-version-" + pt.id}>
          {/* <TextField
            variant="outlined"
            label="Version"
            value={version}
            disabled={true}
            onChange={(e) => setVersion(e.target.value)}
          ></TextField> */}
          <Box display='inline' id={"prompt-version-actions" + pt.id}>
            
            {!pv.publishedAt && (<Button
                  color="success"
                  variant="text"
                  onClick={handleSave}
              >
                <SaveIcon/>
            </Button>)}
            
            <CreateVersion
              pp={pp as pp}
              pt={pt as pt}
              forkedFromId={pv.id}
              v={inc(version, 'patch') as string}
              onCreate={handleVersionCreate}
            ></CreateVersion>


            {pv.publishedAt ? (
              <PublishedWithChangesIcon/>
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
            multiline
            fullWidth
            style={{ width: '100%' }}
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
          <Box sx={{m: 1}}>
            <Button
              color="success"
              variant="outlined"
              onClick={handleRun}
              disabled={template.length <= 50}
              >
              Run
            </Button>
            <LLMSelector
              initialProvider={provider}
              initialModel={model}
              onProviderChange={setProvider}
              onModelChange={setModel}
            ></LLMSelector>
            <LLMConfig
              config={llmConfig}
              setConfig={setLLMConfig}
            ></LLMConfig>

          </Box>
        </Box>

        <Box sx={{m: 1}}>
          {/* <Divider textAlign="center"></Divider> */}
          <PromptPerformance data={promptPerformance}></PromptPerformance>
          <PromptOutput
            output={promptOutput}
          ></PromptOutput>
        </Box>
        <Box sx={{m: 1}}>
          <PromptVariables
            vars={pvrs}
            onChange={handleVariablesChange}
          />
        </Box>
      </Box>
    </>
  );
}

export default PromptVersion;
