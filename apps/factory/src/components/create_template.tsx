import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ModelTypeSchema } from "~/generated/prisma-client-zod.ts";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreateTemplateInput } from "~/validators/prompt_template";
import { createTemplateInput } from "~/validators/prompt_template";
import { FormTextInput } from "./form_components/formTextInput";
import { FormDropDownInput } from "./form_components/formDropDownInput";

export function CreateTemplate({
  pp,
  onCreate,
  sx,
  status,
  customError,
}: {
  pp: pp;
  onCreate: Function;
  sx?: any;
  status: string;
  customError: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<CreateTemplateInput>({
    defaultValues: {
      name: "",
      description: "",
      modelType: ModelTypeSchema.enum.TEXT2TEXT,
      promptPackageId: pp?.id,
    },
    resolver: zodResolver(createTemplateInput),
  });

  useEffect(() => {
    if (customError && customError.error) {
      setError("name", { type: "manual", message: customError.error?.name });
    } else {
      clearErrors("name");
    }
  }, [customError, setError, clearErrors]);

  useEffect(() => {
    if (status === "success") {
      handleClose();
    }
  }, [status]);

  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  const onFormSubmit = (data: CreateTemplateInput) => {
    try {
      onCreate?.(data);
    } catch (err) {
      console.log(err);
    }
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
            <FormDropDownInput
              name="modelType"
              control={control}
              label="Model Type"
            />

            <FormTextInput
              name="name"
              control={control}
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <FormTextInput
              name="description"
              control={control}
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button size="small" onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            size="small"
            onClick={handleSubmit(onFormSubmit)}
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
