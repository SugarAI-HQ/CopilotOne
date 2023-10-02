import React, { useState, useEffect } from "react";
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import TimeAgo from 'react-timeago';
import LabelIcons from "~/components/label_icon";

import { NextPageWithLayout } from "~/pages/_app";

interface PromptLog {
  id: string;
  inputId?: string;
  prompt: string;
  completion: string;
  llmProvider: string;
  llmModel: string;
  llmConfig: {
    max_tokens: number;
    temperature: number;
  };
  latency: number;
  prompt_tokens: number;
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

type LabelledState = "UNLABELLED" | "SELECTED" | "REJECTED" | "NOTSURE";
type FinetunedState = "UNPROCESSED" | "PROCESSED";

const PromptLogTable: NextPageWithLayout = () => {
  // const [promptLogs, setPromptLogs] = useState<PromptLog[]>([])
  const router = useRouter();
  const packageId = router.query.id as string;


  const { data: pls } = api.log.getLogs.useQuery({
    promptPackageId: packageId
  });

  const [promptLogs, setPromptLogs] = useState<PromptLog[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    // Fetch data from your backend API using Axios or any other library.
    // Replace 'YOUR_API_ENDPOINT' with the actual API endpoint.
    // Example: axios.get('/api/prompt-logs').then((response) => setPromptLogs(response.data));
  }, []);


  const handleSearch = () => {
    // Implement the search logic here.
    // Filter the promptLogs array based on the searchText.
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
            {pls?.map((log) => (
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
    </div>
  );
};


PromptLogTable.getLayout = getLayout

export default PromptLogTable;
