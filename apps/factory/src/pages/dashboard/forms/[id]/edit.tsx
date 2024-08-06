import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { Form } from "~/validators/form";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormInput } from "~/validators/form";
import CreateI18nMessage from "~/components/voice_forms/create_i18n_message";
import LanguagesSelector from "~/components/voice_forms/langauges_selector";
import { LanguageCode, i18nMessage } from "@sugar-ai/core";

const FormEdit: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const [status, setStatus] = useState("");
  const [voiceForm, setVoiceForm] = useState<Form>();
  const [customError, setCustomError] = useState({});
  const [allowedLanguages, setAllowedLanguages] = useState<LanguageCode[]>([
    "en",
  ]);

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

  const onFormSubmit = async (data: any) => {
    try {
      await formMutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: form } = api.forms.getForm.useQuery(
    { id: formId },
    {
      enabled: !!formId,
      onSuccess(form: Form) {
        setVoiceForm(form);
        setValue("name", form.name);
        setValue("description", form.description);
        setValue("startButtonText", form.startButtonText);
        setValue("languages", form.languages);
        setAllowedLanguages(form.languages);
        setValue("messages", form.messages);
      },
    },
  );

  const handleVoiceFormCreationSuccess = (createdForm) => {
    setStatus("success");
    toast.success("Form updated successfully");
  };

  const formMutation = api.forms.updateForm.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (updateForm) => {
      if (updateForm !== null) {
        setCustomError({});
        handleVoiceFormCreationSuccess(updateForm);
      } else {
        toast.error("Something went wrong, Please try again");
      }
    },
  });

  const handleSaveMessage = (key: string, message: i18nMessage) => {
    setValue(key, message);
  };

  const handleAddLanguage = (langCode: LanguageCode) => {
    if (!allowedLanguages.includes(langCode)) {
      setAllowedLanguages([...allowedLanguages, langCode]);
    }
  };

  const handleRemoveLanguage = (langCode: LanguageCode) => {
    if (allowedLanguages.includes(langCode)) {
      const index = allowedLanguages.indexOf(langCode);
      const newAllowedLanguages = [
        ...allowedLanguages.slice(0, index),
        ...allowedLanguages.slice(index + 1),
      ];
      setAllowedLanguages(newAllowedLanguages);
    }
  };

  return (
    <Box className="w-full">
      <Stack spacing={2} mt={2}>
        <LanguagesSelector
          initialLanguages={allowedLanguages}
          onAddLanguage={handleAddLanguage}
          onRemoveLanguage={handleRemoveLanguage}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Form Name"
              error={!!errors.name}
              helperText={errors.name?.message || ""}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <CreateI18nMessage
              {...field}
              fieldKey="description"
              fieldName="Description"
              initialMessage={{
                lang: voiceForm?.description?.lang || { en: "" },
              }}
              allowedLanguages={allowedLanguages}
              onSave={handleSaveMessage}
              control={control} // Pass control to CreateI18nMessage
            />
          )}
        />

        <Controller
          name="startButtonText"
          control={control}
          render={({ field }) => (
            <CreateI18nMessage
              {...field}
              fieldKey="startButtonText"
              fieldName="Start Button Text"
              initialMessage={{
                lang: voiceForm?.startButtonText?.lang || { en: "" },
              }}
              allowedLanguages={allowedLanguages}
              onSave={handleSaveMessage}
              control={control} // Pass control to CreateI18nMessage
            />
          )}
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
