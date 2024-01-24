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
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
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

  const [nextProvider, setNextProvider] = useState("");

  const [model, setModel] = useState(initialModel);

  const [openWarningModal, setOpenWarningModal] = useState(false);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const mutation = api.prompt.updateVersion.useMutation();

  const handleProviderChange = (event: any) => {
    setNextProvider(event.target.value);
    setOpenWarningModal(true);
  };

  const handleModelChange = (event: any) => {
    const selectedModel: string = event.target.value;
    setModel(selectedModel);
    onModelChange(selectedModel);
    // updateLLM(provider, selectedModel);
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

  const handleChangeProviderWithoutWarning = () => {
    setOpenWarningModal(false);
  };

  const handleChangeProviderWithWarning = () => {
    const selectedProvider: string = nextProvider;
    setProvider(selectedProvider);
    const modelValue: string | undefined =
      providerModels[pt?.modelType as keyof typeof providerModels]?.models[
        selectedProvider
      ]?.[0]?.name;
    onProviderChange(selectedProvider);
    // console.log(selectedProvider);
    // Update default value for model
    setModel(modelValue as string);
    // onProviderChange(selectedProvider, modelValue);
    onModelChange(modelValue);
    // updateLLM(selectedProvider, modelValue as string);
    setOpenWarningModal(false);
  };

  return (
    <>
      <WarningModal
        nextProvider={nextProvider}
        handleChangeProviderWithWarning={handleChangeProviderWithWarning}
        handleChangeProviderWithoutWarning={handleChangeProviderWithoutWarning}
        openWarningModal={openWarningModal}
      />
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

const WarningModal = ({
  nextProvider,
  handleChangeProviderWithWarning,
  handleChangeProviderWithoutWarning,
  openWarningModal,
}: {
  nextProvider: string;
  handleChangeProviderWithWarning: (nextProvider: string) => void;
  handleChangeProviderWithoutWarning: () => void;
  openWarningModal: boolean;
}) => {
  return (
    <div>
      <Dialog
        open={openWarningModal}
        onClose={handleChangeProviderWithoutWarning}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{ color: "red", fontSize: "2rem", fontWeight: "bold" }}
        >
          {"Warning"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "white" }}
          >
            You will loose your current progress by changing to different format
            provider
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleChangeProviderWithoutWarning}>Disagree</Button>
          <Button
            onClick={() => handleChangeProviderWithWarning(nextProvider)}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
