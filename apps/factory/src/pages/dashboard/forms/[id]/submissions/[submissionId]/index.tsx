import { useRouter } from "next/router";
import { api } from "~/utils/api";
import React from "react";
import SubmissionAnswers from "../../../../../../components/voice_forms/submissions/answers";
import { getLayout } from "~/app/layout";
import Loading from "~/components/Layouts/loading";

const ShowSubmission = () => {
  const router = useRouter();
  const submissionId = router.query.submissionId as string;
  const formId = router.query.id as string;

  const { data: submission, isLoading } = api.form.getSubmission.useQuery(
    { formId, submissionId },
    { enabled: !!formId },
  );

  const { data: form, isLoading: isFormLoading } = api.form.getForm.useQuery(
    { formId: formId },
    {
      enabled: !!formId,
      onSuccess(updatedForm: any) {},
    },
  );
  if (isLoading) return;

  return (
    <div className="w-full pt-3">
      {(isLoading || isFormLoading) && <Loading />}
      {!(isLoading || isFormLoading) && (
        <SubmissionAnswers
          voiceForm={form}
          submission={submission}
        ></SubmissionAnswers>
      )}
    </div>
  );
};

ShowSubmission.getLayout = getLayout;

export default ShowSubmission;
