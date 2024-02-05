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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { providerModels, Provider, Model, LLM } from "~/validators/base";
function LLMSelector({
  initialLLM,
  onLLMChange,
  publishedAt,
  needConsent,
  readonly,
}: {
  initialLLM: LLM;
  onLLMChange: Function;
  publishedAt?: any;
  needConsent: boolean;
  readonly?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pLLm, setLLM] = useState<LLM>(initialLLM);

  //
  const [openConsent, setOpenConsent] = useState("");

  const onConsent = (haveConsent: boolean) => {
    if (haveConsent) {
      handleLLMChange(pLLm, true);
    }

    // Close the consent popup
    setOpenConsent("");
  };

  // TODO: Add check for hasRole so it wont always ask for consent.
  const isEditorChanged = function () {
    return true;
  };

  const handleLLMChange = (llm: LLM, haveConsent: boolean = false) => {
    console.log(
      `<<<<<<<<<>>>>>>>>> LLM Selector - Parent callback ${JSON.stringify(
        llm,
      )}`,
    );

    setLLM(llm);

    if (needConsent && isEditorChanged() && !haveConsent) {
      // checking for consent, before makign further changes
      setOpenConsent(llm.provider);
      console.log("asking for consent");
    }
    if (needConsent && isEditorChanged() && haveConsent) {
      onLLMChange(llm);
      console.log("Sending to parent 1");
    } else if (!needConsent) {
      onLLMChange(llm);
      console.log("Sending to parent 2");
    } else {
      console.log("Ignoring changes");
    }
  };

  // return <></>;

  // Got Agree from user to let go off old template
  if (needConsent) {
    return (
      <>
        <ConsentProvider nextProvider={openConsent} onResult={onConsent} />
        <Button
          variant="text"
          onClick={(e) => setIsOpen(true)}
          disabled={!!publishedAt}
        >
          {pLLm.provider} - {pLLm.model}
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
                llm={pLLm}
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
  } else {
    return (
      <>
        <LLMForm llm={pLLm} onLLMChange={handleLLMChange} readonly={readonly} />
      </>
    );
  }
}

export default LLMSelector;

export const LLMForm = ({
  llm,
  onLLMChange,
  readonly,
}: {
  llm: LLM;
  onLLMChange: (e: any) => void;
  readonly: boolean | undefined;
}) => {
  const [pLLM, setLLM] = useState<LLM>(llm);

  return (
    <>
      <Stack spacing={2} mt={2}>
        <FormControl fullWidth>
          <FormLabel>Provider</FormLabel>
          <Select
            value={pLLM.provider}
            onChange={(e) => {
              setLLM((prev) => ({ ...prev, provider: e.target.value }));
            }}
            disabled={readonly}
          >
            {providerModels[pLLM.modelType].providers.map(
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
            value={pLLM.model}
            // onChange={handleModelChange}
            onChange={(e) => {
              setLLM((prev) => ({ ...prev, model: e.target.value }));
              onLLMChange({ ...pLLM, model: e.target.value });
            }}
            disabled={readonly}
          >
            {providerModels[pLLM.modelType].models?.[pLLM.provider]?.map(
              (model: Model) => (
                <MenuItem
                  key={model.name}
                  value={model.name}
                  disabled={!model.enabled}
                >
                  {model.label}
                </MenuItem>
              ),
            )}
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
