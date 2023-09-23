import React, { useState } from "react";
import { Box, styled, Paper, Tabs, Tab, Typography, Chip } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import {
  PromptPackage as pp,
  PromptTemplate as pt,
  PromptVersion as pv,
} from "@prisma/client";
import { CreateVersion } from "./create_version";
import PromptVersionEditor from "./prompt_editor";
const Item = styled(Paper)(({ theme }) => ({
  width: "100%",
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const PromptTemplate = ({ pp, pt }: { pp: pp; pt: pt }) => {
  const { data: pvs, refetch: refectVersions } = api.prompt.getVersions.useQuery({
    promptPackageId: pt?.promptPackageId,
    promptTemplateId: pt?.id,
  });
  // const { pvs, versionQuery} = api.prompt.getVersions.useSuspenseQuery({
  //   promptPackageId: pt?.promptPackageId,
  //   promptTemplateId: pt?.id,
  // });

  console.log(`pvs <<<<>>>> ${JSON.stringify(pvs)}`);

  const [activeTab, setActiveTab] = useState(0);
  // const [pvs, setPvs] = useState<pv[]>(pvs || [])

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleVersionCreate = (pv: any) => {
    // pvs?.push(pv);
    refectVersions();
    // setPvs([pv, ...pvs]);
    // setActiveTab(0);
  };

  const handleTemplateUpdate = (pv: any) => {
    // pvs?.push(pv);
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
              <Tab
                iconPosition="start"
                key={-1}
                icon={
                  <CreateVersion
                    pp={pp as pp}
                    pt={pt as pt}
                    onCreate={handleVersionCreate}
                  ></CreateVersion>
                }
              />
            </Tabs>
            {pvs &&
              pvs.length > 0 &&
              pvs.map((pv, index) => (
                // <div key={index} hidden={index !== activeTab}>
                <Item key={index} p={2} hidden={index !== activeTab}>
                  {pv && (
                    <PromptVersion
                      pp={pp}
                      pt={pt}
                      pv={pv}
                      handleVersionCreate={handleVersionCreate}
                      onTemplateUpdate={handleTemplateUpdate}
                    />
                  )}
                </Item>
                // </div>
              ))}
            <Box p={2}></Box>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default PromptTemplate;
