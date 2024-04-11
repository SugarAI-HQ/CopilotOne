import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  Typography,
  colors,
} from "@mui/material";
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
} from "@sugar-ai/abcd";

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

  const { data: copilotPrompts } = api.copilot.getCopilotPrompts.useQuery({
    copilotId: copilotId,
  });

  const copilotConfig: CopilotConfigType = {
    copilotId: copilot?.id as string,
    style: {
      container: {
        position: "bottom-right",
        margin: "",
      },
      theme: {
        primaryColor: "",
        secondaryColor: "",
        fontFamily: "",
        fontSize: "",
        textColor: "",
      },
      button: {
        primaryColor: "",
        secondaryColor: "",
        width: "",
        height: "",
        iconSize: "",
      },
    },

    server: {
      endpoint: "/api",
      token: copilotKey?.apiKey as string,

      headers: {
        // optional headers, to be sent with each api request
        "X-COPILOT-ID": copilot?.id,
      },
    },

    ai: {
      defaultPromptTemmplate: `${copilotPrompt?.userName}/${copilotPrompt?.packageName}/${copilotPrompt?.templateName}/${copilotPrompt?.versionName}`,
      defaultPromptVariables: {
        $ROLE: "Boss",
      },
      successResponse: "Task Done",
      failureResponse: "I am not able to do this",
    },
  };

  const codePackage = `npm i @sugar-ai/abcd`;

  const copilotConfigCode = `
  import { CopilotConfigType, CopilotProvider, VoiceToSkillComponent } from '@sugar-ai/abcd';

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
      defaultPromptTemmplate: '${copilotPrompt?.userName}/${copilotPrompt?.packageName}/${copilotPrompt?.templateName}/${copilotPrompt?.versionName}',
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
    <>
      <CopilotProvider config={copilotConfig}>
        <VoiceToSkillComponent
          id={2}
          position={"bottom-right"}
          promptVariables={{ $ROLE: "Boss" }}
          messageStyle={{ color: "black" }}
        />
      </CopilotProvider>
      <Box
        sx={{ p: 2, display: "flex", alignItems: "center" }}
        className="w-full"
      >
        <Typography
          variant="h4"
          component="span"
          sx={{ mt: 1, mb: 4, flex: 1 }}
        >
          {`${copilot?.name} copilot`}
        </Typography>
      </Box>
      <CodeBlock title={"CopilotId"} code={`copilotId = "${copilot?.id}"`} />
      <CodeBlock
        title={"Copilot Token"}
        code={`token = "${copilotKey?.apiKey}"`}
      />
      <CodeBlock title={"Install Package"} code={codePackage} />
      <CodeBlock title={"Copilot basic config"} code={copilotConfigCode} />
      <CodeBlock title={"Copilot in react component"} code={copilotUsageCode} />
      <Box
        sx={{ p: 2, display: "flex", flexDirection: "column" }}
        className="w-full"
      >
        <Typography variant="h5" sx={{ mb: 1 }}>
          Copilot Packages
        </Typography>
        {copilotPrompts && copilotPrompts.length > 0 && (
          <Grid container spacing={1} sx={{ paddingTop: 2 }}>
            {copilotPrompts.map((copilotPrompt, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardActionArea
                    href={`/dashboard/prompts/${copilotPrompt?.packageId}`}
                  >
                    <CardHeader title={copilotPrompt?.packageName} action="" />
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
                        {/* description */}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
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
    <Box
      sx={{ p: 2, display: "flex", flexDirection: "column" }}
      className="w-full"
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <CodeHighlight code={code} language="javascript" isCopy={isCopy} />
    </Box>
  );
};

CopilotShow.getLayout = getLayout;

export default CopilotShow;
