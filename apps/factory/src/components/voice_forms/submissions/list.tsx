import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import React from "react";

const SubmissionsList = ({ formId }: { formId: string }) => {
  const router = useRouter();
  const { data: submissions, isLoading } =
    api.form.getSubmissionsSummary.useQuery({ formId }, { enabled: !!formId });

  const columns = [
    { field: "id", headerName: "Submission ID", width: "300" },
    { field: "clientUserId", headerName: "Client User ID", width: "300" },
    { field: "createdAt", headerName: "Created At", width: "300" },
    {
      field: "submittedAt",
      headerName: "Submitted At",
      width: "300",
      renderCell: (params) =>
        params.value
          ? new Date(params.value).toLocaleString()
          : "Not Submitted",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: "300",
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
      {/* <h1 className="mb-4 text-xl font-semibold text-white">
        Submissions Summary
      </h1> */}
      <div className="rounded-lg p-4 shadow-lg">
        <DataGrid
          rows={submissions || []}
          columns={columns}
          autoHeight
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default SubmissionsList;
