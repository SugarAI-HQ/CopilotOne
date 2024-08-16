import React, { useState } from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";

import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import SubmissionsDashboard from "../../../../components/voice_forms/submissions/list";

// import { SubmissionsDashboard } from "~/components/voice_forms/submssion_dashboard";

const SubmissionsList: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  //   const { data: form } = api.form.getForm.useQuery({ id: formId });

  return (
    <>
      <SubmissionsDashboard formId={formId}></SubmissionsDashboard>
      <Box className="w-full"></Box>
    </>
  );
};

SubmissionsList.getLayout = getLayout;

export default SubmissionsList;
