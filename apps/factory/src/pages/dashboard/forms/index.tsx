import React, { useState } from "react";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import { Typography, Grid, Chip, CardActionArea } from "@mui/material";
import { CreateVoiceForm } from "~/components/voice_forms/create_voice_form";
import { CreateQuestion } from "~/components/voice_forms/create_question";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Form } from "~/generated/prisma-client-zod.ts";
import CreateI18nMessage from "~/components/voice_forms/create_i18n_message";
import ViewI18nMessage from "~/components/voice_forms/view_i18n_message";
import { LanguageCode } from "@sugar-ai/core";
import { I18nMessageWithRules } from "~/validators/form";

const VoiceFormHome = () => {
  const [status, setStatus] = useState("");
  const [customError, setCustomError] = useState({});
  const [voiceForms, setVoiceForms] = useState<Form>([]);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const ns = sessionData?.user;

  const handleVoiceFormCreationSuccess = (createdForm) => {
    setStatus("success");
    toast.success("Form created successfully");
    router.push("/dashboard/forms/" + createdForm?.id + "/edit");
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

  const questionMutation = api.forms.createQuestion.createQuestion.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: () => {
      toast.success("Question created successfully");
    },
  });

  api.forms.getForms.useQuery(
    {},
    {
      onSuccess(data) {
        setVoiceForms([...data]);
      },
    },
  );

  const initialMessage: I18nMessageWithRules = {
    mode: "manual",
    lang: {
      en: "Hello",
      es: "Hola",
      fr: "Bonjour",
      hi: "नमस्ते",
    },
    voice: false,
    output: "none",
  };

  const initialLanguages: LanguageCode[] = ["en", "es", "fr", "hi"];

  const [message, setMessage] = useState<i18nMessage>(initialMessage);
  const [languages, setLanguages] = useState<LanguageCode[]>(initialLanguages);

  const handleSave = (newMessage: i18nMessage) => {
    setMessage(newMessage);
  };

  return (
    <>
      <ViewI18nMessage message={message} languages={languages} />
      <CreateI18nMessage
        initialMessage={message}
        initialLanguages={languages}
        onSave={handleSave}
      />
      {voiceForms && voiceForms.length > 0 ? (
        <>
          <CreateVoiceForm
            onSubmit={formMutation.mutate}
            isLoading={formMutation.isLoading}
            status={status}
            customError={customError}
          />
          <VoiceForms voiceForms={voiceForms} setVoiceForms={setVoiceForms} />
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "80vh" }}
        >
          <Grid item xs={12}>
            <Typography align="center" variant="h5" padding={3}>
              Create your first Voice Form
            </Typography>
            <CreateVoiceForm
              onSubmit={formMutation.mutate}
              isLoading={formMutation.isLoading}
              status={status}
              customError={customError}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

const VoiceForms = ({
  voiceForms,
  setVoiceForms,
}: {
  voiceForms: any[];
  setVoiceForms: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  return (
    <Grid container spacing={1} paddingTop={2}>
      {voiceForms.map((form, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card title={`${form?.description}`}>
            <CardActionArea href={`/dashboard/forms/${form?.id}`}>
              <CardHeader
                title={form?.name}
                action={
                  <Chip sx={{ mr: 2 }} size="small" label={form?.status} />
                }
              />

              <CardContent>
                <Typography
                  sx={{
                    height: "3em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {form?.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

VoiceFormHome.getLayout = getLayout;
export default VoiceFormHome;
