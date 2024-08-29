import React from "react";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // or use ListAltIcon
import EditIcon from "@mui/icons-material/Edit";
import { env } from "~/env.mjs";

interface FormButtonProps {
  voiceForm: any;
}

// export const formPreviewUrl = (vf: any) => `/vf/${vf?.id}`;
export const formPreviewUrl = (vf: any) =>
  (process.env.NODE_ENV === "development"
    ? `http://localhost:4000`
    : `https://demo.sugarai.dev`) + `/voice_forms/${vf?.id}`;
export const formSubmissionsUrl = (vf: any) =>
  `/dashboard/forms/${vf?.id}?tab=submissions`;
export const formEditUrl = (vf: any) => `/dashboard/forms/${vf?.id}/edit`;

export const FormPreviewButton: React.FC<FormButtonProps> = ({ voiceForm }) => {
  return (
    <Button
      variant="outlined"
      target="_blank"
      color="primary"
      startIcon={<VisibilityIcon />}
      href={formPreviewUrl(voiceForm)}
    >
      Preview
    </Button>
  );
};

export const FormSubmissionsButton: React.FC<FormButtonProps> = ({
  voiceForm,
}) => {
  return (
    <Button
      variant="outlined"
      startIcon={<AssignmentTurnedInIcon />}
      href={formSubmissionsUrl(voiceForm)}
    >
      Submissions
    </Button>
  );
};

export const FormEditButton: React.FC<FormButtonProps> = ({ voiceForm }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<EditIcon />}
      href={formEditUrl(voiceForm)}
    >
      Edit
    </Button>
  );
};
