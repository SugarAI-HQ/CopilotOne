import { useRouter } from "next/router";

import { api } from "~/utils/api";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
} from "@mui/material";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";

const SubmissionAnswers = ({ submission }: any) => {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Submission</h1>
      <Paper className="p-4">
        <h2 className="mb-2 text-lg font-semibold">
          Client User ID: {submission?.clientUserId}
        </h2>
        <h3 className="text-md mb-2 font-medium">
          Created At: {new Date(submission?.createdAt).toLocaleString()}
        </h3>
        <h3 className="text-md mb-4 font-medium">
          Submitted At:{" "}
          {submission?.submittedAt
            ? new Date(submission?.submittedAt).toLocaleString()
            : "Not Submitted"}
        </h3>

        <List>
          {submission?.answers.map((sa) => (
            <ListItem
              key={sa.questionId}
              className="border-b"
              secondaryAction={
                <IconButton aria-label="comment">
                  <CheckIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <CheckIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${sa.questionId}: `}
                secondary={`Answer: ${sa.answer.evaluatedAnswer}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default SubmissionAnswers;
