import React from "react";
import {
  Box,
  Stack,
  IconButton,
  Button,
  SvgIcon,
  Typography,
  Tooltip,
  Grid,
} from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const LogLabel = () => {
  return (
    <Box>
      <Grid>
        <Tooltip title="Accept Output" placement="top-start">
          <IconButton
            color="success"
            aria-label="Manually indicate that this output was good"
          >
            <ThumbUpOffAltIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reject Output" placement="top-start">
          <IconButton
            color="error"
            aria-label="Manually indicate that this output was bad"
          >
            <ThumbDownOffAltIcon />
          </IconButton>
        </Tooltip>
      </Grid>

      {/* <div>
          <IconButton aria-label="Leave free-text notes related to this output">
            <TextSnippetOutlinedIcon />
          </IconButton>
        </div> */}

      {/* <div>
          <span aria-label="Clear result">
            <IconButton aria-label="clear result">
              <ClearIcon />
            </IconButton>
          </span>
          <span aria-label="Preview compiled prompt">
            <IconButton aria-label="preview compiled prompt">
              <VisibilityIcon />
            </IconButton>
          </span>
          <span aria-label="Copy result">
            <IconButton aria-label="copy result">
              <ContentCopyIcon />
            </IconButton>
          </span>
          <IconButton aria-label="Run just this prompt against just this scenario">
            <RefreshIcon />
          </IconButton>
        </div> */}
      {/* <WarningAmberIcon aria-label="You've made changes since this cell was last run. The results you see are likely stale." /> */}
    </Box>
  );
};

export default LogLabel;
