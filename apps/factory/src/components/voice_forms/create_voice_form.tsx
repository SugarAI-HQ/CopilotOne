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
  TextField,
  MenuItem,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { VoiceForm, QuestionSchema } from "@sugar-ai/core"; // Update with actual import path
import { createFormInput } from "~/validators/form";

interface CreateVoiceFormProps {
  onSubmit: (data: any) => void;
  isLoading: boolean;
  status: string;
  customError: any;
}

export const CreateVoiceForm: React.FC<CreateVoiceFormProps> = ({
  onSubmit,
  isLoading,
  status,
  customError,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      //   description: "",
      //   startButtonText: "",
      //   messages: {
      //     welcome: "",
      //     submit: "",
      //     success: "",
      //     error: "",
      //     thankyou: "",
      //     "thankyou-message": "",
      //   },
      //   languages: [],
      //   formConfig: {},
    },
    resolver: zodResolver(createFormInput),
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

  const onFormSubmit = (data: any) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={() => setIsOpen(true)}>
          Create Form
        </Button>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography>Create New Form</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Form Name"
                  error={!!errors.name}
                  helperText={errors.name?.message ? errors.name?.message : ""}
                />
              )}
            />

            {/* <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  error={!!errors.description}
                  helperText={
                    errors.description?.message
                      ? errors.description?.message
                      : ""
                  }
                />
              )}
            />

            <Controller
              name="startButtonText"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Button Text"
                  error={!!errors.startButtonText}
                  helperText={
                    errors.startButtonText?.message
                      ? errors.startButtonText?.message
                      : ""
                  }
                />
              )}
            />

            {Object.keys(VoiceForm.shape.messages.shape).map((messageType) => (
              <Controller
                key={messageType}
                name={`messages.${messageType}`}
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={`${messageType} Message`}
                    error={!!errors.messages?.[messageType]}
                    helperText={
                      errors.messages?.[messageType]?.message
                        ? errors.messages?.[messageType]?.message
                        : ""
                    }
                  />
                )}
              />
            ))} */}
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button size="small" onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            size="small"
            variant="outlined"
            onClick={handleSubmit(onFormSubmit)}
            loadingPosition="start"
            loading={isLoading}
            sx={{ width: "8rem" }}
          >
            {isLoading ? <>Creating...</> : <>Create</>}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
