import { useRouter } from "next/router";
import { api } from "~/utils/api";
import React from "react";
import SubmissionAnswers from "~/components/voice_forms/submissions/answers";
import { getLayout } from "~/app/layout";
import Loading from "~/components/Layouts/loading";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";

const ShowSubmission = () => {
  const router = useRouter();
  const submissionId = router.query.submissionId as string;
  const formId = router.query.id as string;

  const {
    data: submission,
    isLoading,
    refetch: refetchSubmission,
  } = api.form.getSubmission.useQuery(
    { formId, submissionId },
    { enabled: !!formId },
  );

  const {
    data: form,
    isLoading: isFormLoading,
    refetch: refetchForm,
  } = api.form.getForm.useQuery(
    { formId: formId },
    {
      enabled: !!formId,
    },
  );

  const handleRefetch = () => {
    refetchSubmission();
    refetchForm();
  };

  return (
    <div className="w-full pt-3">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Submission</h1>
        <IconButton color="primary" onClick={handleRefetch}>
          <RefreshIcon />
        </IconButton>
      </div>

      {(isLoading || isFormLoading) && <Loading />}
      {!(isLoading || isFormLoading) && (
        <SubmissionAnswers voiceForm={form} submission={submission} />
      )}
    </div>
  );
};

ShowSubmission.getLayout = getLayout;

export default ShowSubmission;
