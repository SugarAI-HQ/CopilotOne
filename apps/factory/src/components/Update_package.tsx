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
import { packageVisibility, PackageVisibility } from "~/validators/base";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createPackageInput,
  CreatePackageInput,
} from "~/validators/prompt_package";

const Update_package = ({ open, setOpen, pckid, updateArray }) => {
  const [name, setName] = useState<string | undefined>("");

  // zod schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
    watch,
    setValue,
  } = useForm<CreatePackageInput>({
    resolver: zodResolver(createPackageInput),
  });

  const input = {
    id: `${pckid}`,
    visibility: packageVisibility.Enum.PUBLIC,
  };

  api.prompt.getPackage.useQuery(input, {
    onSuccess(items) {
      reset({
        name: items?.name,
        description: items?.description,
        visibility: items?.visibility,
      });
      setName(items?.name);
    },
  });

  const mutation = api.prompt.updatePackage.useMutation();

  const submitData = (data: CreatePackageInput) => {
    // call api to update paticular package
    const input = {
      id: pckid as string,
      name: data.name,
      description: data.description,
      visibility: data.visibility,
    };

    mutation.mutate(input, {
      onSuccess() {
        updateArray(input);
        toast.success("Package Updated Successfully");
      },
      onError(error) {
        const errorData = JSON.parse(error.message);
        console.log("error for already existing name", errorData);
        setError("name", { type: "manual", message: errorData.error?.name });
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Update Prompt Package</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <FormLabel>Name</FormLabel>
              <TextField variant="outlined" value={name} />
            </FormControl>
            {errors.name && (
              <p style={{ color: "red" }}>{errors.name.message}</p>
            )}

            <FormControl fullWidth>
              <FormLabel>Description</FormLabel>
              <TextField variant="outlined" {...register("description")} />
            </FormControl>

            <FormControl component="fieldset">
              <FormLabel component="legend">Visibility</FormLabel>
              <RadioGroup aria-label="visibility">
                <FormControlLabel
                  value={packageVisibility.Enum.PUBLIC}
                  control={<Radio />}
                  label="Public"
                  id="public-radio"
                  checked={
                    watch("visibility") === packageVisibility.Enum.PUBLIC
                  }
                />
                <FormControlLabel
                  value={packageVisibility.Enum.PRIVATE}
                  control={<Radio />}
                  label="Private"
                  id="private-radio"
                  checked={
                    watch("visibility") === packageVisibility.Enum.PRIVATE
                  }
                />
              </RadioGroup>
              <div>
                {watch("visibility") === packageVisibility.Enum.PUBLIC ? (
                  <span>
                    Anyone on the internet can use this package. You choose who
                    can edit.
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
            onClick={handleSubmit(submitData)}
            variant="outlined"
            color="primary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Update_package;
