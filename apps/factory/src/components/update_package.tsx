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

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  packageId: string;
  updateArray(id: string, description: string): void;
}

const UpdatePackage = ({ open, setOpen, packageId, updateArray }: Props) => {
  const [name, setName] = useState<string | undefined>("");

  // zod schema
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreatePackageInput>({
    resolver: zodResolver(createPackageInput),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const input = {
    id: `${packageId}`,
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

  const submitData = (data: CreatePackageInput) => {
    updateArray(packageId, data.description);
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
              <FormLabel>Description of Package</FormLabel>
              <TextField
                variant="outlined"
                value={name}
                helperText="(allowed: a-z, 0-9, - )"
              />
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
                  <span>Share the package with anyone on internet</span>
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

export default UpdatePackage;
