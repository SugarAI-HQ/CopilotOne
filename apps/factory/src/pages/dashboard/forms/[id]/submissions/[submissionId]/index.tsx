import { useRouter } from "next/router";
import { api } from "~/utils/api";
import React from "react";
import SubmissionAnswers from "~/components/voice_forms/submissions/answers";
import { getLayout } from "~/app/layout";
import Loading from "~/components/Layouts/loading";
import { Typography, Box } from "@mui/material";
import {
  FormPreviewButton,
  FormSubmissionsButton,
} from "~/components/voice_forms/buttons";

const ShowSubmission = () => {
  const router = useRouter();
  const submissionId = router.query.submissionId as string;
  const formId = router.query.id as string;

  const { data: voiceForm, isLoading: isLoading } = api.form.getForm.useQuery(
    { formId: formId },
    {
      enabled: !!formId,
      onSuccess(updatedForm: any) {},
    },
  );
  if (isLoading) return;

  return (
    <div className="w-full pt-3">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Typography variant="h4" component="span" sx={{ mt: 1, mb: 2 }}>
          {voiceForm?.name}
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          <FormPreviewButton voiceForm={voiceForm} />
          <FormSubmissionsButton voiceForm={voiceForm} />
        </Box>
      </Box>
      {isLoading && <Loading />}
      {!isLoading && voiceForm && (
        <SubmissionAnswers
          voiceForm={voiceForm}
          submissionId={submissionId}
        ></SubmissionAnswers>
      )}
    </div>
  );
};

ShowSubmission.getLayout = getLayout;

export default ShowSubmission;
