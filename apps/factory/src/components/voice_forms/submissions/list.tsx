import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import the Refresh icon
import React, { useState } from "react";
import Loading from "~/components/Layouts/loading";
import SubmissionAnswers from "~/components/voice_forms/submissions/answers";
import ReactTimeAgo from "react-timeago";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";

const SubmissionsList = ({ formId }: { formId: string }) => {
  const router = useRouter();

  // State to handle modal visibility and submission data
  const [openModal, setOpenModal] = useState(false);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<
    string | null
  >(null);

  const {
    data: submissions,
    isLoading,
    refetch,
  } = api.form.getSubmissions.useQuery({ formId }, { enabled: !!formId });

  const exportMutation = api.form.exportSubmissions.useMutation();

  const onDownload = React.useCallback(() => {
    exportMutation.mutate(
      {
        formId: formId,
      },
      { onSuccess: handleDownload },
    );
  }, [exportMutation]);

  const handleDownload = (data: any) => {
    const base64Data = data.buffer;
    const mediaType =
      "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,";
    const downloadLink = `${mediaType}${base64Data}`;

    // Create an anchor element and trigger the download
    const a = document.createElement("a");
    a.href = downloadLink;
    a.download = data.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const { data: form, isLoading: isFormLoading } = api.form.getForm.useQuery(
    { formId: formId },
    {
      enabled: !!formId,
      onSuccess(updatedForm: any) {},
    },
  );

  const handleOpenModal = (submissionId: string) => {
    setSelectedSubmissionId(submissionId);
    setOpenModal(true);
  };

  const columns = [
    { field: "id", headerName: "Submission ID", flex: 1 },
    { field: "clientUserId", headerName: "Client User ID", flex: 1 },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      renderCell: (params: any) => {
        return <ReactTimeAgo date={params.value} />;
      },
    },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      flex: 1,
      renderCell: (params: any) => {
        return params.value ? (
          <ReactTimeAgo date={params.value} />
        ) : (
          "Not Submitted"
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: any) => (
        <>
          <Button
            variant="text"
            size="small"
            onClick={() => handleOpenModal(params.id)} // Open modal to submit answers
          >
            View
          </Button>
          <Button
            variant="text"
            startIcon={<OpenInNewIcon />}
            size="small"
            color="primary"
            onClick={() =>
              window.open(
                `/dashboard/forms/${formId}/submissions/${params.id}`,
                "_blank",
              )
            }
          ></Button>
        </>
      ),
    },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="w-full pt-3">
      <div className="rounded-lg p-4 shadow-lg">
        <div className="mb-2 flex justify-end">
          <IconButton color="primary" onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => onDownload()}>
            {exportMutation.isLoading ? (
              <CircularProgress size="1.25rem" />
            ) : (
              <DownloadIcon />
            )}
          </IconButton>
        </div>
        <DataGrid
          rows={submissions || []}
          columns={columns}
          autoHeight
          disableColumnMenu
        />
      </div>

      {/* Modal for Submission Answers */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Inbox</DialogTitle>
        <DialogContent>
          {isFormLoading ? (
            <Loading />
          ) : selectedSubmissionId && form ? (
            <SubmissionAnswers
              voiceForm={form}
              submissionId={selectedSubmissionId}
            />
          ) : (
            <p>No data available.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmissionsList;
