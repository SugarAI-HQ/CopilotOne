import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { Form } from "~/validators/form";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormInput } from "~/validators/form";
import CreateI18nMessage from "~/components/voice_forms/create_i18n_message"; // Update with actual import path

const FormEdit: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const [status, setStatus] = useState("");
  const [voiceForm, setVoiceForm] = useState<Form>([]);
  const [customError, setCustomError] = useState({});

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
      description: { lang: { en: "" } },
      startButtonText: { lang: { en: "" } },
      messages: {
        welcome: "",
        submit: "",
      },
      languages: ["en"],
      formConfig: {},
    },
    resolver: zodResolver(createFormInput),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleClose = () => {
    reset();
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

  const { data: form } = api.forms.getForm.useQuery(
    { id: formId },
    {
      onSuccess(data) {
        setVoiceForm([...data]);
        setValue("name", data.name);
        setValue("description", data.description);
        setValue("startButtonText", data.startButtonText);
        setValue("messages", data.messages);
        setValue("languages", data.languages);
      },
    },
  );

  const handleVoiceFormCreationSuccess = (createdForm) => {
    // setStatus("success");
    // toast.success("Form created successfully");
  };

  const formMutation = api.forms.createForm.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (createdForm) => {
      if (createdForm !== null) {
        setCustomError({});
        handleVoiceFormCreationSuccess(createdForm);
      } else {
        toast.error("Something went wrong, Please try again");
      }
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    formMutation.mutate(data);
  };

  const handleSaveDescription = (message: i18nMessage) => {
    setValue("description", message);
  };

  const handleSaveStartButtonText = (message: i18nMessage) => {
    setValue("startButtonText", message);
  };

  return (
    <Box className="w-full">
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

        <CreateI18nMessage
          initialMessage={{ lang: voiceForm?.description?.lang || { en: "" } }}
          initialLanguages={voiceForm?.languages || ["en"]}
          onSave={handleSaveDescription}
        />

        <CreateI18nMessage
          initialMessage={{
            lang: voiceForm?.startButtonText?.lang || { en: "" },
          }}
          initialLanguages={voiceForm?.languages || ["en"]}
          onSave={handleSaveStartButtonText}
        />
      </Stack>

      <Button
        size="small"
        variant="outlined"
        onClick={handleSubmit(onFormSubmit)}
        disabled={formMutation.isLoading}
      >
        {formMutation.isLoading ? "Saving..." : "Save"}
      </Button>
    </Box>
  );
};

FormEdit.getLayout = getLayout;

export default FormEdit;
