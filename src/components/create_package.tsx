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
  FormControlLabel,
  FormLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export function CreatePackage({ onSubmit }: { onSubmit: Function}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = React.useState('public');

  const handleClose = () => {
    setName("")
    setDescription("")
    setIsOpen(false);
  };

  const handleSubmit = () => {
    onSubmit({
      name: name,
      description: description,
      visibility: visibility,
    });
    handleClose(); // Close the modal after submitting
  };

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
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
          <Typography variant="h6">New Prompt Package</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
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


            <FormControl component="fieldset">
              <FormLabel component="legend">Visibility</FormLabel>
              <RadioGroup
                aria-label="visibility"
                name="visibilityGroup"
                value={visibility}
                onChange={handleVisibilityChange}
              >
                <FormControlLabel
                  value="PUBLIC"
                  control={<Radio />}
                  label="Public"
                  id="public-radio"
                />
                <FormControlLabel
                  value="PRIVATE"
                  control={<Radio />}
                  label="Private"
                  id="private-radio"
                />
              </RadioGroup>
              <div>
                {visibility === 'PUBLIC' ? (
                  <span>
                    Anyone on the internet can use this package. You choose who can edit.
                  </span>
                ) : (
                  <span>
                    You choose who can see and commit to this package.
                  </span>
                )}
              </div>
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
