import React, { useState } from "react";
import { Box, styled, Paper, Tabs, Tab, Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import {
  GetVersionInput,
  GetVersionsInput,
  VersionOutput as pv,
} from "~/validators/prompt_version";
import { CreateVersion } from "./create_version";
const Item = styled(Paper)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const PromptTemplate = ({
  ns,
  pp,
  pt,
  onTemplateUpdate,
}: {
  ns: any;
  pp: pp;
  pt: pt;
  onTemplateUpdate: Function;
}) => {
  const { data: pvs, refetch: refectVersions } =
    api.prompt.getVersions.useQuery(
      {
        promptPackageId: pt?.promptPackageId,
        promptTemplateId: pt?.id,
      } as GetVersionsInput,
      {
        onSuccess: (rpvs) => {
          console.log("refetched pvs versions");
        },
      },
    );

  // console.log(`pvs <<<<>>>> ${JSON.stringify(pvs)}`);

  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (event: any, newValue: number) => {
    const currentTab = newValue ?? activeTab;
    setActiveTab(currentTab);
  };

  const handleVersionCreate = (pv: any) => {
    refectVersions().then((res) => {
      setActiveTab(0);
    });
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {/* <Chip label={pvs?.length || 'NA'} color={'primary'} variant="outlined" />  */}
        {pt && (
          <Grid id="pts-container" container spacing={2}>
            <Tabs
              value={activeTab}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="Code Editor Tabs"
            >
              {pvs &&
                pvs.length > 0 &&
                pvs.map((pv, index) => (
                  <Tab
                    key={index}
                    label={pv.version}
                    // onDelete={() => removeFile(index)}
                    aria-label={`Version ${pv.version}`}
                  />
                ))}
              <Box sx={{ flexGrow: 1, p: 2 }}>
                <CreateVersion
                  pp={pp}
                  pt={pt}
                  onCreate={handleVersionCreate}
                ></CreateVersion>
              </Box>
              {/* <Tab
                iconPosition="start"
                key={-1}
                icon={
                  <CreateVersion
                    pp={pp}
                    pt={pt}
                    onCreate={handleVersionCreate}
                  ></CreateVersion>
                }
              /> */}
            </Tabs>
            {pvs &&
              pvs.length > 0 &&
              pvs.map((pv, index) => (
                <Item key={index} hidden={index !== activeTab}>
                  <PromptVersion
                    key={pv.id}
                    ns={ns}
                    pp={pp}
                    pt={pt}
                    pv={pv}
                    handleVersionCreate={handleVersionCreate}
                    onTemplateUpdate={onTemplateUpdate}
                  />
                </Item>
              ))}
            <Box p={2}></Box>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default PromptTemplate;
