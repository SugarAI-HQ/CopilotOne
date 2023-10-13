import React from "react";
import Button from "@mui/material/Button";
import BugReportIcon from "@mui/icons-material/BugReport";

const BugReport = () => {
  // Replace with your GitHub repository URL and issue title
  const githubUrl =
    "https://github.com/sugarcane-ai/sugarcane-ai/issues/new?title=Bug%20Report";

  const handleClick = () => {
    // Open a new window or tab with the GitHub issue creation page
    window.open(githubUrl, "_blank");
  };

  return (
    <Button
      variant="outlined"
      size="small"
      // color="error" // You can choose the appropriate color
      color="inherit" // You can choose the appropriate color
      startIcon={<BugReportIcon />}
      onClick={handleClick}
    >
      Feedback
    </Button>
  );
};

export default BugReport;
