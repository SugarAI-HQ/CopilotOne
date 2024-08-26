import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "~/components/Layouts/tabs";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";

import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import SubmissionAnalytics from "../../../../components/voice_forms/submissions/analytics";
import SubmissionsDashboard from "../../../../components/voice_forms/submissions/list";

const FormShow: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const { data: form } = api.form.getForm.useQuery({ formId: formId });

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="span" sx={{ mt: 1, mb: 2 }}>
          {form?.name}
        </Typography>
      </Box>
      <VoiceFormTabs formId={formId}></VoiceFormTabs>
    </>
  );
};

FormShow.getLayout = getLayout;

export default FormShow;

function VoiceFormTabs({ formId }: { formId: string }) {
  const tabs = ["info", "submissions", "analytics"];

  const router = useRouter();
  const tab = (router.query.tab as string) ?? tabs[0];
  const initTab = tab ? tabs.indexOf(tab) : 0;

  const [value, setValue] = useState(initTab);
  const [pvalue, setPvalue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const handlePackageChange = (event: any, newValue: number) => {
    setPvalue(newValue);
  };

  return (
    <div className="w-full">
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable" // This makes the tabs scrollable
        scrollButtons="auto" // This makes scroll buttons appear when there are more tabs than can fit
      >
        <Tab label="Info" sx={{ color: "var(--sugarhub-text-color)" }} />
        <Tab label="Submissions" sx={{ color: "var(--sugarhub-text-color)" }} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <SubmissionAnalytics formId={formId} />
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SubmissionsDashboard formId={formId}></SubmissionsDashboard>
      </TabPanel>
    </div>
  );
}
