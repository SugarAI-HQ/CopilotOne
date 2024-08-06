import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = "Loading..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
    >
      <CircularProgress />
      <Typography variant="h6" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
