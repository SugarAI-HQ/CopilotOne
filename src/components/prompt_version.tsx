import React, { useState } from "react";
import {
  Container,
  TextField,
  TextareaAutosize,
  Box,
  Button,
} from "@mui/material";
import LLMSelector from "./llm_selector";
import LLMConfig from "./llm_config";
import { api } from "~/utils/api";
import StyledTextarea from "./text_area";

function PromptVersion({ template, version }) {
  console.log(`template >>>>>>>: ${JSON.stringify(template)}`);
  let [promptTemplate, setTemplate] = useState(template);
  let [provider, setProvider] = useState("OpenAI");
  let [model, setModel] = useState("gpt-3.5-turbo");
  let [llmConfig, setLLMConfig] = useState({});

  const mutation = api.service.completion.useMutation(); // Make sure to import 'api' and set up the service

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setTemplate(inputValue);
  };

  let handleRun = async (e) => {
    // TODO: Get this data from UI
    let id = "clmgjihd00000sg4y3tbe0l2h";
    let promptTemplateId = "clmf4eo990000sge67wokwsza";

    const response = mutation.mutate({
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
  };

  return (
    <>
      <Box>
        <TextField
            fullWidth
            value={promptTemplate.name}
            // onChange={handleInputChange}
          />
        <TextareaAutosize
          minRows={5}
          maxRows={10}
          placeholder="Write your Smart Template"
          value={promptTemplate.description}
          onChange={handleInputChange}
          style={{ width: '100%' }}
        >
        </TextareaAutosize>
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
    </>
  );
}

export default PromptVersion;
