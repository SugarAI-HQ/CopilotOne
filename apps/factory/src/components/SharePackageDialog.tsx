import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextareaAutosize,
  Divider,
  Tabs,
  Tab,
  Box,
  Input,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircle from "@mui/icons-material/AddCircle";
import { MdContentCopy, MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";
import { useRouter } from "next/router";
import CopyToClipboardButton from "./copy_button";

interface SharePackageDialogProps {
  open: boolean;
  onClose: () => void;
}

const SharePackageDialog: React.FC<SharePackageDialogProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();
  const [promptRoute, setPromptRoute] = useState("");

  useEffect(() => {
    // Check if we're in a browser environment before using window
    if (typeof window !== "undefined") {
      // Access window safely here
      const completePath = window.location.href;
      setPromptRoute(completePath);
    }
  }, []);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share Package</DialogTitle>
      <DialogContent className="">
        <div className="">
          <Typography className="">
            Give your teammates access to this project and start collaborating
            in real time.
          </Typography>

          <div className="w-full">
            <div className="mt-3 flex items-center justify-between rounded border border-gray-400">
              <TextField
                variant="standard"
                sx={{ padding: 0 }}
                className="grow px-3"
                InputProps={{
                  disableUnderline: true,
                }}
                defaultValue={promptRoute}
                disabled
              />
              <CopyToClipboardButton
                textToCopy={promptRoute}
                textToDisplay={"Copy"}
              />
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SharePackageDialog;
