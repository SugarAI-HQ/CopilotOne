import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Link, Button } from "@mui/material";
import { useRouter } from "next/router";
import { TabPanel } from "~/components/Layouts/tabs";
import QuestionList from "~/components/voice_forms/questions/list";
import { FormDetails } from "./settings";
import {
  FormPreviewButton,
  FormSubmissionsButton,
} from "~/components/voice_forms/buttons";

export const VoiceEditTabs = ({
  voiceForm,
  setVoiceForm, // handleAddOrEditQuestion, // handleEdit,
} // handleDelete,
: {
  voiceForm: any;
  setVoiceForm: Function;
  // handleAddOrEditQuestion: any;
  // handleEdit: any;
  // handleDelete: any;
}) => {
  const tabs = ["questions", "settings", "analytics"];
  const router = useRouter();
  const defaultTab = (router.query.tab as string) ?? tabs[0];
  const initTab = defaultTab ? tabs.indexOf(defaultTab) : 0;
  const [tab, setTab] = useState(initTab);

  const handleChange = (event: any, newValue: number) => {
    setTab(newValue);
  };

  return (
    <div className="w-full">
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

      <Tabs
        value={tab}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Questions" />
        <Tab label="Settings" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <Box className="w-full">
          {voiceForm && (
            <QuestionList
              voiceForm={voiceForm}
              languages={voiceForm?.languages || ["en"]}
              // onDelete={handleDelete}
              // onEdit={handleEdit}
            />
          )}
        </Box>
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <FormDetails voiceForm={voiceForm} setVoiceForm={setVoiceForm} />
      </TabPanel>
    </div>
  );
};
