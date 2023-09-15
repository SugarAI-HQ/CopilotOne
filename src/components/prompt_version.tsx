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
import LLMConfig from "./llm_config";
import { api } from "~/utils/api";
import StyledTextarea from "./text_area";
import PromptOutput from "./prompt_output";
import PromptPerformance from "./prompt_performance";
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';


function PromptVersion({ template, version }) {
  // console.log(`template >>>>>>>: ${JSON.stringify(template)}`);
  let [promptTemplate, setTemplate] = useState(template);
  let [provider, setProvider] = useState("OpenAI");
  let [model, setModel] = useState("gpt-3.5-turbo");
  let [llmConfig, setLLMConfig] = useState({});
  let [promptOutput, setPromptOutput] = useState('');
  let [promptPerformance, setPromptPerformacne] = useState({});

  const mutation = api.service.completion.useMutation(); // Make sure to import 'api' and set up the service

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setTemplate(inputValue);
  };

  let handleRun = async (e) => {
    // TODO: Get this data from UI
    let id = "clmgjihd00000sg4y3tbe0l2h";
    let promptTemplateId = "clmf4eo990000sge67wokwsza";

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
    setPromptOutput(response.completion);
    setPromptPerformacne(response.performance);
  };

  return (
    <>
      <Box id={"prompt-version-"+promptTemplate.id}>
        <TextField
            fullWidth
            value={promptTemplate.name}
            variant="standard"
            // onChange={handleInputChange}
          />
        <TextareaAutosize
          minRows={8}
          maxRows={10}
          placeholder="Write your Smart Template"
          value={promptTemplate.description}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        >
        </TextareaAutosize>
        
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
            <Button 
              color="success" 
              variant="outlined"
              onClick={handleRun}>
                <RocketLaunchIcon/>
            </Button>
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
