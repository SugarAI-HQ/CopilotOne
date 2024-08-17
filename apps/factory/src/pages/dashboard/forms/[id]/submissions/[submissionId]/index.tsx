import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import React from "react";
import SubmissionAnswers from "../../../../../../components/voice_forms/submissions/answers";
import { getLayout } from "~/app/layout";

const ShowSubmission = () => {
  const router = useRouter();
  const submissionId = router.query.submissionId as string;
  const formId = router.query.id as string;

  const { data: submission, isLoading } = api.form.getSubmission.useQuery(
    { formId, submissionId },
    { enabled: !!formId },
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full pt-3">
      <SubmissionAnswers submission={submission}></SubmissionAnswers>
    </div>
  );
};

ShowSubmission.getLayout = getLayout;

export default ShowSubmission;
