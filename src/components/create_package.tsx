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
  Input,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export function CreatePackage({ onSubmit }: { onSubmit: Function}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = () => {
    onSubmit({
      name: name,
      description: description,
    });
    handleClose(); // Close the modal after submitting
  };

  return (
    <>
      <Grid container justifyContent="flex-end">
        <Button size="small" variant="outlined" onClick={() => setIsOpen(true)}>
          Create
        </Button>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Model</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            The LLM provider and model that'll be used to power this prompt.
          </DialogContentText>

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
