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
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  ModelTypeSchema,
  PromptRunModesType,
  PromptRunModesSchema,
} from "~/generated/prisma-client-zod.ts";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTemplateInput } from "~/validators/prompt_template";
import { createTemplateInput } from "~/validators/prompt_template";
import { FormTextInput } from "./form_components/formTextInput";
import { FormDropDownInput } from "./form_components/formDropDownInput";
import EditIcon from "@mui/icons-material/Edit";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { FormSelectInput } from "./form_components/formSelectInput";
import { TemplateListOutput } from "~/validators/prompt_template";
import LLMSelector from "./llm_selector";
import { LLM } from "~/validators/base";
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
  // const [defaultModelType, setDefaultModelType] = useState<
  //   ModelTypeType | undefined
  // >(ModelTypeSchema.enum.TEXT2TEXT);

  const [datatoUpdate, setDataToUpdate] = useState<CreateTemplateInput>(
    {} as CreateTemplateInput,
  );

  // const [provider, setProvider] = useState("");
  // const [model, setModel] = useState("");

  const [llm, setLLM] = useState<LLM>({
    modelType: ModelTypeSchema.enum.TEXT2TEXT,
    provider: "",
    model: "",
  });

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
      modelType: ModelTypeSchema.enum.TEXT2TEXT,
      promptPackageId: pp?.id,
    },
    resolver: zodResolver(createTemplateInput),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const modelType = watch("modelType");

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
    reset({
      name: "",
      description: "",
      promptPackageId: pp?.id,
      modelType: ModelTypeSchema.enum.TEXT2TEXT,
    });
  };

  const onFormSubmit = (data: CreateTemplateInput) => {
    try {
      const newObj = {
        options: {
          provider: llm.provider,
          model: llm.model,
        },
        template: data,
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
      onSuccess(items) {
        setDataToUpdate(items!);
        setLLM((prev) => ({ ...prev, modelType: items?.modelType }) as LLM);
        if (edit === "true" && ptId) {
          reset({
            name: items?.name,
            description: items?.description,
            promptPackageId: items?.promptPackageId,
            modelType: items?.modelType,
          });
          setIsOpen(true);
        }
      },
    },
  );

  const fetchTemplateData = () => {
    reset({
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

  const handleLLMChange = (llm: LLM) => {
    setLLM(llm);
  };

  return (
    <Box component="span">
      <Tooltip
        title={!ptId ? "Create Template" : "Edit Template"}
        placement="top-start"
      >
        <IconButton
          size="small"
          aria-label="add template"
          onClick={
            !ptId
              ? (e) => {
                  setIsOpen(true);
                  setLLM((prev) => ({ ...prev, modelType: e.target.value }));
                }
              : (e) => {
                  fetchTemplateData();
                }
          }
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
            <FormDropDownInput
              name="modelType"
              control={control}
              label="Model Type"
              defaultValue={llm.modelType}
              readonly={!ptId ? false : true}
            />

            <LLMSelector
              initialLLM={llm}
              onLLMChange={handleLLMChange}
              needConsent={false}
              readonly={!ptId ? false : true}
            />

            <FormTextInput
              name="name"
              control={control}
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              readonly={!ptId ? false : true}
            />

            <FormTextInput
              name="description"
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
