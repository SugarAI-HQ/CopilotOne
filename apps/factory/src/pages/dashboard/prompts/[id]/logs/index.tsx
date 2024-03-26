import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import TimeAgo from "react-timeago";
import LabelIcons from "~/components/label_icon";
import { NextPageWithLayout } from "~/pages/_app";

import LogSearchFiltering from "./log_search_filtering";
import PromptCompletion from "~/components/prompt_completion";
import PromotOutputLog from "~/components/prompt_output_log";
import { providerModels } from "~/validators/base";
import { PromptView } from "~/components/prompt_view_arrow";
import { LogSchema } from "~/validators/prompt_log";
import { GenerateOutput } from "~/validators/service";
import PromptLlmResponse, {
  LlmResponseAction,
} from "~/components/prompt_llm_response";
import { LogOutput } from "~/validators/prompt_log";
import { LlmResponse } from "~/validators/llm_respose";
import { getEditorVersion, hasImageEditor } from "~/utils/template";

interface PromptLogTableProps {
  logModeMax: boolean;
  promptTemplateId: string | undefined;
  promptVersionId: string | undefined;
  itemsPerPage: number;
  outputLog: GenerateOutput;
}

export interface FilterOptions {
  environment?: string | undefined;
  llmModel?: string | undefined;
  llmProvider?: string | undefined;
  version?: string | undefined;
}

// type LabelledState = "UNLABELLED" | "SELECTED" | "REJECTED" | "NOTSURE";
type FinetunedState = "UNPROCESSED" | "PROCESSED";

const PromptLogTable: NextPageWithLayout<PromptLogTableProps> = ({
  logModeMax = true,
  promptTemplateId = undefined,
  promptVersionId = undefined,
  itemsPerPage = 10,
  outputLog = undefined,
}) => {
  const router = useRouter();
  const packageId = router.query.id as string;

  const [promptLogs, setPromptLogs] = useState<LogSchema[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    environment: undefined,
    llmModel: undefined,
    llmProvider: undefined,
    version: promptVersionId,
  });

  const { data, hasNextPage, fetchNextPage, refetch } =
    api.log.getLogs.useInfiniteQuery(
      {
        promptPackageId: packageId,
        promptTemplateId: promptTemplateId,
        perPage: itemsPerPage,
        ...filterOptions,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
        },
      },
    );

  useEffect(() => {
    if (data) {
      const allLogs: any = data.pages.flatMap((page) => page.data);
      setPromptLogs(allLogs);
    }
  }, [data]);

  useEffect(() => {
    // Fetch initial page of data
    refetch();
  }, [searchText, filterOptions]);

  useEffect(() => {
    if (outputLog) {
      const logId = outputLog.id;
      if (!promptLogs.some((log) => log.id === logId)) {
        setPromptLogs((prevLogs) => {
          const newLog = {
            ...outputLog,
            llmConfig: {},
            extras: {},
            finetunedState: "",
            promptPackageId: "",
            promptPackageVersion: "",
          } as unknown as LogSchema;
          return [newLog, ...prevLogs];
        });
      }
    }
  }, [outputLog]);

  const handleSearch = () => {
    const filteredLogs = promptLogs.filter((log) =>
      log.prompt.toLowerCase().includes(searchText.toLowerCase()),
    );
    setPromptLogs(filteredLogs);
  };

  const loadMore = async () => {
    await fetchNextPage();
  };

  return (
    <div>
      {/* <TextField
        label="Search"
        variant="outlined"
        fullWidth
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      /> */}
      {logModeMax && (
        <LogSearchFiltering
          filterOptions={filterOptions}
          onFilterChange={(newFilterOptions) =>
            setFilterOptions(newFilterOptions)
          }
        />
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {logModeMax && <TableCell>ID</TableCell>}
              <TableCell>Prompt</TableCell>
              <TableCell>LLM Response</TableCell>
              {logModeMax && <TableCell>Version</TableCell>}
              <TableCell>LLM Provider & Model</TableCell>
              <TableCell>Total Tokens</TableCell>
              {logModeMax && <TableCell>Environment</TableCell>}
              <TableCell>Latency(in ms)</TableCell>
              <TableCell>Labelled State</TableCell>
              {/* <TableCell>Finetuned State</TableCell> */}
              {logModeMax && <TableCell>Created At</TableCell>}
              <TableCell>Updated At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promptLogs.map((log) => (
              <TableRow key={log.id}>
                {logModeMax && <TableCell>{log.id}</TableCell>}
                <TableCell sx={{ minWidth: "350px", maxWidth: "400px" }}>
                  {/* we are checking wether the role is true or false */}
                  {!hasImageEditor(
                    log.llmModelType,
                    log.llmProvider,
                    log.llmModel,
                  ) ? (
                    <PromptView
                      promptInputs={JSON.parse(log.prompt)}
                      haveroleUserAssistant={1}
                      promptTemplate={""}
                    />
                  ) : (
                    <PromptView
                      promptInputs={[]}
                      haveroleUserAssistant={getEditorVersion(
                        log.llmModelType,
                        log.llmProvider,
                        log.llmModel,
                      )}
                      promptTemplate={log.prompt}
                    />
                  )}
                  <hr />
                  <p style={{ paddingTop: "1rem" }}>
                    tokens: {log.prompt_tokens}
                  </p>
                </TableCell>
                <TableCell sx={{ minWidth: "400px", maxWidth: "450px" }}>
                  <div
                    style={{
                      // paddingTop: 5,
                      // justifyContent: "center",
                      // flexDirection: "column",
                      // alignItems: "center",
                      // display: "flex",
                      // maxHeight: 250,
                      width: "100%",
                    }}
                  >
                    {log?.completion && (
                      <PromptCompletion
                        pl={log}
                        imgClassName={"h-32 w-32 object-contain"}
                        textAnimation={false}
                        cube={false}
                      />
                    )}
                    {(log?.llmResponse as LlmResponse) && (
                      <PromptLlmResponse
                        pl={log as LogOutput}
                        imgClassName={"h-32 w-32 object-contain"}
                        textAnimation={false}
                      />
                    )}
                    <LlmResponseAction pl={log as LogOutput} />
                  </div>
                </TableCell>
                {logModeMax && <TableCell>{log.version}</TableCell>}
                <TableCell>
                  {log.llmProvider} - {log.llmModel}
                </TableCell>

                <TableCell>{log.total_tokens}</TableCell>
                {logModeMax && <TableCell>{log.environment}</TableCell>}
                <TableCell>{log.latency}</TableCell>
                <TableCell>
                  <LabelIcons
                    logId={log.id}
                    labelledState={log.labelledState}
                  />
                </TableCell>
                {/* <TableCell>{log.finetunedState}</TableCell> */}
                {logModeMax && (
                  <TableCell>
                    <TimeAgo date={log.createdAt} />
                  </TableCell>
                )}
                <TableCell>
                  <TimeAgo date={log.updatedAt} />
                </TableCell>
                <TableCell>
                  <PromotOutputLog pl={log} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex items-center justify-center pt-5">
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

PromptLogTable.getLayout = getLayout;

export default PromptLogTable;
