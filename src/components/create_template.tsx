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
import { PromptPackage as pp, PromptTemplate as pt } from "@prisma/client";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';


export function CreateTemplate({
  pp,
  onSubmit,
}: {
  pp: pp;
  onSubmit: Function;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setName("")
    setDescription("")
    setIsOpen(false);
  };

  const handleSubmit = (e: any) => {
    onSubmit({
      promptPackageId: pp.id,
      name: name,
      description: description,
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
          <Typography>New Prompt Template</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <FormLabel>Name</FormLabel>
              <TextField
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Description</FormLabel>
              <TextField
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
