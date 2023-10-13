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
  Dialog,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { LlmConfigSchema } from "~/validators/prompt_version";
import React, { useState } from "react";
import { providerModels, Provider, Model } from "~/validators/base";
import { api } from "~/utils/api";
import { VersionSchema } from "~/validators/prompt_version";
import { TemplateOutput as pt } from "~/validators/prompt_template";

function LLMSelector({
  initialProvider,
  initialModel,
  onProviderChange,
  onModelChange,
  pv,
  pt,
}: {
  initialProvider: string;
  initialModel: string;
  onProviderChange: Function;
  onModelChange: Function;
  pv: VersionSchema;
  pt: pt;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [provider, setProvider] = useState(initialProvider);

  const [model, setModel] = useState(initialModel);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const mutation = api.prompt.updateVersion.useMutation();

  const handleProviderChange = (event: any) => {
    const selectedProvider: string = event.target.value;
    setProvider(selectedProvider);
    const modelValue: string | undefined =
      providerModels[pt?.modelType as keyof typeof providerModels]?.models[
        selectedProvider
      ]?.[0]?.name;
    onProviderChange(selectedProvider);
    console.log(selectedProvider);
    // Update default value for model
    setModel(modelValue as string);
    onModelChange(modelValue);
    updateLLM(selectedProvider, modelValue as string);
  };

  const handleModelChange = (event: any) => {
    const selectedModel: string = event.target.value;
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
      <Button variant="text" onClick={handleOpen} disabled={!!pv.publishedAt}>
        {provider} - {model}
      </Button>

      <Dialog open={isOpen} onClose={handleClose}>
        <Box
          sx={{
            p: 2,
          }}
        >
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
              <Select value={provider} onChange={handleProviderChange}>
                {providerModels[
                  pt?.modelType as keyof typeof providerModels
                ].providers.map((provider: Provider) => (
                  <MenuItem
                    key={provider.name}
                    value={provider.name}
                    disabled={!provider.enabled}
                  >
                    {provider.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Model</FormLabel>
              <Select value={model} onChange={handleModelChange}>
                {providerModels[
                  pt?.modelType as keyof typeof providerModels
                ].models?.[provider]?.map((model: Model) => (
                  <MenuItem
                    key={model.name}
                    value={model.name}
                    disabled={!model.enabled}
                  >
                    {model.label}
                  </MenuItem>
                ))}
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
