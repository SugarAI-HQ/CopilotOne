import React, { useState, useEffect } from "react";
import {
  Box,
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
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import {
  TemplateOutput as pt,
  templateOutput,
} from "~/validators/prompt_template";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  ModelTypeSchema,
  PromptRunModesType,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  CreateTemplateInput,
  TemplateOutput,
} from "~/validators/prompt_template";
import { createTemplateInput } from "~/validators/prompt_template";
import { FormTextInput } from "./form_components/formTextInput";
import { FormDropDownInput } from "./form_components/formDropDownInput";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { FormSelectInput } from "./form_components/formSelectInput";
import { TemplateListOutput } from "~/validators/prompt_template";
import LLMSelector, { LLMForm } from "./llm_selector";
import {
  providerModels,
  Provider,
  Model,
  LLM,
  getDefaultLLM,
} from "~/validators/base";
import { get } from "lodash";
export function CreateTemplate({
  pp,
  pts,
  onCreate,
  sx,
  status,
  customError,
  ptId,
}: {
  pp: pp;
  pts: TemplateListOutput;
  onCreate: Function;
  sx?: any;
  status: string;
  customError: any;
  ptId: string | boolean | undefined;
}) {
  const [isOpen, setIsOpen] = useState(pts.length > 0 ? false : true);
  // const router = useRouter();
  const searchParams = useSearchParams();
  const edit = searchParams?.get("edit");

  const defaultModelType = ModelTypeSchema.enum.TEXT2TEXT;

  const [datatoUpdate, setDataToUpdate] = useState<CreateTemplateInput>(
    {} as CreateTemplateInput,
  );

  const [llm, setLLM] = useState<LLM>(getDefaultLLM(defaultModelType));

  console.log(`LLM ||| 1 >>>>>>>>> ${JSON.stringify(llm)}`);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateTemplateInput>({
    defaultValues: {
      name: "",
      description: "",
      modelType: llm.modelType,
      promptPackageId: pp?.id,
      model: llm.model,
      provider: llm.provider,
    },
    resolver: zodResolver(createTemplateInput),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  // const modelType = watch("modelType");

  useEffect(() => {
    if (customError && customError.error) {
      setError("name", { type: "manual", message: customError.error?.name });
    } else {
      clearErrors("name");
    }
  }, [customError, setError, clearErrors]);

  useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status]);

  const handleClose = () => {
    setIsOpen(false);
    const llm = getDefaultLLM(defaultModelType);
    reset({
      name: "",
      description: "",
      promptPackageId: pp?.id,
      modelType: llm.modelType,
      model: llm.model,
      provider: llm.provider,
    });
  };

  const onFormSubmit = (data: CreateTemplateInput) => {
    try {
      const newObj = {
        options: {
          llm: llm,
        },
        template: { ...data, ...llm },
      };
      onCreate?.(newObj);
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  api.prompt.getTemplate.useQuery(
    {
      id: `${ptId}`,
    },
    {
      onSuccess(template: TemplateOutput) {
        setDataToUpdate({
          ...getDefaultLLM(template?.modelType || defaultModelType),
          ...template!,
        });
        // if (template?.modelType) {
        //   setLLM((prev) => ({ ...prev, modelType: template.modelType }) as LLM);
        // }
        if (edit === "true" && ptId) {
          reset({
            name: template?.name,
            description: template?.description,
            promptPackageId: template?.promptPackageId,
            modelType: template?.modelType,
          });
          setIsOpen(true);
        }
      },
    },
  );

  const fetchTemplateData = () => {
    reset({
      ...llm,
      name: datatoUpdate.name,
      description: datatoUpdate.description,
      promptPackageId: datatoUpdate.promptPackageId,
      modelType: datatoUpdate.modelType,
    });
    setIsOpen(true);
  };

  // to update
  const updateMutation = api.prompt.updateTemplate.useMutation();

  const updateTemplate = (data: CreateTemplateInput) => {
    debugger;
    const input = {
      id: ptId as string,
      description: data.description,
    };
    updateMutation.mutate(input, {
      onSuccess() {
        handleClose();
        toast.success("Template Updated Successfully");
        const updatedInput = {
          ...llm,
          name: datatoUpdate.name,
          description: data.description,
          promptPackageId: datatoUpdate.promptPackageId,
          modelType: datatoUpdate.modelType,
        };
        setDataToUpdate(updatedInput);
      },
      onError(error) {
        console.log(error);
      },
    });
  };

  // const handleLLMChange = (llm: LLM) => {
  //   console.log(`LLM ||| 4 >>>>>>>>> ${JSON.stringify(llm)}`);
  //   setLLM(llm);
  // };

  // const modelTypeOptions = Object.entries(ModelTypeSchema.enum);

  return (
    <Box component="span">
      <Tooltip
        title={!ptId ? "Create Template" : "Edit Template"}
        placement="top-start"
      >
        <IconButton
          size="small"
          aria-label="add template"
          onClick={(e: any) => {
            if (!ptId) {
              setIsOpen(true);
              console.log(`LLM ||| 5 >>>>>>>>> ${JSON.stringify(llm)}`);
              // setLLM((prev) => ({
              //   ...prev,
              //   modelType: e.target.value,
              // }));
            } else {
              fetchTemplateData();
            }
          }}
          color="primary"
        >
          {!ptId ? <AddCircleIcon /> : <EditIcon />}
        </IconButton>
      </Tooltip>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography>
            {ptId ? <>Update Template</> : <>New Prompt Template</>}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormSelectInput
              name="modelType"
              control={control}
              label="Model Type"
              error={!!errors.modelType}
              helperText={errors.modelType?.message}
              enumValues={ModelTypeSchema.enum}
              defaultValue={llm.modelType}
              readonly={!!ptId}
              onChange={(e: any) => {
                const pLLM = getDefaultLLM(e.target.value);
                setLLM((prev) => ({ ...prev, ...pLLM }));
              }}
            />
            <FormControl component="fieldset">
              <FormLabel component="legend">{"Provider"}</FormLabel>
              <Controller
                name={"provider"}
                control={control}
                render={({ ...field }) => (
                  <TextField
                    // required
                    select
                    variant="outlined"
                    // inputRef={ref}
                    {...field}
                    defaultValue={""}
                    error={!!errors.provider}
                    helperText={errors.provider?.message}
                    disabled={!!ptId}
                    onChange={(event: any) => {
                      setLLM((llm) => ({
                        ...llm,
                        provider: event.target.value,
                      }));
                    }}
                  >
                    {providerModels[
                      llm.modelType as ModelTypeType
                    ].providers.map((provider: Provider) => (
                      <MenuItem
                        key={provider.name}
                        value={provider.name}
                        disabled={!provider.enabled}
                      >
                        {provider.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">{"Model"}</FormLabel>
              <Controller
                name={"model"}
                control={control}
                render={({ ...field }) => (
                  <TextField
                    select
                    // required
                    variant="outlined"
                    // inputRef={ref}
                    {...field}
                    defaultValue={""}
                    disabled={!!ptId}
                    error={!!errors.model}
                    helperText={errors.model?.message}
                    onChange={(event: any) => {
                      setLLM((llm) => ({ ...llm, model: event.target.value }));
                    }}
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
                  </TextField>
                )}
              />
            </FormControl>

            {/* <LLMForm
              key={llm.modelType + llm.model + llm.provider}
              initialLLM={llm}
              onLLMChange={handleLLMChange}
              readonly={!ptId ? false : true}
              control={control}
            /> */}

            <FormTextInput
              name="name"
              required={true}
              control={control}
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              readonly={!ptId ? false : true}
            />

            <FormTextInput
              name="description"
              required={true}
              control={control}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
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
            onClick={
              ptId ? handleSubmit(updateTemplate) : handleSubmit(onFormSubmit)
            }
            variant="outlined"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
