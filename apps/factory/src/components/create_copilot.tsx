import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { FormTextInput } from "./form_components/formTextInput";
import { useForm } from "react-hook-form";
import { FormSelectInput } from "./form_components/formSelectInput";
import { CreateCopilotInput, createCopilotInput } from "~/validators/copilot";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateCopilotProps {
  onSubmit: Function;
  status: string;
  customError: any;
  copilotsExists: boolean;
}

export const CreateCopilot: React.FC<CreateCopilotProps> = ({
  onSubmit,
  status,
  customError,
  copilotsExists,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreateCopilotInput>({
    defaultValues: {
      name: "",
      description: "",
      copilotType: "Text2Text",
      status: "PRODUCTION",
      settings: {},
    },
    resolver: zodResolver(createCopilotInput),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status]);

  useEffect(() => {
    if (customError && customError.error) {
      setError("name", { type: "manual", message: customError.error?.name });
    } else {
      clearErrors("name");
    }
  }, [customError, setError, clearErrors]);

  const onFormSubmit = (data: CreateCopilotInput) => {
    console.log(data);
    try {
      onSubmit(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container justifyContent={copilotsExists ? "flex-end" : "center"}>
        <Button size="small" variant="outlined" onClick={() => setIsOpen(true)}>
          Create Copilot
        </Button>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Create New Copilot</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormTextInput
              name="name"
              control={control}
              label="Copilot Name"
              error={!!errors.name}
              helperText={
                errors.name?.message
                  ? errors.name?.message
                  : "(allowed: a-z, 0-9, - )"
              }
              readonly={false}
            />

            <FormTextInput
              name="description"
              control={control}
              label="Description of Copilot"
              error={!!errors.description}
              helperText={
                errors.description?.message ? errors.description?.message : ""
              }
              readonly={false}
            />
            <FormSelectInput
              name="copilotType"
              control={control}
              label="Copilot Type"
              error={!!errors.copilotType}
              helperText={errors.copilotType?.message}
              readonly={false}
              // defaultValue={""}
              enumValues={
                ["Web-React", "Mobile-ReactNative - COMING SOON"] as any
              }
              onChange={(e: any) => {
                setValue("copilotType", e.target.value);
              }}
              disabledOptions={["1"]}
              defaultValue={watch("copilotType")}
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
