import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  IconButton,
  TextField,
  Grid,
  Chip,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Question,
  LanguageCode,
  i18nMessage,
  questionType,
  VoiceForm,
  formFieldValidator,
} from "@sugar-ai/core";
import CreateI18nMessage from "../create_i18n_message";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface QuestionNewProps {
  voiceForm: VoiceForm;
  initQuestion: Question | null;
  onSubmit: (data: Question) => Promise<void>;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
}

const QuestionNew: React.FC<QuestionNewProps> = ({
  voiceForm,
  initQuestion,
  onSubmit,
  isLoading,
  open,
  onClose,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Question>({
    defaultValues: {
      id: initQuestion?.id || "",
      question_type: initQuestion?.question_type || "text",
      question_text: initQuestion?.question_text || { lang: { en: "" } },
      // @ts-ignore
      question_params: initQuestion?.question_params || { options: [] },
      qualification: {
        type: initQuestion?.qualification?.type || "ai",
        criteria: initQuestion?.qualification?.criteria || "",
      },

      // @ts-ignore
      validation: initQuestion?.validation || {
        type: initQuestion?.validation?.type || "ai",
        criteria: initQuestion?.validation?.criteria || "",
        max_length: 120,
        validators: [],
      },
      order: initQuestion?.order,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "question_params.options",
  });

  const [isChoiceQuestion, setIsChoiceQuestion] = useState(
    initQuestion?.question_type === "multiple_choice" ||
      initQuestion?.question_type === "single_choice",
  );

  // useEffect(() => {
  //   if (open) {
  //     reset({
  //       id: initQuestion?.id || "",
  //       question_type: initQuestion?.question_type || "",
  //       question_text: initQuestion?.question_text || { lang: { en: "" } },
  //       question_params: initQuestion?.question_params || { options: [] },
  //       qualification_type: initQuestion?.qualification?.type || "ai",
  //       qualification_criteria: initQuestion?.qualification?.criteria || "",
  //       validation: initQuestion?.validation || {
  //         max_length: 120,
  //         validators: [],
  //       },
  //     });
  //     setIsChoiceQuestion(
  //       initQuestion?.question_type === "multiple_choice" ||
  //         initQuestion?.question_type === "single_choice",
  //     );
  //   }
  // }, [initQuestion, open, reset]);

  const handleQuestionTypeChange = (value: string) => {
    setIsChoiceQuestion(
      value === "multiple_choice" || value === "single_choice",
    );
  };

  const handleSaveMessage = (key: any, message: i18nMessage) => {
    setValue(key, message);
  };

  const handleSaveOption = (index: any, message: i18nMessage) => {
    setValue(index, message);
  };

  const onSubmitForm = async (data: any) => {
    const q: Question = {
      ...data,
      id: initQuestion?.id || "",
    };
    await onSubmit(q);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Chip
          sx={{ mr: 2 }}
          label={initQuestion?.order}
          color="primary"
          variant="outlined"
        />
        {initQuestion?.id ? "Edit Question" : "Add New Question"}
      </DialogTitle>
      <DialogContent className="pt-5">
        <Box
          component="form"
          className="space-y-4 pt-6"
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <FormControl fullWidth>
            <InputLabel>Question Type</InputLabel>
            <Controller
              name="question_type"
              control={control}
              rules={{ required: "Question type is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Question Type"
                  fullWidth
                  error={!!errors.question_type}
                  onChange={(e) => {
                    field.onChange(e);
                    handleQuestionTypeChange(e.target.value);
                  }}
                >
                  <MenuItem value={questionType.Enum.multiple_choice}>
                    Multiple Choice
                  </MenuItem>
                  <MenuItem value={questionType.Enum.single_choice}>
                    Single Choice
                  </MenuItem>
                  <MenuItem value={questionType.Enum.text}>Text</MenuItem>
                  <MenuItem value={questionType.Enum.number}>Number</MenuItem>
                </Select>
              )}
            />
          </FormControl>
          <CreateI18nMessage
            fieldKey="question_text"
            fieldName="Question Text"
            initialMessage={initQuestion?.question_text || { lang: { en: "" } }}
            allowedLanguages={voiceForm?.languages}
            onSave={handleSaveMessage}
          />
          {isChoiceQuestion && (
            <Box>
              <h3 className="mb-2 font-semibold">Options</h3>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  className="mb-2 flex items-center space-x-2"
                >
                  <CreateI18nMessage
                    fieldKey={`question_params.options.${index}`}
                    fieldName={`Option ${index + 1}`}
                    // @ts-ignore
                    initialMessage={field}
                    allowedLanguages={voiceForm?.languages}
                    onSave={handleSaveOption}
                  />
                  <IconButton onClick={() => remove(index)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                variant="contained"
                onClick={() => append({ lang: { en: "" } })}
                startIcon={<AddIcon />}
              >
                Add Option
              </Button>
            </Box>
          )}

          <Box className="border-2 border-gray-700 p-2" sx={{ mb: 4 }}>
            <Typography component="h2" className="pb-4 text-3xl font-bold">
              Validation
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Validation Type</InputLabel>
                  <Controller
                    name="validation.type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Validation Type"
                        fullWidth
                        error={!!errors.validation?.type}
                      >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="ai">AI</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  name="validation.criteria"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Validation Criteria"
                      fullWidth
                      error={!!errors.validation?.criteria}
                      helperText={errors.validation?.criteria?.message || ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          <Box className="border-2 border-gray-700 p-2" sx={{ mb: 4 }}>
            <Typography component="h2" className="pb-4 text-3xl font-bold">
              Qualfication
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Qualification Type</InputLabel>
                  <Controller
                    name="qualification.type"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Qualification Type"
                        fullWidth
                        error={!!errors.qualification?.type}
                      >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="ai">AI</MenuItem>
                        <MenuItem value="manual">Manual</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={9}>
                <Controller
                  name="qualification.criteria"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Qualification Criteria"
                      fullWidth
                      error={!!errors.qualification?.criteria}
                      helperText={errors.qualification?.criteria?.message || ""}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box className="border-2 border-gray-700 p-2" sx={{ mb: 4 }}>
            <Typography component="h2" className="pb-4 text-3xl font-bold">
              Speech Settings
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={6} sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel></InputLabel>
                  <Controller
                    name="validation.max_length"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Max Length"
                        type="number"
                        fullWidth
                        error={!!errors.validation?.max_length}
                        helperText={
                          errors.validation?.max_length?.message || ""
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6} sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Validate For</InputLabel>
                  <Controller
                    name="validation.validators"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        label="Validate For"
                        fullWidth
                        error={!!errors.validation?.validators}
                        multiple
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value.length === 0 ? [] : value);
                          // handleQuestionTypeChange(value);
                        }}
                        renderValue={(selected) => selected.join(", ")} // This is optional, for better UI
                      >
                        {formFieldValidator._def.values.map((validator) => (
                          <MenuItem key={validator} value={validator}>
                            {validator}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <DialogActions>
            <Button disabled={isLoading} onClick={onClose} color="secondary">
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              size="small"
              color="primary"
              variant="contained"
              loading={isLoading}
              sx={{ width: "8rem" }}
            >
              {initQuestion?.id
                ? isLoading
                  ? "Updating"
                  : "Update Question"
                : isLoading
                ? "Adding"
                : "Add Question"}
            </LoadingButton>
            {/* <Button type="submit" variant="contained" color="primary">
              {initQuestion?.id
                ? isLoading
                  ? "Updating ..."
                  : "Update Question"
                : isLoading
                ? "Adding ..."
                : "Add Question"}
            </Button> */}
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionNew;
