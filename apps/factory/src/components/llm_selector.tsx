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
import React, { useEffect, useState } from "react";
import { providerModels, Provider, Model } from "~/validators/base";
import { api } from "~/utils/api";
import { VersionSchema } from "~/validators/prompt_version";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import z from "zod";
function LLMSelector({
  initialProvider,
  initialModel,
  onProviderChange,
  onModelChange,
  publishedAt,
  modelType,
  flag,
  readonly,
}: {
  initialProvider: string;
  initialModel: string;
  onProviderChange: Function;
  onModelChange: Function;
  publishedAt?: any;
  modelType: string | undefined;
  flag: boolean;
  readonly?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [provider, setProvider] = useState(initialProvider);

  const [nextProvider, setNextProvider] = useState("");

  const [model, setModel] = useState(initialModel);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const handleModelChange = (event: any) => {
    const selectedModel: string = event.target.value;
    setModel(selectedModel);
    onModelChange(selectedModel);
  };
  const handleNextProviderChange = (provider: string) => {
    setNextProvider(provider);
  };

  const handleChange = (provider: string) => {
    setProvider(provider);
    const modelValue: string | undefined =
      providerModels[modelType as keyof typeof providerModels]?.models[
        provider
      ]?.[0]?.name;
    onProviderChange(provider);

    // Update default value for model
    setModel(modelValue as string);

    onModelChange(modelValue);
  };

  const onSuccess = () => {
    handleChange(nextProvider);
    setNextProvider("");
  };

  useEffect(() => {
    setProvider(initialProvider);
    setModel(initialModel);
  }, [initialProvider, initialModel]);

  if (!flag) {
    return (
      <>
        <ConsentProvider
          nextProvider={nextProvider}
          setNextProvider={setNextProvider}
          onSuccess={onSuccess}
        />
        <Button variant="text" onClick={handleOpen} disabled={!!publishedAt}>
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
            <LLM
              provider={provider}
              model={model}
              handleModelChange={handleModelChange}
              handleProviderChange={
                !flag ? handleNextProviderChange : handleChange
              }
              modelType={modelType}
              readonly={readonly}
            />
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
  } else {
    return (
      <>
        <LLM
          provider={provider}
          model={model}
          handleModelChange={handleModelChange}
          handleProviderChange={!flag ? handleNextProviderChange : handleChange}
          modelType={modelType}
          readonly={readonly}
        />
      </>
    );
  }
}

export default LLMSelector;

export const LLM = ({
  provider,
  model,
  handleModelChange,
  handleProviderChange,
  modelType,
  readonly,
}: {
  provider: string;
  model: string;
  handleModelChange: (e: any) => void;
  handleProviderChange: (provider: string) => void;
  modelType: string | undefined;
  readonly: boolean | undefined;
}) => {
  return (
    <>
      <Stack spacing={2} mt={2}>
        <FormControl fullWidth>
          <FormLabel>Provider</FormLabel>
          <Select
            value={provider}
            onChange={(e) => {
              handleProviderChange(e.target.value);
            }}
            disabled={readonly}
          >
            {providerModels[
              modelType as keyof typeof providerModels
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
          <Select
            value={model}
            onChange={handleModelChange}
            disabled={readonly}
          >
            {providerModels[modelType as keyof typeof providerModels].models?.[
              provider
            ]?.map((model: Model) => (
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
    </>
  );
};

const ConsentProvider = ({
  nextProvider,
  setNextProvider,
  onSuccess,
}: {
  nextProvider: string;
  setNextProvider: React.Dispatch<React.SetStateAction<string>>;
  onSuccess: (nextProvider: string) => void;
}) => {
  return (
    <div>
      <Dialog
        open={nextProvider.length > 0 ? true : false}
        onClose={() => setNextProvider("")}
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
          <Button onClick={() => setNextProvider("")}>Disagree</Button>
          <Button onClick={() => onSuccess(nextProvider)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
