import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { TabPanel } from "~/components/Layouts/tabs";
import QuestionList from "~/components/voice_forms/questions/list";
import QuestionNew from "~/components/voice_forms/questions/new";
import { FormDetails } from "./settings";
import humanizeString from "humanize-string";

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
      <Box className="rounded-md p-4 shadow-md ">
        <Typography variant="h4" component="h1" className="font-bold  ">
          Voice Form: {humanizeString(voiceForm?.name || "")}
        </Typography>
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
