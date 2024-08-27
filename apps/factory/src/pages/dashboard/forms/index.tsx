import React, { useState } from "react";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Typography, Grid, Chip, CardActionArea, Button } from "@mui/material";
import { CreateVoiceForm } from "~/components/voice_forms/create_voice_form";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ViewI18nMessage from "~/components/voice_forms/view_i18n_message";
import { LanguageCode, i18nMessage } from "@sugar-ai/core";
import { I18nMessageWithRules, Form } from "~/validators/form";
import Loading from "~/components/Layouts/loading";

const VoiceFormHome = () => {
  const [status, setStatus] = useState("");
  const [customError, setCustomError] = useState({});
  const [voiceForms, setVoiceForms] = useState<Form[]>([]);
  const router = useRouter();
  const { data: sessionData } = useSession();
  const ns = sessionData?.user;

  const initialLanguages: LanguageCode[] = ["en", "es", "fr", "hi"];
  const [languages, setLanguages] = useState<LanguageCode[]>(initialLanguages);

  const handleVoiceFormCreationSuccess = (createdForm: Form) => {
    setStatus("success");
    toast.success("Form created successfully");
    router.push("/dashboard/forms/" + createdForm?.id + "/edit");
  };

  const formMutation = api.form.createForm.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (createdForm: Form) => {
      if (createdForm !== null) {
        setCustomError({});
        handleVoiceFormCreationSuccess(createdForm);
      } else {
        toast.error("Something went wrong, Please try again");
      }
    },
  });

  const questionMutation = api.form.createQuestion.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: () => {
      toast.success("Question created successfully");
    },
  });

  const { data: f, isLoading } = api.form.getForms.useQuery(
    {},
    {
      onSuccess(data) {
        setVoiceForms([...data]);
      },
    },
  );

  // const initialMessage: I18nMessageWithRules = {
  //   // mode: "manual",
  //   lang: {
  //     en: "Hello",
  //     es: "Hola",
  //     fr: "Bonjour",
  //     hi: "नमस्ते",
  //   },
  //   // voice: false,
  //   // output: "none",
  // };

  // const [message, setMessage] = useState<i18nMessage>(initialMessage);

  const handleSave = (newMessage: i18nMessage) => {
    // setMessage(newMessage);
  };

  return (
    <>
      {voiceForms && voiceForms.length > 0 ? (
        <>
          <CreateVoiceForm
            onSubmit={formMutation.mutate}
            isLoading={formMutation.isLoading}
            status={status}
            customError={customError}
          />
          <VoiceForms
            voiceForms={voiceForms}
            setVoiceForms={setVoiceForms}
            languages={languages}
          />
        </>
      ) : (
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          style={{ minHeight: "80vh" }}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <Grid item xs={12} justifyContent="center" alignItems="center">
              <Typography align="center" variant="h5" padding={3}>
                Create your first Voice Form
              </Typography>
              <CreateVoiceForm
                onSubmit={formMutation.mutate}
                isLoading={formMutation.isLoading}
                status={status}
                customError={customError}
                position="center"
              />
            </Grid>
          )}
        </Grid>
      )}
    </>
  );
};

const VoiceForms = ({
  voiceForms,
  setVoiceForms,
  languages,
}: {
  voiceForms: any[];
  setVoiceForms: React.Dispatch<React.SetStateAction<any[]>>;
  languages: LanguageCode[];
}) => {
  return (
    <Grid container spacing={1} paddingTop={2}>
      {voiceForms.map((form, index) => (
        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
          <Card title={`${form?.description}`}>
            <CardActionArea href={`/dashboard/forms/${form?.id}`}>
              <CardHeader
                title={form?.name}
                action={form?.languages.map((lang: LanguageCode) => (
                  <Chip sx={{ mr: 2 }} size="small" label={lang} />
                ))}
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
                  <ViewI18nMessage
                    message={form?.description}
                    languages={[languages[0]] as LanguageCode[]}
                  />
                  {/* {form?.description} */}
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" href={`/dashboard/forms/${form?.id}/edit`}>
                Edit
              </Button>
              <Button
                size="small"
                href={`/dashboard/forms/${form?.id}?tab=submissions`}
              >
                Submissions
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

VoiceFormHome.getLayout = getLayout;
export default VoiceFormHome;
