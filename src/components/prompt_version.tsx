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
import {PromptTemplate as pt, PromptVersion as pv} from "@prisma/client";


function PromptVersion({ template }: {template: pt}) {
  // console.log(`template >>>>>>>: ${JSON.stringify(template)}`);
  const [promptTemplate, setTemplate] = useState(template);
  const [provider, setProvider] = useState("OpenAI");
  const [model, setModel] = useState("gpt-3.5-turbo");
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

  const mutation = api.service.completion.useMutation(); // Make sure to import 'api' and set up the service

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value;
    setTemplate(inputValue);
  };

  const handleRun = async (e: any) => {
    // TODO: Get this data from UI
    const id = "clmgjihd00000sg4y3tbe0l2h";
    const promptTemplateId = "clmf4eo990000sge67wokwsza";

    const response = await mutation.mutateAsync({
      promptPackageId: template.promptPackageId,
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
    if(response ) {
      setPromptOutput(response.completion);
      setPromptPerformacne(response.performance);
    }
  };

  return (
    <>
      <Box id={"prompt-version-"+promptTemplate.id}>
        <TextField
          value={promptTemplate.name}
          variant="standard"
          // onChange={handleInputChange}
        />
        <PromptDeploy></PromptDeploy>
      </Box>
      <Box>
        <EmptyTextarea
          minRows={5}
          maxRows={10}
          placeholder="Write your Smart Template"
          value={promptTemplate.description}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        />
        
        <Divider textAlign="right"></Divider>
          <Box>
            <Button 
              color="success" 
              variant="outlined"
              onClick={handleRun}>
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

      

    </>
  );
}

export default PromptVersion;
