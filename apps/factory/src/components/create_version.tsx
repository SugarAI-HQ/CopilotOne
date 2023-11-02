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
  Tooltip,
  Typography,
} from "@mui/material";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import {
  CreateVersionInput,
  VersionOutput as pv,
} from "~/validators/prompt_version";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { parse, valid } from "semver";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import ForkRightIcon from "@mui/icons-material/ForkRight";

CreateVersion.defaultProps = {
  icon: <AddCircleIcon />,
  forkedFromId: null,
  v: "0.0.1",
};
export function CreateVersion({
  pp,
  pt,
  onCreate,
  icon,
  forkedFromId,
  v,
}: {
  pp: pp;
  pt: pt;
  icon?: React.JSX.Element;
  v: string;
  onCreate: Function;
  forkedFromId: string | null;
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
        onCreate(pv);
        handleClose();
        toast.success(`Version ${pv.version} Created Successfully`);
      }
    },
  });

  const handleSubmit = (e: any) => {
    const data = {
      promptPackageId: pp?.id,
      promptTemplateId: pt?.id,
      version: version,
      forkedFromId: forkedFromId,
      moduleType: pt?.modelType,
    };
    pvCreateMutation.mutate(data as CreateVersionInput);
  };

  return (
    <>
      <Grid component="span">
        {/* <Button
          variant="outlined"
          startIcon={<AddCircleIcon />}
          size="small"
          aria-label="add version"
          onClick={() => setIsOpen(true)}
          color="primary"
        >
          New Version
        </Button> */}
        <Tooltip
          title={forkedFromId ? "Fork" : "Add Version"}
          placement="top-start"
        >
          <IconButton
            size="small"
            aria-label="add template"
            onClick={() => setIsOpen(true)}
            color="primary"
          >
            {forkedFromId ? <ForkRightIcon /> : <AddCircleIcon />}
          </IconButton>
        </Tooltip>
      </Grid>

      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm">
        <DialogTitle>New Prompt Version</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>

          <Stack spacing={2} mt={2}>
            <FormControl>
              <FormLabel>Version</FormLabel>
              <TextField
                variant="outlined"
                value={version}
                error={!valid(version)}
                onChange={(e) => setVersion(e.target.value)}
                helperText={"Use semantic versioning (e.g. 1.0.1)"}
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
