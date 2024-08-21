import React, { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "~/components/Layouts/tabs";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import { api } from "~/utils/api";
import { Form } from "~/validators/form";
import toast from "react-hot-toast";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFormInput,
  I18nMessageWithRules,
  i18nMessageWithRules,
} from "~/validators/form";
import CreateI18nMessage from "~/components/voice_forms/create_i18n_message";
import LanguagesSelector from "~/components/voice_forms/langauges_selector";
import { LanguageCode, Question } from "@sugar-ai/core";
import { VoiceToJson } from "@sugar-ai/copilot-one-js";
import Loading from "~/components/Layouts/loading";
import humanizeString from "humanize-string";
import QuestionList from "~/components/voice_forms/questions/list";
import QuestionNew from "~/components/voice_forms/questions/new";

const FormEdit: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const [status, setStatus] = useState("");
  const [voiceForm, setVoiceForm] = useState<Form>();
  const [customError, setCustomError] = useState({});

  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

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
    // reset();
  };

  useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status]);

  // useEffect(() => {
  //   if (customError && customError?.error) {
  //     setError("name", { type: "manual", message: customError.error?.name });
  //   } else {
  //     clearErrors("name");
  //   }
  // }, [customError, setError, clearErrors]);

  const onFormSubmit = async (data: any) => {
    try {
      const formData = { ...getValues(), id: formId };
      await formMutation.mutateAsync(formData);
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
    setQuestions(form.questions);
  };

  const { data: form, isLoading: isFormLoading } = api.form.getForm.useQuery(
    { id: formId },
    {
      enabled: !!formId,
      onSuccess(form: Form) {
        loadForm(form);
      },
    },
  );

  // const handleVoiceFormCreationSuccess = (createdForm) => {
  //   setStatus("success");
  // };

  const formMutation = api.form.updateForm.useMutation({
    onError: (error) => {
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

  const handleAddOrEditQuestion = (newQuestion: Question) => {
    setQuestions((prevQuestions) => {
      const existingQuestionIndex = prevQuestions.findIndex(
        (q) => q.id === newQuestion.id,
      );
      if (existingQuestionIndex > -1) {
        const updatedQuestions = [...prevQuestions];
        updatedQuestions[existingQuestionIndex] = newQuestion;
        return updatedQuestions;
      }
      return [...prevQuestions, newQuestion];
    });
    setEditingQuestion(null); // Reset editing state
  };

  const handleEdit = (id: string) => {
    const questionToEdit = questions.find((q) => q.id === id);
    if (questionToEdit) {
      setEditingQuestion(questionToEdit);
    }
  };

  const handleDelete = (id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  };

  const onQuestions = (json: any) => {
    console.log(json);
    const questions = json;
    setQuestions(questions);
    formQuestionsMutation.mutate({ formId, questions });
  };

  const formQuestionsMutation = api.form.upsertQuestions.useMutation({
    onError: (error) => {
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

  const handleSaveMessage = (key: any, message: I18nMessageWithRules) => {
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
    <>
      <Box className="w-full">
        {isFormLoading && <Loading />}
        {voiceForm && (
          <VoiceEditTabs
            formId={formId}
            voiceForm={voiceForm}
            questions={questions}
          ></VoiceEditTabs>
        )}

        {voiceForm && (
          <Stack spacing={2} mt={2} mb={2}>
            <Typography variant="h4" component="h4">
              {humanizeString(voiceForm?.name || "")}
            </Typography>

            <LanguagesSelector
              initialLanguages={voiceForm?.languages}
              onAddLanguage={handleAddLanguage}
              onRemoveLanguage={handleRemoveLanguage}
            />

            <VoiceToJson onJson={onQuestions}></VoiceToJson>

            {/* {errors && Object.keys(errors).length > 0 && ( */}
            {
              <div>
                <Typography variant="body1">
                  Errors: ({Object.keys(errors).length})
                </Typography>
                <List>
                  {Object.keys(errors).map((key) => (
                    <ListItem key={key}>
                      {/* @ts-ignore */}
                      <Alert severity="error">{errors[key].message}</Alert>
                    </ListItem>
                  ))}
                </List>
              </div>
            }

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
          // disabled={formMutation.isLoading}
        >
          {formMutation.isLoading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </>
  );
};

FormEdit.getLayout = getLayout;

export default FormEdit;

export const VoiceEditTabs = ({
  formId,
  voiceForm,
  questions,
  handleAddOrEditQuestion,
  handleEdit,
  handleDelete,
}: {
  formId: string;
  voiceForm: any;
  questions: any;
  handleAddOrEditQuestion: any;
  handleEdit: any;
  handleDelete: any;
}) => {
  const tabs = ["questions", "settings", "analytics"];
  const router = useRouter();
  const tab = (router.query.tab as string) ?? tabs[0];
  const initTab = tab ? tabs.indexOf(tab) : 0;
  const [value, setValue] = useState(initTab);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="w-full">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Questions" />
        <Tab label="Settings" />
        <Tab label="Analytics" />
      </Tabs>

      <TabPanel value={value} index={0}>
        <Box className="w-full">
          <QuestionList
            questions={questions}
            languages={voiceForm?.languages || ["en"]}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
          <QuestionNew onSubmit={handleAddOrEditQuestion} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Place your settings component here */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* Place your analytics component here */}
      </TabPanel>
    </div>
  );
};

export const FormErrors = ({ errors }: { errors: any }) => {
  return (
    <div>
      <Typography variant="body1">
        Errors: ({Object.keys(errors).length})
      </Typography>
      <List>
        {Object.keys(errors).map((key) => (
          <ListItem key={key}>
            <Alert severity="error">{errors[key].message}</Alert>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
