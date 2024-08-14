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
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { voiceForm, QuestionSchema } from "@sugar-ai/core"; // Update with actual import path

interface CreateVoiceFormProps {
  onSubmit: Function;
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
    watch,
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
    resolver: zodResolver(voiceForm),
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
    console.log(data);
    try {
      onSubmit(data);
    } catch (error) {
      console.log(error);
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
          <Typography variant="h6">Create New Form</Typography>
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

            {formMessageType.options.map((messageType) => (
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

interface CreateQuestionProps {
  voiceFormId: string;
  onSubmit: Function;
  isLoading: boolean;
  status: string;
  customError: any;
}

export const CreateQuestion: React.FC<CreateQuestionProps> = ({
  voiceFormId,
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
    watch,
    reset,
  } = useForm({
    defaultValues: {
      question_type: "text",
      question_text: "",
      question_params: {},
      validation: {},
    },
    resolver: zodResolver(QuestionSchema),
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
      setError("question_text", {
        type: "manual",
        message: customError.error?.question_text,
      });
    } else {
      clearErrors("question_text");
    }
  }, [customError, setError, clearErrors]);

  const onFormSubmit = (data: any) => {
    console.log(data);
    try {
      onSubmit({ ...data, voiceFormId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={() => setIsOpen(true)}>
          Create Question
        </Button>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Create New Question</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <Controller
              name="question_type"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Question Type"
                  error={!!errors.question_type}
                  helperText={
                    errors.question_type?.message
                      ? errors.question_type?.message
                      : ""
                  }
                >
                  <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
                  <MenuItem value="single_choice">Single Choice</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="number">Number</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="question_text"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Text"
                  error={!!errors.question_text}
                  helperText={
                    errors.question_text?.message
                      ? errors.question_text?.message
                      : ""
                  }
                />
              )}
            />

            <Controller
              name="question_params"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Question Params"
                  error={!!errors.question_params}
                  helperText={
                    errors.question_params?.message
                      ? errors.question_params?.message
                      : ""
                  }
                />
              )}
            />

            <Controller
              name="validation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Validation"
                  error={!!errors.validation}
                  helperText={
                    errors.validation?.message ? errors.validation?.message : ""
                  }
                />
              )}
            />
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
