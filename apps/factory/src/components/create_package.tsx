import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { packageVisibility } from "~/validators/base";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CreatePackageInput } from "~/validators/prompt_package";
import { createPackageInput } from "~/validators/prompt_package";
import { FormTextInput } from "./form_components/formTextInput";
import { FormRadioInput } from "./form_components/formRadioInput";

export function CreatePackage({
  onSubmit,
  status,
  customError,
  PackagesExits,
}: {
  onSubmit: Function;
  status: string;
  customError: any;
  PackagesExits: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    watch,
    reset,
  } = useForm<CreatePackageInput>({
    defaultValues: {
      name: "",
      description: "",
      visibility: packageVisibility.enum.PUBLIC,
    },
    resolver: zodResolver(createPackageInput),
    mode: "onChange",
    reValidateMode: "onChange",
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

  const onFormSubmit = (data: CreatePackageInput) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Grid container justifyContent={PackagesExits ? "flex-end" : "center"}>
        <Button size="small" variant="outlined" onClick={() => setIsOpen(true)}>
          Create Prompt Package
        </Button>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Create New Prompt Package</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormTextInput
              name="name"
              control={control}
              label="Package Name"
              error={!!errors.name}
              helperText={
                errors.name?.message
                  ? errors.name?.message
                  : "(allowed: a-z, 0-9, - )"
              }
              readonly={false}
            />

            <FormTextInput
              name="description"
              control={control}
              label="Description of Package"
              error={!!errors.description}
              helperText={
                errors.description?.message ? errors.description?.message : ""
              }
              readonly={false}
            />

            <FormRadioInput
              name={"visibility"}
              control={control}
              label="Package Visibility"
            />
            <div>
              {watch("visibility") === packageVisibility.Enum.PUBLIC ? (
                <span>Share the package with anyone on internet</span>
              ) : (
                <span>You choose who can see and commit to this package.</span>
              )}
            </div>
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
    </>
  );
}
