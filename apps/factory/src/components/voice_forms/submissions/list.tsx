import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh"; // Import the Refresh icon
import React from "react";
import Loading from "~/components/Layouts/loading";
import ReactTimeAgo from "react-timeago";

const SubmissionsList = ({ formId }: { formId: string }) => {
  const router = useRouter();
  const {
    data: submissions,
    isLoading,
    refetch,
  } = api.form.getSubmissions.useQuery({ formId }, { enabled: !!formId });

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
        <Button
          variant="text"
          size="small"
          color="primary"
          onClick={() =>
            router.push(`/dashboard/forms/${formId}/submissions/${params.id}`)
          }
        >
          View
        </Button>
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
        </div>
        <DataGrid
          rows={submissions || []}
          columns={columns}
          autoHeight
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default SubmissionsList;
