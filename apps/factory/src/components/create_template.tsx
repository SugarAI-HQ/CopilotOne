import React, { useState } from "react";
import {
  Box,
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
  Select,
  MenuItem,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { providerModels } from "~/validators/base";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";

export function CreateTemplate({
  pp,
  onCreate,
  sx,
}: {
  pp: pp;
  onCreate: Function;
  sx?: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modelType, setModelType] = useState<string>(
    ModelTypeSchema.Enum.TEXT2TEXT,
  );

  const handleClose = () => {
    setName("");
    setDescription("");
    setModelType(ModelTypeSchema.Enum.TEXT2TEXT);
    setIsOpen(false);
  };

  const handleSubmit = (e: any) => {
    onCreate &&
      onCreate({
        promptPackageId: pp?.id,
        name: name,
        description: description,
        modelType: modelType,
      });
    handleClose(); // Close the modal after submitting
  };

  const handleModelTypeChange = (e: any) => {
    setModelType(e.target.value);
  };

  return (
    <Box component="span" sx={{}}>
      <Grid component="span">
        <IconButton
          size="small"
          aria-label="add template"
          onClick={() => setIsOpen(true)}
          color="primary"
        >
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
              <FormLabel>Model Type</FormLabel>
              <Select value={modelType} onChange={handleModelTypeChange}>
                {Object.entries(providerModels).map(
                  ([modelType, modelConfig]) => (
                    <MenuItem
                      key={modelType}
                      value={modelType}
                      disabled={!modelConfig.enabled}
                    >
                      {modelConfig.label}
                    </MenuItem>
                  ),
                )}
              </Select>
            </FormControl>
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
    </Box>
  );
}
