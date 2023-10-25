import React, { useEffect, useState } from "react";
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
import { packageVisibility } from "~/validators/base";
import { api } from "~/utils/api";
import { PackageVisibility } from "~/validators/base/PackageVisibility";
import toast from "react-hot-toast";

const Update_package = ({
  open,
  setOpen,
  pckid,
  updateArray,
  checkNameExistence,
}) => {
  //   const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();
  const [visibility, setVisibility] = React.useState<PackageVisibility>(
    packageVisibility.Enum.PUBLIC,
  );

  const handleClose = () => {
    setName("");
    setDescription("");
    setOpen(false);
  };

  useEffect(() => {
    console.log("id of the user", pckid);
  }, [pckid]);

  const input = {
    id: `${pckid}`,
    visibility: packageVisibility.Enum.PUBLIC,
  };

  api.prompt.getPackage.useQuery(input, {
    onSuccess(items) {
      setName(items?.name);
      setDescription(items?.description);
      setVisibility(items?.visibility);
    },
  });

  // const mutation = api.prompt.updatePackage.useMutation( )

  const handleSubmit = () => {
    // call api to update paticular package
    // console.log(name, description, visibility)

    // add condition to check whether the name of package exists or not
    // if(checkNameExistence(name)){
    //   console.log("somethign")
    //   toast.error("Package name already exists")
    //   return
    // }
    const input = {
      id: pckid as string,
      name: name!,
      description: description!,
      visibility: visibility,
    };
    // mutation.mutate( input )
    // console.log("input", input)
    updateArray(input);
    // toast.success("Package Updated Successfully");

    // handleClose(); // Close the modal after submitting
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h6">Update Prompt Package</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <p>{pckid}</p>
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
                defaultValue={visibility}
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <FormControlLabel
                  value={packageVisibility.Enum.PUBLIC}
                  control={<Radio />}
                  label="Public"
                  id="public-radio"
                />
                <FormControlLabel
                  value={packageVisibility.Enum.PRIVATE}
                  control={<Radio />}
                  label="Private"
                  id="private-radio"
                />
              </RadioGroup>
              <div>
                {visibility === packageVisibility.Enum.PUBLIC ? (
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
};

export default Update_package;
