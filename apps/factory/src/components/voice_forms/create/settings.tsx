import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  TextField,
  Typography,
  Stack,
  Button,
  List,
  ListItem,
} from "@mui/material";
import humanizeString from "humanize-string";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFormInput, Form, I18nMessageWithRules } from "~/validators/form";
import { api } from "~/utils/api";
import CreateI18nMessage from "../create_i18n_message";
import {
  defaultFormTranslations,
  geti18nMessage,
  LanguageCode,
  VoiceForm,
} from "@sugar-ai/core";
import LanguagesSelector from "../langauges_selector";
import { FormErrors } from "./errors";
import Loading from "~/components/Layouts/loading";

export const FormDetails = ({
  voiceForm,
  setVoiceForm,
}: {
  voiceForm: any;
  setVoiceForm: Function;
}) => {
  const [availableLanguages, setAvailableLanguages] = useState<LanguageCode[]>(
    voiceForm?.languages || ["en"],
  );
  console.log(`availableLanguages: ${JSON.stringify(availableLanguages)}`);
  const [status, setStatus] = useState("");
  const [customError, setCustomError] = useState({});

  const defaulti18nMessage = { lang: { en: "" } };

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
      description: defaulti18nMessage,
      startButtonText: defaulti18nMessage,
      messages: {
        welcome: defaulti18nMessage,
        submit: defaulti18nMessage,
      },
      languages: voiceForm?.languages || ["en"],
      formConfig: {},
    },
    resolver: zodResolver(createFormInput),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (status === "success") {
      // handleClose();
    }
  }, [status]);

  useEffect(() => {
    if (voiceForm) {
      loadForm(voiceForm);
    }
  }, [voiceForm]);

  const handleSaveMessage = (key: any, message: I18nMessageWithRules) => {
    setValue(key, message);
  };

  const onFormSubmit = async (data: any) => {
    try {
      const formData = { ...getValues(), id: voiceForm?.id };
      await formMutation.mutateAsync(formData);
    } catch (error) {
      console.error(error);
    }
  };
  const formMutation = api.form.updateForm.useMutation({
    onSuccess: (updatedForm: any) => {
      debugger;
      setVoiceForm({
        ...updatedForm,
        questions: voiceForm?.questions,
      });
      toast.success("Form Settings saved successfully");
      setStatus("success");
    },
    onError: (error: any) => {
      setCustomError(error?.response?.errors);
      toast.error("Error saving form");
    },
  });

  const loadForm = (form: Form) => {
    setVoiceForm(form);
    setValue("id", form.id);
    setValue("name", form.name);
    setValue("description", form.description);
    setValue("startButtonText", form.startButtonText);
    setValue("languages", form.languages);
    setValue("messages", form.messages);
    setValue("formConfig", form.formConfig || {});
  };

  const handleAddLanguage = (langCode: LanguageCode) => {
    const allowedLanguages = voiceForm.languages;

    if (!allowedLanguages.includes(langCode)) {
      const updatedLanguages = [...allowedLanguages, langCode];
      setValue("languages", updatedLanguages);
      // setAvailableLanguages({
      //   ...voiceForm,
      //   ...{ languages: updatedLanguages },
      // });
      setAvailableLanguages(updatedLanguages);
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
      setAvailableLanguages(newAllowedLanguages);
    }
  };

  return (
    <>
      {!voiceForm && <Loading></Loading>}
      {voiceForm && (
        <Stack spacing={2} mt={2} mb={2}>
          <LanguagesSelector
            initialLanguages={availableLanguages}
            onAddLanguage={handleAddLanguage}
            onRemoveLanguage={handleRemoveLanguage}
          />

          <FormErrors errors={errors} />
          {/* <form onSubmit={handleSubmit(onFormSubmit)}> */}
          <Controller
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
          />

          <CreateI18nMessage
            fieldKey="description"
            fieldName="Description"
            defaults={geti18nMessage("description", defaultFormTranslations)}
            initialMessage={voiceForm?.description}
            allowedLanguages={availableLanguages}
            onSave={handleSaveMessage}
          />
          <CreateI18nMessage
            fieldKey="startButtonText"
            fieldName="Start Button Text"
            initialMessage={voiceForm?.startButtonText}
            defaults={geti18nMessage(
              "startButtonText",
              defaultFormTranslations,
            )}
            allowedLanguages={availableLanguages}
            onSave={handleSaveMessage}
          />

          <CreateI18nMessage
            fieldKey="messages.welcome"
            fieldName="Welcome Message"
            initialMessage={voiceForm?.messages?.welcome}
            defaults={geti18nMessage("welcome", defaultFormTranslations)}
            allowedLanguages={availableLanguages}
            onSave={handleSaveMessage}
          />

          <CreateI18nMessage
            fieldKey="messages.submit"
            fieldName="On Submit Message"
            initialMessage={voiceForm?.messages?.submit}
            defaults={geti18nMessage("submit", defaultFormTranslations)}
            allowedLanguages={availableLanguages}
            onSave={handleSaveMessage}
          />

          <Stack direction="row" spacing={2} mt={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit(onFormSubmit)}
              disabled={status === "loading"}
            >
              {formMutation.isLoading ? "Saving..." : "Save"}
            </Button>
          </Stack>
          {/* </form> */}
        </Stack>
      )}
    </>
  );
};
