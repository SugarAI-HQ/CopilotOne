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
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";

const LogShow: NextPageWithLayout = () => {
  const router = useRouter();
  const logId = router.query.logId as string;

  const { data } = api.log.getLog.useQuery({ id: logId });

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
        {data && (
          <LabelIcons logId={data?.id} labelledState={data?.labelledState} />
        )}
      </Box>
      {data ? (
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>{data.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>{data.version}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Environment</TableCell>
                <TableCell>{data.environment}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Labelled State</TableCell>
                <TableCell>{data.labelledState}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Finetuned State</TableCell>
                <TableCell>{data.finetunedState}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>LLM Provider</TableCell>
                <TableCell>{data.llmProvider}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>LLM Model</TableCell>
                <TableCell>{data.llmModel}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Prompt</TableCell>
                <TableCell>{data.prompt}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Completion</TableCell>
                <TableCell>
                  <PromptCompletion
                    modelType={data?.llmModelType}
                    output={data?.completion}
                    tokens={data?.completion_tokens}
                    imgClassName={"h-48 w-96 object-contain"}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Tokens</TableCell>
                <TableCell>{data?.total_tokens}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Latency(in ms)</TableCell>
                <TableCell>{data?.latency}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Created At</TableCell>
                <TableCell>
                  <TimeAgo date={data?.createdAt} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Updated At</TableCell>
                <TableCell>
                  <TimeAgo date={data?.updatedAt} />
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
