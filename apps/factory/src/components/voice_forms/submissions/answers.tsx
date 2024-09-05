import {
  Avatar,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import {
  allLanguages,
  LanguageCode,
  Question,
  QuestionAnswer,
  VoiceForm,
} from "@sugar-ai/core";

import { SubmittedAnswer } from "~/validators/form";
import React, { useState } from "react";
import RecordVoiceOverSharpIcon from "@mui/icons-material/RecordVoiceOverSharp";
import KeyboardAltSharpIcon from "@mui/icons-material/KeyboardAltSharp";
import CameraAltSharpIcon from "@mui/icons-material/CameraAltSharp";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";

import ReactTimeAgo from "react-timeago";
import { formatDistanceStrict } from "date-fns";
import Loading from "~/components/Layouts/loading";
import { api } from "~/utils/api";

const SubmissionAnswers = ({
  submissionId,
  voiceForm,
}: {
  submissionId: string;
  voiceForm: VoiceForm;
}) => {
  // Fetch the submission and form data
  const { data: submission, isLoading } = api.form.getSubmission.useQuery(
    { formId: voiceForm?.id, submissionId },
    { enabled: !!submissionId },
  );

  if (isLoading) return <Loading />;

  if (!submission || !voiceForm)
    return <div>No submission or form data found.</div>;

  const questions = voiceForm?.questions;
  const languages = voiceForm?.languages;

  // Create a Map for quick lookup by id
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Function to get a question by id
  const getQuestionById = (id: string): Question | undefined =>
    questionMap.get(id);

  return (
    <div className="">
      <h1 className="mb-4 text-xl font-semibold">
        Id: <span className="font-normal">{submission.id}</span>
      </h1>

      <Paper className="border-2 p-4">
        <h3 className="text-md mb-2 font-medium">
          Started At: {new Date(submission?.createdAt).toLocaleString()} (
          {<ReactTimeAgo date={submission?.createdAt} />})
        </h3>
        <h3 className="text-md mb-4 font-medium">
          Submitted At:{" "}
          {submission?.submittedAt
            ? new Date(submission?.submittedAt).toLocaleString()
            : "Not Submitted"}
          {" ("}
          {submission?.submittedAt ? (
            <ReactTimeAgo date={submission?.submittedAt} />
          ) : (
            ""
          )}
          {")"}
        </h3>
        <h3 className="text-md mb-4 font-medium">
          Duration:{" "}
          {submission?.submittedAt
            ? formatDistanceStrict(
                new Date(submission.submittedAt),
                new Date(submission.createdAt),
                { addSuffix: false },
              )
            : "-"}
        </h3>

        <AnswerMetadata metadata={submission?.metadata} />

        <h3 className="mb-2 text-lg font-medium">
          User ID: {submission?.clientUserId}
        </h3>

        <List>
          {submission?.answers.map((sa: SubmittedAnswer) => (
            <SubmittedAnswerComponent
              key={sa.questionId}
              sa={sa}
              question={getQuestionById(sa?.questionId) as Question}
              languages={languages}
            />
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default SubmissionAnswers;

export const SubmittedAnswerComponent = ({
  sa,
  question,
  languages,
}: {
  sa: SubmittedAnswer;
  question: Question;
  languages: LanguageCode[];
}) => {
  const qa = sa.answer as QuestionAnswer;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <AnswerBy by={qa?.by as string} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">
              {question.question_text.lang[languages[0] as LanguageCode]}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {qa.evaluatedAnswer}
            </Typography>
            {qa.rawAnswer !== qa.evaluatedAnswer && (
              <Typography variant="body2" color="text.secondary">
                Raw: {qa.rawAnswer}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {sa.answer.qualificationScore && (
              <Chip
                label={sa.answer.qualificationScore}
                color={"primary"}
                variant="outlined"
              />
            )}
            {/* <IconButton aria-label="qualification-score">
              {sa.answer.qualificationScore || "-"}
            </IconButton> */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export const AnswerBy = ({ by }: { by: string }) => {
  const renderIcon = () => {
    switch (by) {
      case "voice":
        return <RecordVoiceOverSharpIcon />;
      case "keyboard":
        return <KeyboardAltSharpIcon />;
      case "document":
        return <DocumentScannerIcon />;
      default:
        return <QuestionMarkIcon />;
    }
  };
  return <div>{renderIcon()}</div>;
};

export const AnswerMetadata = ({ metadata }: { metadata: any }) => {
  if (!metadata) return null;

  return (
    <h3 className="text-md mb-4 font-medium">
      Device: {metadata.device?.vendor ?? "Unknown Vendor"}{" "}
      {metadata.device?.model ?? "Unknown Model"} /{" "}
      {metadata.os?.name ?? "Unknown OS"} {"-"}
      {metadata.os?.version ?? "Unknown Version"} /{" "}
      {metadata.browser?.name ?? "Unknown Browser"} {"-"}
      {metadata.browser?.version ?? "Unknown Version"}
    </h3>
  );
};
