import React, { useState } from "react";
import {
  Container,
  TextField,
  TextareaAutosize,
  Box,
  Button,
  Divider,
  Chip,
} from "@mui/material";
import LLMSelector from "./llm_selector";
import LLMConfig, { LLMConfigProps } from "./llm_config";
import { api } from "~/utils/api";
import EmptyTextarea from "./text_area";
import PromptOutput from "./prompt_output";
import PromptPerformance from "./prompt_performance";
import PromptDeploy from "./prompt_deploy";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import toast from 'react-hot-toast';
import { PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv } from "@prisma/client";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import { getAllTemplateVariables, getUniqueJsonArray, getVariables } from "~/utils/template";
import SaveIcon from '@mui/icons-material/Save';



function PromptVersion({ pp, pt, pv }:
  { pp: pp, pt: pt, pv: pv }) {  
  const [version, setVersion] = useState(pv?.version);
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

  const mutation = api.service.completion.useMutation(); // Make sure to import 'api' and set up the service


  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const txt = e.target.value;
    setTemplate(txt);

    const variables = getUniqueJsonArray(getVariables(txt), "key")
    console.log(`variables >>>> ${JSON.stringify(variables)}`);
    setVariables(variables);
    console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
    
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
  };

  const handleRun = async (e: any) => {
    // TODO: Get this data from UI
    const id = "clmgjihd00000sg4y3tbe0l2h";
    const promptTemplateId = "clmf4eo990000sge67wokwsza";

    // console.log(`promptVariables: ${JSON.stringify(variables)}`);

    const response = await mutation.mutateAsync({
      promptPackageId: pt.promptPackageId,
      promptTemplateId: promptTemplateId,
      id: id,
      // TODO: Get this data from the UI
      data: {
        "#BOT_NAME": "Riya",
        "#LLM_PROVIDER": "Open AI",
        "@ROLE": "Insurance Agent",
        "@DESCRIPTION": "A smart assistant for Insurance Needs",
        "@TASKS": [
          "buy motor insurance policy",
          "answer relevant queries about insurance policies",
        ],
        "$CHAT_HISTORY": "No recent chat",
        "%QUERY": "How are you doing?",
      },
    });

    console.log(`response >>>>>>>: ${JSON.stringify(response)}`);
    if (response) {
      setPromptOutput(response.completion);
      setPromptPerformacne(response.performance);
    }
  };

  const handleSave = () => {
    pvUpdateMutation.mutate({
      id: pv.id,
      promptPackageId: pv.promptPackageId,
      promptTemplateId: pv.promptTemplateId,

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
        <Box id={"prompt-version-" + pt.id}>
          <TextField 
            value={version}
            onChange={(e) => setVersion(e.target.value)}
          ></TextField>
          <Button
                color="success"
                variant="text"
                onClick={handleSave}
            >
              <SaveIcon/>
          </Button>
          <PromptDeploy
            pp={pp}
            pt={pt}
            pv={pv}
          ></PromptDeploy>
        </Box>
        <Box>
          
        <TextField
            label="Template"
            multiline
            style={{ width: '100%' }}
            minRows={15}
            maxRows={20}
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
          <Box>
            <Button
              color="success"
              variant="outlined"
              onClick={handleRun}
              disabled={template.length <= 100}
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

        <Box>
          <Divider textAlign="center"></Divider>
          <PromptPerformance data={promptPerformance}></PromptPerformance>
          <PromptOutput
            output={promptOutput}
          ></PromptOutput>
        </Box>
        <Box>
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
