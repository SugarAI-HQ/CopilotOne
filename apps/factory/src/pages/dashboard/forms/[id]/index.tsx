import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { TabPanel } from "~/components/Layouts/tabs";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";

import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { KeyOutput } from "~/validators/api_key";
import SubmissionAnalytics from "../../../../components/voice_forms/submissions/analytics";
import SubmissionsDashboard from "../../../../components/voice_forms/submissions/list";

const FormShow: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const { data: form } = api.form.getForm.useQuery({ id: formId });

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
  const [value, setValue] = useState(0);
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
        centered={true}
        onChange={handleChange}
        variant="scrollable" // This makes the tabs scrollable
        scrollButtons="auto" // This makes scroll buttons appear when there are more tabs than can fit
        TabIndicatorProps={{
          style: { background: "var(--sugarhub-text-color)" },
        }}
      >
        <Tab label="Info" sx={{ color: "var(--sugarhub-text-color)" }} />
        <Tab label="Submissions" sx={{ color: "var(--sugarhub-text-color)" }} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <SubmissionAnalytics formId={formId}> </SubmissionAnalytics>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <SubmissionsDashboard formId={formId}></SubmissionsDashboard>
      </TabPanel>
    </div>
  );
}
