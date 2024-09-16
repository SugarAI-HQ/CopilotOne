import React from "react";
import { Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn"; // or use ListAltIcon
import EditIcon from "@mui/icons-material/Edit";
import { env } from "~/env.mjs";
import ShareIcon from "@mui/icons-material/Share";

interface FormButtonProps {
  voiceForm: any;
}

// export const formPreviewUrl = (vf: any) => `/vf/${vf?.id}`;
export const formPreviewUrl = (vf: any) =>
  (process.env.NODE_ENV === "development"
    ? `http://localhost:4000`
    : `https://app.sugarai.dev`) + `/voice_forms/${vf?.id}`;
export const formInboxUrl = (vf: any) => `/dashboard/forms/${vf?.id}?tab=inbox`;
export const formEditUrl = (vf: any) => `/dashboard/forms/${vf?.id}/edit`;

export const FormShareButton: React.FC<FormButtonProps> = ({ voiceForm }) => {
  return (
    <Button
      variant="outlined"
      target="_blank"
      color="primary"
      startIcon={<ShareIcon />}
      href={formPreviewUrl(voiceForm)}
    >
      Share
    </Button>
  );
};

export const FormInboxButton: React.FC<FormButtonProps> = ({ voiceForm }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<AssignmentTurnedInIcon />}
      href={formInboxUrl(voiceForm)}
    >
      Inbox
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
