import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
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
import Loading from "~/components/Layouts/loading";
import humanizeString from "humanize-string";

const FormEdit: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const [status, setStatus] = useState("");
  const [voiceForm, setVoiceForm] = useState<Form>();
  const [customError, setCustomError] = useState({});

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      id: "",
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
      const formData = getValues();
      await formMutation.mutateAsync({ ...formData, id: formId });
    } catch (error) {
      console.error(error);
    }
  };

  const loadForm = (form: Form) => {
    setVoiceForm(form);

    setValue("id", form.id);
    setValue("name", form.name);
    setValue("description", form.description);
    setValue("startButtonText", form.startButtonText);
    setValue("languages", form.languages);
    setValue("messages", form.messages);
  };

  const { data: form, isLoading: isFormLoading } = api.forms.getForm.useQuery(
    { id: formId },
    {
      enabled: !!formId,
      onSuccess(form: Form) {
        loadForm(form);
      },
    },
  );

  const handleVoiceFormCreationSuccess = (createdForm) => {
    setStatus("success");
  };

  const formMutation = api.forms.updateForm.useMutation({
    onError: (error) => {
      debugger;
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (updateForm) => {
      if (updateForm !== null) {
        setCustomError({});
        loadForm(updateForm);
        toast.success("Form updated successfully");
        setStatus("success");
      } else {
        toast.error("Something went wrong, Please try again");
      }
      return true;
    },
  });

  const handleSaveMessage = (key: string, message: i18nMessage) => {
    setValue(key, message);
    // setVoiceForm((prevForm) => ({
    //   ...prevForm,
    //   [key]: message,
    // }));
  };

  const handleAddLanguage = (langCode: LanguageCode) => {
    const allowedLanguages = voiceForm.languages;

    if (!allowedLanguages.includes(langCode)) {
      const updatedLanguages = [...allowedLanguages, langCode];
      setValue("languages", updatedLanguages);
      setVoiceForm({ ...voiceForm, ...{ languages: updatedLanguages } });
    }
  };

  const handleRemoveLanguage = (langCode: LanguageCode) => {
    const allowedLanguages = voiceForm.languages;

    if (allowedLanguages.includes(langCode)) {
      const index = allowedLanguages.indexOf(langCode);
      const newAllowedLanguages = [
        ...allowedLanguages.slice(0, index),
        ...allowedLanguages.slice(index + 1),
      ];
      setValue("languages", newAllowedLanguages);
      setVoiceForm({ ...voiceForm, ...{ languages: newAllowedLanguages } });
    }
  };

  return (
    <Box className="w-full">
      {isFormLoading && <Loading />}
      {voiceForm && (
        <Stack spacing={2} mt={2} mb={2}>
          <Typography variant="h4" component="h4">
            {humanizeString(voiceForm?.name)}
          </Typography>
          {/* <Controller
            name="name"
            control={control}
            defaultValue={voiceForm?.name} // Set defaultValue for each field
            render={({ field }) => (
              <TextField
                {...field}
                label="Form Name"
                error={!!errors.name}
                helperText={errors.name?.message || ""}
              />
            )}
          /> */}

          <LanguagesSelector
            initialLanguages={voiceForm?.languages}
            onAddLanguage={handleAddLanguage}
            onRemoveLanguage={handleRemoveLanguage}
          />

          <CreateI18nMessage
            // {...field}
            fieldKey="description"
            fieldName="Description"
            initialMessage={voiceForm?.description}
            allowedLanguages={voiceForm?.languages}
            onSave={handleSaveMessage}
            // control={control} // Pass control to CreateI18nMessage
          />

          <CreateI18nMessage
            // {...field}
            fieldKey="startButtonText"
            fieldName="Start Button Text"
            initialMessage={voiceForm?.startButtonText}
            // initialMessage={{
            //   lang: voiceForm?.startButtonText?.lang || { en: "" },
            // }}
            allowedLanguages={voiceForm?.languages}
            onSave={handleSaveMessage}
            // control={control} // Pass control to CreateI18nMessage
          />
        </Stack>
      )}

      <Button
        size="medium"
        variant="outlined"
        onClick={handleSubmit(onFormSubmit)}
        disabled={formMutation.isLoading}
      >
        {formMutation.isLoading ? "Saving..." : "Save"}
      </Button>
      {/* <>{formMutation.isLoading ? "loading" : "not loading"}</> */}
    </Box>
  );
};

FormEdit.getLayout = getLayout;

export default FormEdit;
