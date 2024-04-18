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
  colors,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import CodeHighlight from "~/components/integration/code_highlight";
import CopyToClipboardButton from "~/components/copy_button";

import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
import {
  useCopilot,
  CopilotConfigType,
  CopilotProvider,
  VoiceToSkillComponent,
  ChatContainer,
} from "@sugar-ai/copilot-one-js";
import {
  CopilotOutput,
  CopilotPromptListOutput,
  CopilotPromptOutput,
} from "~/validators/copilot";
import { KeyOutput } from "~/validators/api_key";
import { clonePrompt } from "..";

const CopilotShow: NextPageWithLayout = () => {
  const router = useRouter();
  const copilotId = router.query.id as string;
  const { data: copilot } = api.copilot.getCopilot.useQuery({ id: copilotId });

  const { data: copilotPrompt } = api.copilot.getCopilotPrompt.useQuery({
    copilotId: copilotId,
  });

  const { data: copilotKey } = api.apiKey.getCopilotKey.useQuery({
    copilotId: copilot?.id as string,
  });

  const { data: copilotPrompts, refetch: refetchPrompts } =
    api.copilot.getCopilotPrompts.useQuery({
      copilotId: copilotId,
    });

  const clonePromptMutation = api.copilot.clonePackage.useMutation();

  const copilotConfig: CopilotConfigType = getCopilotConfig(
    copilot as CopilotOutput,
    copilotKey as KeyOutput,
    copilotPrompt as CopilotPromptOutput,
  );

  const promptTemplate: string = `${copilotPrompt?.userName}/${copilotPrompt?.packageName}/${copilotPrompt?.templateName}/${copilotPrompt?.versionName}`;

  return (
    <>
      {
        <CopilotProvider config={copilotConfig}>
          <VoiceToSkillComponent
            promptTemplate={promptTemplate}
            id={"preview"}
            position={"bottom-right"}
            promptVariables={{ $ROLE: "Boss" }}
            messageStyle={{ color: "black" }}
          />
        </CopilotProvider>
      }

      <Box className="w-full">
        <CopilotTabs
          copilotId={copilotId}
          copilot={copilot as CopilotOutput}
          copilotPrompt={copilotPrompt as CopilotPromptOutput}
          copilotPrompts={copilotPrompts as CopilotPromptListOutput}
          copilotKey={copilotKey as KeyOutput}
          clonePromptMutation={clonePromptMutation}
          refetchPrompts={refetchPrompts}
        ></CopilotTabs>
      </Box>
    </>
  );
};

const CodeBlock: React.FC<{
  title: string;
  code: string;
  isCopy?: boolean;
}> = ({ title, code, isCopy = true }) => {
  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <CodeHighlight code={code} language="javascript" isCopy={isCopy} />
    </Box>
  );
};

CopilotShow.getLayout = getLayout;

export default CopilotShow;

function CopilotTabs({
  copilotId,
  copilotPrompts,
  copilot,
  copilotKey,
  copilotPrompt,
  clonePromptMutation,
  refetchPrompts,
}: {
  copilotId: string;
  copilotPrompts: CopilotPromptListOutput;
  copilot: CopilotOutput;
  copilotKey: KeyOutput;
  copilotPrompt: CopilotPromptOutput;
  clonePromptMutation: any;
  refetchPrompts: () => void;
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const npmPackage = "@sugar-ai/copilot-one-sdk@latest";
  const codePackage = `npm i ${npmPackage}`;

  const copilotConfigCode = `
  import { CopilotConfigType, CopilotProvider, VoiceToSkillComponent } from '${npmPackage}';

  const copilotConfig: CopilotConfigType = {
    copilotId: '${copilot?.id}',
    server: {
      endpoint: '${env.NEXT_PUBLIC_API_ENDPOINT}/api',
      token: '${copilotKey?.apiKey}',
      headers: {
        'X-COPILOT-ID': '${copilot?.id}',
      },
    },
    ai: {
      defaultPromptTemplate: '${copilotPrompt?.userName}/${copilotPrompt?.packageName}/${copilotPrompt?.templateName}/${copilotPrompt?.versionName}',
      defaultPromptVariables: {
        $ROLE: 'Boss',
      },
      successResponse: 'Task Done',
      failureResponse: 'I am not able to do this',
    },
  };
  `;

  const copilotUsageCode = `
  <CopilotProvider config={copilotConfig}>
    <VoiceToSkillComponent promptVariables={{ $ROLE: 'Boss' }} >
    </VoiceToSkillComponent>
  </CopilotProvider>
  `;

  return (
    <div
      style={
        {
          // backgroundColor: "var(--sugarhub-ternary-bg-color)",
          // padding: "1rem",
          // borderRadius: "0.5rem",
        }
      }
    >
      <Tabs
        value={value}
        // style={{ width: "100%" }}
        centered={true}
        onChange={handleChange}
        variant="scrollable" // This makes the tabs scrollable
        scrollButtons="auto" // This makes scroll buttons appear when there are more tabs than can fit
        TabIndicatorProps={{
          style: { background: "var(--sugarhub-text-color)" },
        }}
        sx={{
          ".Mui-selected": {
            color: "var(--sugarhub-text-color)",
          },
        }}
      >
        <Tab label="Copilot" sx={{ color: "var(--sugarhub-text-color)" }} />

        <Tab label="Integration" sx={{ color: "var(--sugarhub-text-color)" }} />
        <Tab
          label="Linked Prompts"
          sx={{ color: "var(--sugarhub-text-color)" }}
        />
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
              <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{ mt: 1, mb: 4, flex: 1 }}
                >
                  {`${copilot?.name} copilot`}
                </Typography>
              </Box>
              <CodeBlock title={"Copilot Id"} code={`${copilot?.id}`} />
              <CodeBlock
                title={"Copilot Token"}
                code={`${copilotKey?.apiKey}`}
              />
            </CardContent>
          </Card>
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Paper sx={{ backgroundColor: "var(--sugarhub-tab-color)" }}>
          <CodeBlock title={"Install Package"} code={codePackage} />
          <CodeBlock title={"Copilot basic config"} code={copilotConfigCode} />
          <CodeBlock
            title={"Copilot in react component"}
            code={copilotUsageCode}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={value} index={2}>
        <Paper sx={{ backgroundColor: "var(--sugarhub-tab-color)" }}>
          <Box sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <CopilotPrompts
              copilotPrompts={copilotPrompts}
              copilot={copilot}
              clonePromptMutation={clonePromptMutation}
              refetchPrompts={refetchPrompts}
            ></CopilotPrompts>
          </Box>
        </Paper>
      </TabPanel>
    </div>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%", height: "100%" }}
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

function getCopilotConfig(
  copilot: CopilotOutput,
  copilotKey: KeyOutput,
  copilotPrompt: CopilotPromptOutput,
): CopilotConfigType {
  const copilotConfig: CopilotConfigType = {
    copilotId: copilot?.id as string,
    server: {
      endpoint: "/api",
      token: copilotKey?.apiKey as string,
    },

    ai: {
      defaultPromptTemplate: `${copilotPrompt?.userName}/${copilotPrompt?.packageName}/${copilotPrompt?.templateName}/${copilotPrompt?.versionName}`,
      defaultPromptVariables: {
        $ROLE: "Boss",
      },
      successResponse: "Task Done",
      failureResponse: "I am not able to do this",
    },

    // @ts-ignore
    style: {},
  };

  return copilotConfig;
}

const CopilotPrompts = ({
  copilotPrompts,
  copilot,
  clonePromptMutation,
  refetchPrompts,
}: {
  copilotPrompts: CopilotPromptListOutput;
  copilot: CopilotOutput;
  clonePromptMutation: any;
  refetchPrompts: () => void;
}) => {
  const router = useRouter();

  const regeneratePromptConfig = () => {
    clonePrompt(
      clonePromptMutation,
      `${env.NEXT_PUBLIC_PROMPT_PACKAGES}`,
      copilot,
      true,
      refetchPrompts,
    );
  };

  return (
    <div>
      {copilotPrompts && copilotPrompts.length > 0 ? (
        <Grid container spacing={1} sx={{ paddingTop: 2 }}>
          {copilotPrompts.map((copilotPrompt, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
              <Card>
                <CardActionArea
                  href={`/dashboard/prompts/${copilotPrompt?.packageId}`}
                >
                  <CardHeader
                    title={copilotPrompt?.packageName}
                    action={
                      <Chip
                        sx={{ mr: 2 }}
                        size="small"
                        label={copilotPrompt?.promptPackage?.visibility}
                        // variant="conti"
                      />
                    }
                  />
                  <CardContent>
                    <Typography
                      sx={{
                        height: "3em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {copilotPrompt.promptPackage?.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Button
            size="small"
            onClick={regeneratePromptConfig}
            variant="outlined"
            color="primary"
          >
            Regenerate Prompt
          </Button>
        </>
      )}
    </div>
  );
};
