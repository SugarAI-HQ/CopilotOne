import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Modal,
  Stack,
  Select,
  Typography,
  MenuItem,
  Dialog
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';
import {
  LlmConfigSchema,

} from "~/validators/prompt_version";
import React, { useState } from "react";
import { providers, models} from "~/validators/base";
import { api } from "~/utils/api";
import { VersionSchema } from "~/validators/prompt_version";

function LLMSelector({ initialProvider, initialModel, onProviderChange, onModelChange, pv }:
  { initialProvider: string, initialModel: string, onProviderChange: Function, onModelChange: Function, pv: VersionSchema}) {

  const [isOpen, setIsOpen] = useState(false);

  const [provider, setProvider] = useState(initialProvider);

  const [model, setModel] = useState(initialModel);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const mutation = api.prompt.updateVersion.useMutation();

  const handleProviderChange = (event: any) => {
    const selectedProvider:string = event.target.value;
    setProvider(selectedProvider);
    onProviderChange(selectedProvider);
    console.log(selectedProvider)
    updateLLM(selectedProvider, model);
  };

  const handleModelChange = (event: any) => {
    const selectedModel:string = event.target.value;
    setModel(selectedModel);
    onModelChange(selectedModel);
    updateLLM(provider, selectedModel);
  };


  const updateLLM = (llmProvider: string, llmModel: string) => {
    mutation.mutate({
      id: pv.id,
      promptPackageId: pv.promptPackageId,
      promptTemplateId: pv.promptTemplateId,
      template: pv.template,
      llmConfig: pv.llmConfig as LlmConfigSchema,
      llmProvider,
      llmModel,
    });
  };

  return (
    <>
      <Button variant="text" onClick={handleOpen}>
        {model}
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        <Box sx={{
          p: 2,
        }}>
          <Typography variant="h6" component="h2">
            Model
          </Typography>
          {/* <CloseIcon sx={{ flex: 1, cursor: 'pointer' }} onClick={handleClose}/> */}

          <Typography mt={2}>
            The LLM provider and model that'll be used to power this prompt.
          </Typography>

          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <FormLabel>Provider</FormLabel>
              <Select
                value={provider}
                onChange={handleProviderChange}
              >
                {providers.map((p, index) =>(
                  <MenuItem
                      key={"pt-"+index}
                      value={p[0]}
                      disabled={index > 1}

                  >
                    {p[1]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Model</FormLabel>
              <Select
                value={model}
                onChange={handleModelChange}
              >

                {models[provider as keyof typeof models].map((mo, index) =>(
                <MenuItem
                    key={"pt-"+index}
                    value={mo[0]}
                >
                  {mo[1]}
                </MenuItem>))}

                {/* <option value="davinci">davinci</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-4-0613">gpt-4-0613</option>
                <option value="gpt-4-0314">gpt-4-0314</option> */}
                {/* Add more options */}
              </Select>
            </FormControl>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} mt={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </>
  );
}

export default LLMSelector;
