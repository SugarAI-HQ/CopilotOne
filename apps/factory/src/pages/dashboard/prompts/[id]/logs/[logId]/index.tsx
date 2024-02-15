import React, { useState } from "react";
import { useRouter } from "next/router";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import TimeAgo from "react-timeago";
import PromptCompletion from "~/components/prompt_completion";
import LabelIcons from "~/components/label_icon";
import {
  ModelTypeSchema,
  ModelTypeType,
} from "~/generated/prisma-client-zod.ts";
import DownloadButtonImg from "~/components/download_button_img";
import CopyToClipboardButton from "~/components/copy_button";
import DownloadButtonBase64 from "~/components/download_button_base64";
import PromptLlmResponse, {
  LlmResponseAction,
} from "~/components/prompt_llm_response";

const LogShow: NextPageWithLayout = () => {
  const router = useRouter();
  const logId = router.query.logId as string;

  const { data: pl } = api.log.getLog.useQuery({ id: logId });

  return (
    <>
      <Box
        sx={{ p: 2, display: "flex", alignItems: "center" }}
        className="w-full"
      >
        <Typography
          variant="h4"
          component="span"
          sx={{ mt: 1, mb: 4, flex: 1 }}
        >
          Prompt Output
        </Typography>
        {pl && <LabelIcons logId={pl?.id} labelledState={pl?.labelledState} />}
      </Box>
      {pl ? (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{pl.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>{pl.version}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Environment</TableCell>
                <TableCell>{pl.environment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Labelled State</TableCell>
                <TableCell>{pl.labelledState}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Finetuned State</TableCell>
                <TableCell>{pl.finetunedState}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>LLM Provider</TableCell>
                <TableCell>{pl.llmProvider}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>LLM Model</TableCell>
                <TableCell>{pl.llmModel}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Prompt</TableCell>
                <TableCell>{pl.prompt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Box>
                    <Typography>LLM Response</Typography>
                    <LlmResponseAction pl={pl} />
                  </Box>
                </TableCell>
                <TableCell>
                  {pl?.completion && (
                    <PromptCompletion
                      pl={pl}
                      imgClassName={"h-48 w-96 object-contain"}
                      textAnimation={false}
                    />
                  )}
                  {pl?.llmResponse && (
                    <PromptLlmResponse
                      pl={pl}
                      imgClassName={"h-48 w-96 object-contain"}
                      textAnimation={false}
                    />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Tokens</TableCell>
                <TableCell>{pl?.total_tokens}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Latency(in ms)</TableCell>
                <TableCell>{pl?.latency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created At</TableCell>
                <TableCell>
                  <TimeAgo date={pl?.createdAt} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated At</TableCell>
                <TableCell>
                  <TimeAgo date={pl?.updatedAt} />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography component="span" sx={{ mt: 1, mb: 4, flex: 1, p: 2 }}>
          Log Not found
        </Typography>
      )}
    </>
  );
};

LogShow.getLayout = getLayout;
export default LogShow;
