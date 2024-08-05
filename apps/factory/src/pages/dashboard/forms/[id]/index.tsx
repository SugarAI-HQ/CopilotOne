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
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";
import CodeHighlight from "~/components/integration/code_highlight";

import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import { env } from "~/env.mjs";
// import {
//   CopilotConfigType,
//   CopilotProvider,
//   VoiceAssistant,
// } from "@sugar-ai/copilot-one-js";
import {
  CopilotOutput,
  CopilotPromptListOutput,
  CopilotPromptOutput,
} from "~/validators/copilot";
import { KeyOutput } from "~/validators/api_key";
import { clonePrompt } from "../..";

const CopilotShow: NextPageWithLayout = () => {
  const router = useRouter();
  const formId = router.query.id as string;

  const { data: form } = api.form.getForm.useQuery({ id: formId });

  return (
    <>
      {/* {
        <CopilotProvider config={copilotConfig}>
          <VoiceAssistant
            promptTemplate={promptTemplate}
            id={"preview"}
            position={"bottom-right"}
            promptVariables={{ $ROLE: "Boss" }}
            messageStyle={{ color: "black" }}
          />
        </CopilotProvider>
      } */}

      <Box className="w-full"></Box>
    </>
  );
};

FormShow.getLayout = getLayout;

export default FormShow;

function CopilotTabs({
  formId,
  copilotPrompts,
  copilot,
  copilotKey,
  copilotPrompt,
  clonePromptMutation,
  refetchPrompts,
}: {
  formId: string;
  copilotPrompts: CopilotPromptListOutput;
  copilot: CopilotOutput;
  copilotKey: KeyOutput;
  copilotPrompt: CopilotPromptOutput;
  clonePromptMutation: any;
  refetchPrompts: () => void;
}) {
  const [value, setValue] = useState(0);
  const [pvalue, setPvalue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const handlePackageChange = (event: any, newValue: number) => {
    setPvalue(newValue);
  };

  const npmPackage = "@sugar-ai/copilot-one-js";
  const codePackage = `npm i ${npmPackage}@latest`;

  const previewConfig = {
    formId: copilot?.id,
    server: {
      endpoint: `${env.NEXT_PUBLIC_API_ENDPOINT}/api`,
      token: copilotKey?.apiKey,
    },
    ai: {
      defaultPromptTemplate: `${copilotPrompt?.userName}/${copilotPrompt?.packageName}/${copilotPrompt?.templateName}/${copilotPrompt?.versionName}`,
    },
  };

  // // Preview config
  // const iframeRef = useRef(null);
  // const iframeOrigin = "http://localhost:4000";
  // const sendMessageToIframe = () => {
  //   const iframeWindow = iframeRef?.current?.contentWindow;
  //   iframeWindow.postMessage(previewConfig, iframeOrigin);
  // };

  const copilotConfigCode = `
  import { CopilotConfigType } from '${npmPackage}';

  const copilotConfig: CopilotConfigType = {
    formId: '${previewConfig.formId}',
    server: {
      endpoint: '${previewConfig.server.endpoint}',
      token: '${previewConfig.server.token}',
    },
    ai: {
      defaultPromptTemplate: '${previewConfig.ai.defaultPromptTemplate}',
      defaultPromptVariables: {
        $NAME: 'Sugar',
      },
      successResponse: 'Task Done',
      failureResponse: 'I am not able to do this',
    },
  };
  `;

  const copilotUsageCode = `
  <CopilotProvider config={copilotConfig}>
    <VoiceAssistant promptVariables={{ $ROLE: 'Boss' }} >
    </VoiceAssistant>
  </CopilotProvider>
  `;

  const javascriptHead = `
  <script
    type="module"
    src="https://cdn.jsdelivr.net/npm/@sugar-ai/copilot-one-js@latest/dist/js/copilot-one.min.js"
    async
  ></script>
`;

  const javascriptBody = `
  <!-- Adding copilot one container to your webiste  -->
  <a id="copilot-one" href="https://sugarai.dev"></a>
  <script>
    window.saiData = window.saiData || [];

    function saiAsync() {
      saiData.push(arguments);
    }
  </script>

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
          label="Linked Prompt Packages"
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
              <Box sx={{ p: 2, alignItems: "center" }}>
                <Typography
                  variant="h4"
                  component="p"
                  sx={{
                    mt: 1,
                    mb: 4,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span style={{ flexGrow: 1 }}>{`${copilot?.name}`}</span>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => previewCopilot(previewConfig)}
                    // href="https://docs.sugarai.dev/guides/get-staretd/"
                  >
                    Preview
                  </Button>
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
          <Card
            sx={{
              backgroundColor: "var(--sugarhub-tab-color)",
              borderRadius: "0.5rem",
              color: "var(--sugarhub-text-color)",
            }}
          >
            <CardContent>
              <Tabs
                value={pvalue}
                // style={{ width: "100%" }}
                centered={true}
                onChange={handlePackageChange}
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
                <Tab
                  label="React"
                  sx={{ color: "var(--sugarhub-text-color)" }}
                />

                <Tab
                  label="Javascript"
                  sx={{ color: "var(--sugarhub-text-color)" }}
                />
              </Tabs>
              <TabPanel value={pvalue} index={0}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <BoxDescription
                    title={"Add Copilot to your App"}
                  ></BoxDescription>
                  <Box>
                    <CodeBlock title={"Install Package"} code={codePackage} />

                    <CodeBlock
                      title={"Copilot basic config"}
                      code={copilotConfigCode}
                    />
                    <Typography sx={{ p: 2 }}>Read more on the docs</Typography>
                  </Box>
                </Box>
              </TabPanel>
              <TabPanel value={pvalue} index={1}>
                <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
                  <BoxDescription
                    title={"Add Copilot to your Website"}
                  ></BoxDescription>

                  <Box>
                    <CodeBlock
                      title={"Add this to your Head tag"}
                      code={javascriptHead}
                    />
                    <CodeBlock
                      title={"Add this inside your HTML body"}
                      code={javascriptBody}
                    />
                  </Box>
                </Box>
              </TabPanel>
            </CardContent>
          </Card>
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

function BoxDescription(props: any) {
  return (
    <>
      <Typography
        variant="h4"
        component="p"
        sx={{ mt: 1, mb: 4, flex: 1, textAlign: "center" }}
      >
        {props.title}
        <br />
        <Button
          variant="outlined"
          size="large"
          href="https://docs.sugarai.dev/guides/1_introduction/"
          sx={{ mt: 2 }}
        >
          Docs
        </Button>
      </Typography>
    </>
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
) {
  const copilotConfig = {
    formId: copilot?.id as string,
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
    clonePrompt(clonePromptMutation, copilot, true, refetchPrompts);
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
        <Box
          style={{
            minHeight: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Button
            size="small"
            onClick={regeneratePromptConfig}
            variant="outlined"
            color="primary"
          >
            Create Linked Prompt Packages
          </Button>
        </Box>
      )}
    </div>
  );
};

function previewCopilot(previewConfig: any) {
  const exampleOrign = "https://demo.sugarai.dev";
  if (typeof window !== "undefined") {
    // Convert data to a JSON string and encode it
    const encodedData = btoa(JSON.stringify(previewConfig));

    // Construct the URL with encoded data
    const url = `${exampleOrign}/todo?data=${encodedData}`;

    const targetWindow = window.open(url, "_blank", "noopener,noreferrer");
  }
}
