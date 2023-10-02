import React, { useState, useEffect } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import TimeAgo from 'react-timeago';
import LabelIcons from "~/components/label_icon";
import { NextPageWithLayout } from "~/pages/_app";
import { LabelledState } from "~/validators/prompt_log";

interface PromptLog {
  id: string;
  inputId?: string;
  prompt: string;
  version: string;
  completion: string;
  llmProvider: string;
  llmModel: string;
  llmConfig: {
    max_tokens: number;
    temperature: number;
  };
  latency: number;
  prompt_tokens: number;
  environment: string;
  completion_tokens: number;
  total_tokens: number;
  extras: Record<string, any>;
  labelledState: LabelledState;
  finetunedState: FinetunedState;
  promptPackageId: string;
  promptTemplateId: string;
  promptVersionId: string;
  createdAt: string;
  updatedAt: string;
}

// type LabelledState = "UNLABELLED" | "SELECTED" | "REJECTED" | "NOTSURE";
type FinetunedState = "UNPROCESSED" | "PROCESSED";

const itemsPerPage = 10;

const PromptLogTable: NextPageWithLayout = () => {
  // const [promptLogs, setPromptLogs] = useState<PromptLog[]>([])
  const router = useRouter();
  const packageId = router.query.id as string;



  // const [promptLogs, setPromptLogs] = useState<PromptLog[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const { data, hasNextPage, fetchNextPage, refetch } = api.log.getLogs.useInfiniteQuery(
    {
      promptPackageId: packageId,
      perPage: itemsPerPage,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
      },

    }
  );

  const promptLogs = data ? data.pages.flatMap((page) => page.data) : [];

  useEffect(() => {
    // Fetch initial page of data
    refetch();
  }, []);


  const handleSearch = () => {
    // Implement the search logic here.
    // Filter the promptLogs array based on the searchText.
  };

  const loadMore = () => {
    fetchNextPage();
  };

  return (
    <div>
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Prompt</TableCell>
              <TableCell>Completion</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>LLM Provider</TableCell>
              <TableCell>LLM Model</TableCell>
              <TableCell>Total Tokens</TableCell>
              <TableCell>Environment</TableCell>
              <TableCell>Latency(in ms)</TableCell>
              <TableCell>Labelled State</TableCell>
              <TableCell>Finetuned State</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promptLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.id}</TableCell>
                <TableCell>
                  {log.prompt}
                  <p>tokens: {log.prompt_tokens}</p>
                </TableCell>
                <TableCell>
                  {log.completion}
                  <p>tokens: {log.completion_tokens}</p>
                </TableCell>
                <TableCell>{log.version}</TableCell>
                <TableCell>{log.llmProvider}</TableCell>
                <TableCell>{log.llmModel}</TableCell>
                <TableCell>{log.total_tokens}</TableCell>
                <TableCell>{log.environment}</TableCell>
                <TableCell>{log.latency}</TableCell>
                <TableCell>
                  <LabelIcons
                    logId={log.id}
                    labelledState={log.labelledState}
                  />
                </TableCell>
                <TableCell>{log.finetunedState}</TableCell>
                <TableCell><TimeAgo date={log.createdAt}/></TableCell>
                <TableCell><TimeAgo date={log.updatedAt}/></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="pt-5 flex justify-center items-center">
        {hasNextPage && (
          <Button
            variant="outlined"
            color="primary"
            onClick={loadMore}
            className="ml-2"
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};


PromptLogTable.getLayout = getLayout

export default PromptLogTable;
