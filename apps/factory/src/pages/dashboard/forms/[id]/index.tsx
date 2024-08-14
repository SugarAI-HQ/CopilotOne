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
import { clonePrompt } from "../../copilots";

const FormShow: NextPageWithLayout = () => {
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
