import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv } from "@prisma/client";
import AddCircleIcon from '@mui/icons-material/AddCircle';


export function CreateVersion({
  pp,
  pt,
  onSubmit,
}: {
  pp: pp;
  pt: pt;
  onSubmit: Function;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [version, setVersion] = useState("");

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e: any) => {
    onSubmit({
      promptPackageId: pp.id,
      promptTemplateId: pt.id,
      version: version,
    });
    handleClose(); // Close the modal after submitting
  };

  return (
    <>
      <Grid component="span">
        <IconButton
          size="small"
          aria-label="add template" 
          onClick={() => setIsOpen(true)}
          color="primary">
            <AddCircleIcon />
        </IconButton>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">New Prompt Version</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <FormLabel>Version</FormLabel>
              <TextField
                variant="outlined"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
              />
            </FormControl>

          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button size="small" onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleSubmit}
            variant="outlined"
            color="primary"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
