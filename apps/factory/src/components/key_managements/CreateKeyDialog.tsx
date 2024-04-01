import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { randomBytes } from "crypto";
import { KeyOutput } from "~/validators/api_key";

type FormValues = {
  name: string;
};

type CreateKeyDialogProps = {
  userId: string;
  setNewKey: (key: KeyOutput) => void;
};

const CreateKeyDialog: React.FC<CreateKeyDialogProps> = ({
  userId,
  setNewKey,
}) => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<FormValues>();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    reset();
    clearErrors("name");
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const createKeyMutation = api.apiKey.createKey.useMutation();

  const handleFormSubmit = (data: FormValues) => {
    const apiKey = generateApiKey();
    createKeyMutation.mutate(
      { name: data.name, apiKey: apiKey, userId: userId },
      {
        onSuccess(response) {
          setNewKey(response);
          toast.success("Key created successfully");
          handleClose();
        },
        onError(error) {
          const errorData = JSON.parse(error.message);

          setError("name", {
            type: "manual",
            message: errorData.error?.message,
          });
        },
      },
    );
    console.log("Form data:", data);
    handleClose();
  };

  function generateApiKey(length = 48) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    let apiKey = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      apiKey += characters.charAt(randomIndex);
    }

    return `pk-${apiKey}`;
  }

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        onClick={handleOpen}
        startIcon={<AddCircle />}
      >
        Create new secret key
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Secret Key</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              fullWidth
              {...register("name", { required: true })}
              error={!!errors.name}
              helperText={errors.name ? "Name is required" : ""}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            onClick={handleSubmit(handleFormSubmit)}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateKeyDialog;
