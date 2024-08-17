import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";

import { allLanguages, LangCode } from "@sugar-ai/core";

import { GetSubmissionResponse } from "~/validators/form";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import LabelIcon from "@mui/icons-material/Label";

const SubmissionAnswers = ({ submission }: any) => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Submission {submission.id}</h1>
      <Paper className="border-2 p-4">
        <h3 className="text-md mb-2 font-medium">
          Started At: {new Date(submission?.createdAt).toLocaleString()}
        </h3>
        <h3 className="text-md mb-4 font-medium">
          Submitted At:{" "}
          {submission?.submittedAt
            ? new Date(submission?.submittedAt).toLocaleString()
            : "Not Submitted"}
        </h3>
        <h3 className="text-md mb-4 font-medium">
          Device: {submission?.metadata?.device?.vendor}{" "}
          {submission?.metadata?.device?.model} /{" "}
          {submission?.metadata?.os?.name}
          {"-"}
          {submission?.metadata?.os?.version} /{" "}
          {submission?.metadata?.browser?.name}
          {"-"}
          {submission?.metadata?.browser?.version}
        </h3>
        <h3 className="text-md mb-4 font-medium">
          Language: {allLanguages[submission?.metadata?.language as LangCode]}
          {" / "}
          {submission?.metadata?.voice?.name}
        </h3>
        <h3 className="mb-2 text-lg font-medium">
          User ID: {submission?.clientUserId}
        </h3>

        <List>
          {submission?.answers.map((sa: GetSubmissionResponse) => (
            <ListItem
              key={sa.questionId}
              className="border-b"
              // secondaryAction={
              //   <IconButton aria-label="comment">
              //     <CheckIcon />
              //   </IconButton>
              // }
            >
              <ListItemAvatar>
                <LabelIcon />
              </ListItemAvatar>
              <ListItemText
                primary={`${sa.questionId}: `}
                secondary={`Answer [${sa.answer.by}]: ${sa.answer.evaluatedAnswer}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default SubmissionAnswers;
