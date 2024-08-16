import { useRouter } from "next/router";

import { api } from "~/utils/api";
import { List, ListItem, ListItemText, Paper } from "@mui/material";

const SubmissionDetails = () => {
  const router = useRouter();
  const { formId, submissionId } = router.query;
  const { data: submission, isLoading } =
    api.formSubmission.getSubmissionDetails.useQuery({
      formId: formId as string,
      submissionId: submissionId as string,
    });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Submission Details</h1>
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
          {submission?.answers.map((answer) => (
            <ListItem key={answer.questionId} className="border-b">
              <ListItemText
                primary={`Question ID: ${answer.questionId}`}
                secondary={`Answer: ${JSON.stringify(answer.answer)}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default SubmissionDetails;
