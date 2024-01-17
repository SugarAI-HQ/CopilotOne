import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  CardContent,
  Collapse,
  IconButton,
  Card,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@mui/material";
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import { api } from "~/utils/api";
import { packageVisibility, providerModels } from "~/validators/base";
import React from "react";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { PackagePublicOutput as ppt } from "~/validators/marketplace";
import { TemplateOutput as ptt } from "~/validators/prompt_template";
import {
  PromptDataSchemaType,
  VersionOutput as pvt,
} from "~/validators/prompt_version";
// import { CreateVersionInput, VersionOutput as pv } from "~/validators/prompt_version";
import { getRandomValue } from "~/utils/math";
import { PromptIntegration } from "~/components/integration/prompt_integration";
import PromptHeader from "~/components/marketplace/prompt_header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PublicUrl from "~/components/integration/public_url";
import { PromptView } from "~/components/prompt_view_arrow";
const MarketplacePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: pp, refetch: rpp } = api.marketplace.getPackage.useQuery({
    id: id,
    visibility: packageVisibility.Enum.PUBLIC,
  });

  const [loading, setLoading] = useState(false);

  const subheader = () => {
    return `Public • Published 1 days ago • ${pp?.User?.username}`;
  };

  return (
    <Box
      sx={{
        backgroundColor: "var(--sugarhub-main-color)",
        width: "100vw",
        height: "100vh",
        overflowY: "scroll",
      }}
    >
      <Container>
        <Header headerName="Sugar Hub"></Header>
        <Box
          sx={{
            backgroundColor: "var(--sugarhub-card-color)",
            padding: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          <PromptHeader pp={pp as ppt}></PromptHeader>
          <MyTabs pp={pp as ppt}></MyTabs>
        </Box>
      </Container>
    </Box>
  );
};

export default MarketplacePage;

function VersionRow({
  pt,
  pp,
  pv,
  pvType,
}: {
  pt: ptt;
  pp: ppt;
  pv: pvt;
  pvType: string;
}) {
  // const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [prompt, setPrompt] = useState<PromptDataSchemaType>(
    pv?.promptData as PromptDataSchemaType,
  );
  const haveroleUserAssistant = providerModels[
    `${pt?.modelType as keyof typeof providerModels}`
  ]?.models[`${pv?.llmProvider}`]?.find((mod) => mod.name === pv?.llmModel)
    ?.role;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: "var(--sugarhub-text-color)" }}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ color: "var(--sugarhub-text-color)" }}
        >
          {pt?.name}
        </TableCell>

        <TableCell align="right" sx={{ color: "var(--sugarhub-text-color)" }}>
          {pvType} - {pv?.version || "NA"}
        </TableCell>
        <TableCell align="right" sx={{ color: "var(--sugarhub-text-color)" }}>
          {pv ? `${pv?.llmProvider} / ${pv?.llmModel}` : ""}
        </TableCell>

        <TableCell align="right" sx={{ color: "var(--sugarhub-text-color)" }}>
          60
        </TableCell>
        <TableCell align="right" sx={{ color: "var(--sugarhub-text-color)" }}>
          50
        </TableCell>
        <TableCell align="right" sx={{ color: "var(--sugarhub-text-color)" }}>
          90
        </TableCell>
        <TableCell align="right" sx={{ color: "var(--sugarhub-text-color)" }}>
          <PublicUrl
            title={`${pvType} URL`}
            url={`/${pp?.User
              ?.username}/${pp?.name}/${pt?.name}/${pvType.toLocaleLowerCase()}`}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{ color: "var(--sugarhub-text-color)" }}
              ></Typography>

              {pv && (
                <Typography
                  component="p"
                  gutterBottom
                  sx={{ color: "var(--sugarhub-text-color)" }}
                >
                  <Typography variant="h6" sx={{ marginBottom: "1rem" }}>
                    Template :
                  </Typography>
                  <PromptView
                    promptInputs={prompt.data}
                    haveroleUserAssistant={haveroleUserAssistant}
                    promptTemplate={pv.template}
                  />
                </Typography>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function CollapsibleTable({ pp }: { pp: ppt }) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "var(--sugarhub-table-color)",
        borderRadius: "0.5rem",
      }}
    >
      <Table
        aria-label="collapsible table"
        sx={{
          backgroundColor: "var(--sugarhub-table-color)",
          borderRadius: "0.5rem",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell sx={{ color: "var(--sugarhub-text-color)" }}>
              Template
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "var(--sugarhub-text-color)" }}
            >
              Release/Preview
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "var(--sugarhub-text-color)" }}
            >
              LLM Provider / Model
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "var(--sugarhub-text-color)" }}
            >
              Latency(p95) &nbsp;(ms)
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "var(--sugarhub-text-color)" }}
            >
              Token (p95) &nbsp;(count)
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "var(--sugarhub-text-color)" }}
            >
              Accuracy &nbsp;(%)
            </TableCell>
            <TableCell
              align="right"
              sx={{ color: "var(--sugarhub-text-color)" }}
            >
              Try
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pp?.templates &&
            pp?.templates.length > 0 &&
            pp.templates.map((pt, index) => (
              <>
                {pt.releaseVersion && (
                  <VersionRow
                    key={index}
                    pt={pt}
                    pp={pp}
                    pv={pt.releaseVersion as pvt}
                    pvType="Release"
                  />
                )}
                {pt.previewVersion && (
                  <VersionRow
                    key={index}
                    pt={pt}
                    pp={pp}
                    pv={pt.previewVersion as pvt}
                    pvType="Preview"
                  />
                )}
              </>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

function MyTabs({ pp }: { pp: ppt }) {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div
      style={{
        backgroundColor: "var(--sugarhub-ternary-bg-color)",
        padding: "1rem",
        borderRadius: "0.5rem",
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable" // This makes the tabs scrollable
        scrollButtons="auto" // This makes scroll buttons appear when there are more tabs than can fit
        aria-label="Scrollable tabs example"
        TabIndicatorProps={{
          style: { background: "var(--sugarhub-text-color)" },
        }}
        sx={{
          ".Mui-selected": {
            color: "var(--sugarhub-text-color)",
          },
        }}
      >
        <Tab
          label="Prompt Package"
          sx={{ color: "var(--sugarhub-text-color)" }}
        />
        <Tab label="Integration" sx={{ color: "var(--sugarhub-text-color)" }} />
        {/* Add more tabs as needed */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Paper
          sx={{
            backgroundColor: "var(--sugarhub-tab-color)",
            borderRadius: "0.5rem",
          }}
        >
          <Card
            sx={{
              backgroundColor: "var(--sugarhub-tab-color)",
              borderRadius: "0.5rem",
              color: "var(--sugarhub-text-color)",
            }}
          >
            <CardContent>
              <Typography paragraph variant="body1">
                {pp?.description}
              </Typography>

              <Typography paragraph variant="body1">
                templates • {pp?.templates?.length}
              </Typography>

              <CollapsibleTable pp={pp} />
            </CardContent>
          </Card>
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Paper sx={{ backgroundColor: "var(--sugarhub-tab-color)" }}>
          <PromptIntegration ns={pp?.User} pp={pp}></PromptIntegration>
        </Paper>
      </TabPanel>
    </div>
  );
}
