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
import React from "react";
import RecordVoiceOverSharpIcon from "@mui/icons-material/RecordVoiceOverSharp";
import KeyboardAltSharpIcon from "@mui/icons-material/KeyboardAltSharp";
import ReactTimeAgo from "react-timeago";
import { formatDistanceStrict } from "date-fns";

const SubmissionAnswers = ({
  voiceForm,
  submission,
}: {
  voiceForm: VoiceForm;
  submission: any;
}) => {
  const questions = voiceForm?.questions;
  const languages = voiceForm?.languages;

  // Create a Map for quick lookup by id
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  // Function to get a question by id
  const getQuestionById = (id: string): Question | undefined =>
    questionMap.get(id);

  questions;
  return (
    <div className="p-6">
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
        {/* <h3 className="text-md mb-4 font-medium">
          Language:{" "}
          {allLanguages[submission?.metadata?.language as LanguageCode]}
          {" / "}
          {submission?.metadata?.voice?.name}
        </h3> */}
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

export const SubmittedAnswerComponentx = ({
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
    <Box>
      <ListItem key={sa?.questionId} className="w-full border-b">
        <ListItemAvatar>
          {qa.by === "voice" ? (
            <RecordVoiceOverSharpIcon />
          ) : (
            <KeyboardAltSharpIcon />
          )}
        </ListItemAvatar>

        <ListItemText
          primary={question.question_text.lang[languages[0] as LanguageCode]}
          secondary={
            <Typography component="span" variant="body2" color="text.primary">
              {qa.evaluatedAnswer}
            </Typography>
          }
        />
        <IconButton aria-label="comment">
          {sa.answer.qualificationScore || "-"}
        </IconButton>
      </ListItem>

      {qa.rawAnswer == qa.evaluatedAnswer && (
        <ListItem key={`${sa?.questionId}-raw`} className="w-full border-b">
          <ListItemText
            secondary={
              <Typography
                component="span"
                variant="body2"
                color="text.secondary"
              >
                Raw: {qa.rawAnswer}
              </Typography>
            }
          />
        </ListItem>
      )}
    </Box>
  );
};

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
            {qa.by === "voice" ? (
              <RecordVoiceOverSharpIcon />
            ) : (
              <KeyboardAltSharpIcon />
            )}
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
