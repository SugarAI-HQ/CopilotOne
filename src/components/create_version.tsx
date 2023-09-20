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
import {parse, valid} from "semver"
import toast from "react-hot-toast";
import { api } from "~/utils/api";


export function CreateVersion({
  pp,
  pt,
  onSubmit,
  v="0.0.1",
  icon=<AddCircleIcon />
}: {
  pp: pp;
  pt: pt;
  v: string;
  onSubmit: Function;
  icon: JSX.Element
}) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [version, setVersion] = useState(v);

  const handleClose = () => {
    // setVersion("")
    setIsOpen(false);
  };

  const pvCreateMutation = api.prompt.createVersion.useMutation({
    onSuccess: (pv) => {
        if (pv !== null) {
            onSubmit(pv);
            handleClose(); // Close the modal after submitting
            // pvs?.push(pv)
            toast.success("Version Created Successfully");
        }
    }
  })

  const handleSubmit = (e: any) => {

    pvCreateMutation.mutate({
      promptPackageId: pp.id,
      promptTemplateId: pt.id,
      version: version,
    });
  };

  
  return (
    <>
      <Grid component="span">
        <IconButton
          size="small"
          aria-label="add template" 
          onClick={() => setIsOpen(true)}
          color="primary">
            {icon}
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
                error={!valid(version)}
                onChange={(e) => setVersion(e.target.value)}
                helperText={'Use semantic versioning (e.g. 1.0.1)'}
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
