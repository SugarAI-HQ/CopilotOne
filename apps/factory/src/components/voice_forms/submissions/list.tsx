import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import React from "react";

const SubmissionsList = ({ formId }: { formId: string }) => {
  const router = useRouter();
  const { data: submissions, isLoading } = api.form.getSubmissions.useQuery(
    { formId },
    { enabled: !!formId },
  );

  const columns = [
    { field: "id", headerName: "Submission ID", flex: 1 },
    { field: "clientUserId", headerName: "Client User ID", flex: 1 },
    { field: "createdAt", headerName: "Created At", flex: 1 },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      flex: 1,
      renderCell: (params) => {
        return params.value
          ? new Date(params.value).toLocaleString()
          : "Not Submitted";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="w-full pt-3">
      <div className="rounded-lg p-4 shadow-lg">
        <DataGrid
          rows={submissions || []}
          columns={columns}
          autoHeight
          pageSize={10}
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default SubmissionsList;
