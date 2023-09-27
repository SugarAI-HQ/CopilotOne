import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SvgIcon from "@mui/material/SvgIcon";

const PromptOutput = ({ output }: { output: string }) => {
  return (
    <Box>
      <Typography
        variant="body2"
        textAlign={"left"}
        
      >{output}
      </Typography>
    </Box>
  );
};

export default PromptOutput;
