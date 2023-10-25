import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  CardContent,
  Collapse,
  CardActions,
  IconButton,
  Card,
  Avatar,
  CardHeader,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import { api } from "~/utils/api";
import PromptVariables from "~/components/prompt_variables";
import { packageVisibility } from "~/validators/base";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ExpandMore } from "@mui/icons-material";
import React from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { PackagePublicOutput as ppt } from "~/validators/marketplace";
import { TemplateOutput as ptt } from "~/validators/prompt_template";
// import { CreateVersionInput, VersionOutput as pv } from "~/validators/prompt_version";
import { getRandomValue } from "~/utils/math";
import { PromptIntegration } from "~/components/integration/prompt_integration";
import PromptHeader from "~/components/marketplace/prompt_header";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const MarketplacePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { data: pp, refetch: rpp } = api.marketplace.getPackage.useQuery({
    id: id,
    visibility: packageVisibility.Enum.PUBLIC,
  });

  const [loading, setLoading] = useState(false);

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const subheader = () => {
    return `Public • Published 1 days ago • ${pp?.User?.username}`;
  };

  return (
    <Container>
      <Header></Header>
      <PromptHeader pp={pp as ppt}></PromptHeader>
      <MyTabs pp={pp as ppt}></MyTabs>
    </Container>
  );
};

export default MarketplacePage;

function Row({ pt }: { pt: ptt }) {
  // const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {pt?.name}
        </TableCell>
        <TableCell align="right">
          {pt?.releaseVersion?.version || "NA"}
        </TableCell>
        <TableCell align="right">
          {pt?.previewVersion?.version || "NA"}
        </TableCell>
        <TableCell align="right">{pt?.releaseVersion?.llmProvider}</TableCell>
        <TableCell align="right">{pt?.releaseVersion?.llmModel}</TableCell>
        <TableCell align="right">{getRandomValue(1000, 5000)}</TableCell>
        <TableCell align="right">{getRandomValue(2000, 4000)}</TableCell>
        <TableCell align="right">{getRandomValue(70, 98)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Templates
              </Typography>

              {pt?.releaseVersion && (
                <Typography component="p" gutterBottom>
                  Release ({pt?.releaseVersion?.version}):{" "}
                  {pt?.releaseVersion?.template}
                </Typography>
              )}

              {pt?.previewVersion && (
                <Typography component="p" gutterBottom>
                  Preview ({pt?.previewVersion?.version}):{" "}
                  {pt?.previewVersion?.template}
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
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Template</TableCell>
            <TableCell align="right">Release</TableCell>
            <TableCell align="right">Preview</TableCell>
            <TableCell align="right">LLM Provider</TableCell>
            <TableCell align="right">LLM Model</TableCell>
            <TableCell align="right">Latency(p95) &nbsp;(ms)</TableCell>
            <TableCell align="right">Token (p95) &nbsp;(count)</TableCell>
            <TableCell align="right">Accuracy &nbsp;(%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pp?.templates &&
            pp?.templates.length > 0 &&
            pp.templates.map(
              (pt, index) =>
                (pt.releaseVersion || pt.previewVersion) && (
                  <Row key={index} pt={pt} />
                ),
            )}
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
    <div>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable" // This makes the tabs scrollable
        scrollButtons="auto" // This makes scroll buttons appear when there are more tabs than can fit
        aria-label="Scrollable tabs example"
      >
        <Tab label="Prompt Package" />
        <Tab label="Integration" />
        {/* Add more tabs as needed */}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Paper>
          <Card>
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
        <Paper>
          <PromptIntegration ns={pp?.User} pp={pp}></PromptIntegration>
        </Paper>
      </TabPanel>
    </div>
  );
}
