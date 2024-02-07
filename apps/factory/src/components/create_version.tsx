import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import {
  inputCreateVersion,
  VersionOutput as pv,
} from "~/validators/prompt_version";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { parse, valid } from "semver";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import ForkRightIcon from "@mui/icons-material/ForkRight";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormTextInput } from "./form_components/formTextInput";
import type {
  CreateVersionInput,
  GetVersionsInput,
  InputCreateVersion,
} from "~/validators/prompt_version";
import { createVersionInput } from "~/validators/prompt_version";
import LLMSelector, { LLMForm, LLMForm2 } from "./llm_selector";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import { LLM, Model, Provider, providerModels } from "~/validators/base";
import { FormSelectInput } from "./form_components/formSelectInput";
import { FormProviderSelectInput } from "./form_components/formProviderSelect";
import { FormModelSelectInput } from "./form_components/formModelSelect";

CreateVersion.defaultProps = {
  icon: <AddCircleIcon />,
  forkedFrom: null,
  v: "0.0.1",
};
export function CreateVersion({
  pp,
  pt,
  onCreate,
  icon,
  forkedFrom,
  v,
}: {
  pp: pp;
  pt: pt;
  icon?: React.JSX.Element;
  v: string;
  onCreate: Function;
  forkedFrom: pv;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [llm, setLLM] = useState<LLM>({
    modelType: pt?.modelType as ModelTypeType,
    provider:
      forkedFrom?.llmProvider ||
      providerModels[pt?.modelType as ModelTypeType].defaultProvider,
    model:
      forkedFrom?.llmModel ||
      providerModels[pt?.modelType as ModelTypeType].defaultModel,
  });

  const forkedFromId = forkedFrom?.id || null;
  console.log(`LLM ||| 6 >>>>>>>>> ${JSON.stringify(llm)} ${forkedFromId}`);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
    reset,
  } = useForm<InputCreateVersion>({
    defaultValues: {
      version: v,
      promptPackageId: pp?.id,
      promptTemplateId: pt?.id,
      forkedFromId: forkedFromId,
      moduleType: pt?.modelType,
      provider: llm.provider,
      model: llm.model,
    },
    resolver: zodResolver(inputCreateVersion),
  });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };
  // pvCreateMutation.mutate()
  const pvCreateMutation = api.prompt.createVersion.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setError("version", {
        type: "manual",
        message: errorData.error?.message,
      });
    },
    onSuccess: (pv) => {
      if (pv !== null) {
        onCreate(pv);
        handleClose();
        toast.success(`Version ${pv.version} Created Successfully`);
      }
    },
  });

  const onFormSubmit = (data: CreateVersionInput) => {
    const response = {
      promptPackageId: pp?.id,
      promptTemplateId: pt?.id,
      version: data.version,
      forkedFromId: forkedFromId,
      moduleType: pt?.modelType,
      provider: llm.provider,
      model: llm.model,
    };
    console.log(response);
    pvCreateMutation.mutate(response as InputCreateVersion);
  };

  const handleLLMChange = (llm: LLM) => {
    console.log(`create version: llm >>>>>>>: ${JSON.stringify(llm)}`);
    setLLM(llm);
  };

  return (
    <>
      <Grid component="span">
        {/* <Button
          variant="outlined"
          startIcon={<AddCircleIcon />}
          size="small"
          aria-label="add version"
          onClick={() => setIsOpen(true)}
          color="primary"
        >
          New Version
        </Button> */}
        <Tooltip
          title={forkedFrom?.id ? "Fork" : "Create Version"}
          placement="top-start"
        >
          <IconButton
            size="small"
            aria-label="add template"
            onClick={() => setIsOpen(true)}
            color="primary"
          >
            {forkedFrom?.id ? <ForkRightIcon /> : <AddCircleIcon />}
          </IconButton>
        </Tooltip>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle>New Prompt Version</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormTextInput
              name="version"
              control={control}
              label="Version"
              error={!!errors.version}
              helperText={errors.version?.message}
              readonly={false}
            />

            {/* <FormProviderSelectInput
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
              name="provider"
              control={control}
              label="Provider"
              provider={llm.provider}
              modelType={llm.modelType}
              defaultValue={llm.model}
              // error={!!errors.version}
              // helperText={errors.version?.message}
              readonly={false}
              onChange={(e) => {
                setLLM((prev) => ({ ...prev, model: e.target.value }));
              }}
            /> */}

            {/* <LLMForm2
              key={llm.modelType + llm.model + llm.provider}
              initialLLM={llm}
              control={control}
              onLLMChange={handleLLMChange}
              readonly={false}
            /> */}

            <LLMForm
              key={llm.modelType + llm.model + llm.provider}
              initialLLM={llm}
              onLLMChange={handleLLMChange}
              readonly={false}
            />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button size="small" onClick={handleClose} variant="outlined">
            Cancel
          </Button>

          <Button
            size="small"
            onClick={handleSubmit(onFormSubmit)}
            variant="outlined"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
