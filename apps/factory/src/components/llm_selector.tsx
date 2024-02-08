import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Stack,
  Select,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  providerModels,
  Provider,
  Model,
  LLM,
  getDefaultLLM,
} from "~/validators/base";
import { FormProviderSelectInput } from "./form_components/formProviderSelect";
import { FormModelSelectInput } from "./form_components/formModelSelect";
import { Controller } from "react-hook-form";
import { FormSelectInput } from "./form_components/formSelectInput";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
function LLMSelector({
  initialLLM,
  onLLMChange,
  publishedAt,
  readonly,
}: {
  initialLLM: LLM;
  onLLMChange: Function;
  publishedAt?: any;
  readonly?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [llm, setLLM] = useState<LLM>(initialLLM);
  const [tllm, setTllm] = useState<LLM>(initialLLM);
  console.log(`LLM ||| 2 >>>>>>>>> ${JSON.stringify(llm)}`);

  //
  const [openConsent, setOpenConsent] = useState("");

  const onConsent = (haveConsent: boolean) => {
    if (haveConsent) {
      onLLMChange(tllm);
      setLLM(tllm);
    } else {
      console.debug("user disagreed");
    }
    // Close the consent popup
    setOpenConsent("");
  };

  const getRole = (providerName: string, modelName: string) => {
    return providerModels[
      `${llm?.modelType as keyof typeof providerModels}`
    ].models[`${providerName}`]?.find((mod) => mod.name === modelName)?.hasRole;
  };

  // TODO: Add check for hasRole so it wont always ask for consent.
  const isEditorChanged = function (llm: LLM) {
    console.log("initial LLM", initialLLM);
    console.log("next LLM", llm);
    return (
      getRole(llm.provider, llm.model) !==
      getRole(initialLLM.provider, initialLLM.model)
    );
  };

  // const handleLLMChange2 = (llm: LLM, haveConsent: boolean = false)=>{
  //   setLLM(llm);
  //   setOpenConsent(llm.provider);
  // }

  const handleLLMChange = (llm: LLM, haveConsent: boolean = false) => {
    console.log(
      `<<<<<<<<<>>>>>>>>> LLM Selector - Parent callback ${JSON.stringify(
        llm,
      )}`,
    );

    // console.log(llm)

    setTllm(llm);
    if (isEditorChanged(llm)) {
      setOpenConsent(llm.provider);
    } else {
      onLLMChange(llm);
    }
  };

  // return <></>;

  // Got Agree from user to let go off old template
  return (
    <>
      <ConsentProvider nextProvider={openConsent} onResult={onConsent} />
      <Button
        variant="text"
        onClick={(e: any) => setIsOpen(true)}
        disabled={!!publishedAt}
      >
        {llm.provider} - {llm.model}
      </Button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <Box>
            <Typography variant="h6" component="h2">
              Model
            </Typography>
            {/* <CloseIcon sx={{ flex: 1, cursor: 'pointer' }} onClick={handleClose}/> */}

            <Typography mt={2}>
              The LLM provider and model that'll be used to power this prompt.
            </Typography>
            <LLMForm
              initialLLM={llm}
              onLLMChange={handleLLMChange}
              // handleProviderChange={
              //   !flag ? handleNextProviderChange : handleChange
              // }
              readonly={readonly}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="outlined" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default LLMSelector;

export const LLMForm = ({
  initialLLM,
  onLLMChange,
  readonly,
}: {
  initialLLM: LLM;
  onLLMChange: (e: any) => void;
  readonly: boolean | undefined;
}) => {
  const [llm, setLLM] = useState<LLM>(initialLLM);

  console.log(`LLM ||| 3 >>>>>>>>> ${JSON.stringify(llm)}`);

  return (
    <>
      <Stack spacing={2} mt={2}>
        <FormControl fullWidth>
          <FormLabel>Provider</FormLabel>
          <Select
            value={llm.provider}
            onChange={(e: any) => {
              setLLM((prev) => ({ ...prev, provider: e.target.value }));
            }}
            disabled={readonly}
          >
            {providerModels[llm.modelType as ModelTypeType].providers.map(
              (provider: Provider) => (
                <MenuItem
                  key={provider.name}
                  value={provider.name}
                  disabled={!provider.enabled}
                >
                  {provider.label}
                </MenuItem>
              ),
            )}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <FormLabel>Model</FormLabel>
          <Select
            value={llm.model}
            // onChange={handleModelChange}
            onChange={(e: any) => {
              setLLM((prev) => ({ ...prev, model: e.target.value }));
              onLLMChange({ ...llm, model: e.target.value });
            }}
            disabled={readonly}
          >
            {providerModels[llm.modelType as ModelTypeType].models?.[
              llm.provider
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
  onResult,
}: {
  nextProvider: string;
  onResult: (nextProvider: boolean) => void;
}) => {
  return (
    <div>
      <Dialog
        open={nextProvider.length > 0 ? true : false}
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
          <Button onClick={() => onResult(false)}>Disagree</Button>
          <Button onClick={() => onResult(true)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export const LLMForm2 = ({
  initialLLM,
  control,
  onLLMChange,
  readonly,
}: {
  initialLLM: LLM;
  onLLMChange: (e: any) => void;
  control: any;
  readonly: boolean | undefined;
}) => {
  const [llm, setLLM] = useState<LLM>(initialLLM);

  console.log(`LLM ||| 3 >>>>>>>>> ${JSON.stringify(llm)}`);

  return (
    <>
      <Stack spacing={2} mt={2}>
        <FormProviderSelectInput
          name="provider"
          control={control}
          label="Provider"
          modelType={llm.modelType}
          defaultValue={llm.provider}
          // error={!!errors.version}
          // helperText={errors.version?.message}
          readonly={false}
          onChange={(e) => {
            setLLM((prev) => ({ ...prev, provider: e.target.value }));
          }}
        />

        <FormModelSelectInput
          name="model"
          control={control}
          label="Model"
          provider={llm.provider}
          modelType={llm.modelType}
          defaultValue={llm.model}
          // error={!!errors.version}
          // helperText={errors.version?.message}
          readonly={false}
          onChange={(e) => {
            setLLM((prev) => ({ ...prev, model: e.target.value }));
          }}
        />
      </Stack>
    </>
  );
};
