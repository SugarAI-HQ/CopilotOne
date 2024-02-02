import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Radio,
  Box,
  Tooltip,
  IconButton,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { PackageOutput as pp } from "~/validators/prompt_package";
import {
  DeployTemplateInput,
  TemplateOutput as pt,
} from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { PromptIntegration } from "./integration/prompt_integration";
import { VersionSchema } from "~/validators/prompt_version";
import PublicUrl from "~/components/integration/public_url";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import { LoadingButton } from "@mui/lab";
import Divider from "@mui/material/Divider";
import CopyToClipboardButton from "./copy_button";
import InputBase from "@mui/material/InputBase";

function PromptDeploy({
  ns,
  pp,
  pt,
  pv,
  onUpdate,
}: {
  ns: any;
  pp: pp;
  pt: pt;
  pv: VersionSchema;
  onUpdate: Function;
}) {
  const [version, setVersion] = useState<VersionSchema>(pv);
  // console.log(`published: ${version.version} ${version.publishedAt} `);
  const [open, setOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(
    !!version.publishedAt,
  );
  const [changelog, setChangelog] = useState(version.changelog);

  const [environmentType, setEnvironmentType] = React.useState("preview");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("Choose wisely");

  const handleDeployOption = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnvironmentType((event.target as HTMLInputElement).value);
    setHelperText("This action cannot be undone.");
    setError(false);
  };

  const deployMutation = api.prompt.deployTemplate.useMutation({
    onSuccess: (data: any) => {
      console.log(">>>>>>>>>>> Deployed");
      console.log(data.pt);
      console.log(data.pv);
      console.log("<<<<<<<< Deployed");
      if (data.pv !== null) {
        setVersion(data.pv);
        onUpdate(data.pv, data.pt);
        setIsDeploying(false);
        setDeploymentSuccess(!!data.pv.publishedAt);
        toast.success("Deployed Successfully");
      }
    },
  });

  const handleDeployCode = () => {
    // Start deployment animation
    setIsDeploying(true);

    deployMutation.mutate({
      promptTemplateId: version.promptTemplateId,
      promptPackageId: pt?.promptPackageId,
      promptVersionId: version.id,

      environment: environmentType,
      changelog: changelog,
    } as DeployTemplateInput);

    // Simulate deployment delay with a timeout (you can replace this with your actual deployment logic)
    // setTimeout(() => {
    //     // Stop deployment animation and show success
    //     setIsDeploying(false);
    //     setDeploymentSuccess(true);

    // }, 2000); // Adjust the timeout duration to simulate deployment time
  };

  const handleChangelog = (text: string) => {
    setChangelog(text);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setTimeout(() => {
      // Stop deployment animation and show success
      setIsDeploying(false);
      setDeploymentSuccess(!!version.publishedAt);
    }, 1000);
  };
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/${ns?.username}/${pp?.name}/${pt?.name}/${environmentType}`;
  return (
    <span>
      {version.publishedAt ? (
        <Tooltip title={`Published Version`} placement="top-start">
          <LoadingButton
            color="success"
            variant="outlined"
            onClick={handleOpenModal}
            loadingPosition="start"
            startIcon={<PublishedWithChangesIcon />}
            sx={{ width: "9rem", height: "100%" }}
          >
            <>Published</>
          </LoadingButton>
        </Tooltip>
      ) : (
        <Tooltip title={`Publish Cube`} placement="top-start">
          <LoadingButton
            color="success"
            variant="outlined"
            onClick={handleOpenModal}
            loadingPosition="start"
            startIcon={<RocketLaunchIcon />}
            sx={{ width: "11rem", height: "100%" }}
          >
            <>Publish Cube</>
          </LoadingButton>
        </Tooltip>
      )}
      <Dialog
        sx={{ m: 2, p: 2 }}
        open={open}
        onClose={handleCloseModal}
        maxWidth={"md"}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <DialogTitle style={{ flex: 1 }}>
            {deploymentSuccess ? (
              <p className="pt-2">Published Successfully</p>
            ) : (
              <p className="ml-3">Publish App</p>
            )}
          </DialogTitle>
        </Box>
        <DialogContent>
          {/* <Typography></Typography>
          <Typography gutterBottom variant="h5" component="div"></Typography>
          <Typography variant="body2" color="text.secondary"></Typography> */}
          {isDeploying ? (
            <div>
              <CircularProgress />
              <p>Deploying prompt...</p>
            </div>
          ) : deploymentSuccess ? (
            <div>
              <Typography className="pr-2">
                Link for Sugar Cube Application
              </Typography>
              <Box
                sx={{
                  p: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  margin: "1rem 0",
                  backgroundColor: "var(--modal-bg-color)",
                  borderColor: "var(--sugarhub-ternary-bg-color)",
                  borderWidth: "1px",
                }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  disabled={true}
                  value={link}
                />
                <CopyToClipboardButton
                  textToCopy={link}
                  textToDisplay={"Copy to Clipboard"}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton sx={{ p: "10px" }} aria-label="directions">
                  <PublicUrl title={"Public URL"} url={`${link}`} />
                </IconButton>
              </Box>
              <Typography variant="h6" sx={{ margin: "2rem 0 1rem 0" }}>
                API Endpoints
              </Typography>
              <PromptIntegration
                ns={ns}
                pp={pp}
                pt={pt}
                pv={pv as pv}
              ></PromptIntegration>
              <Button color="primary" onClick={handleCloseModal}>
                Close
              </Button>
            </div>
          ) : (
            <div>
              <Typography sx={{ ml: 3 }}>
                Publish Version: {pv.version}
              </Typography>

              <form onSubmit={handleDeployCode}>
                <FormControl sx={{ m: 3 }} error={error} variant="standard">
                  <FormLabel id="deployType">Environment</FormLabel>
                  <RadioGroup
                    aria-labelledby="environment type"
                    name="Environment Type"
                    value={environmentType}
                    onChange={handleDeployOption}
                  >
                    <FormControlLabel
                      value="preview"
                      control={<Radio />}
                      label="Preview - For Internal Use"
                    />
                    <FormControlLabel
                      value="release"
                      control={<Radio />}
                      label="Release - For Public Use"
                    />
                  </RadioGroup>
                  <FormHelperText>{helperText}</FormHelperText>

                  <TextField
                    sx={{ mt: 2 }}
                    minRows={5}
                    maxRows={10}
                    label="Add Publish Comment"
                    variant="outlined"
                    value={changelog}
                    onChange={(e) => handleChangelog(e.target.value)}
                    // onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />

                  <Typography
                    sx={{ mt: 2 }}
                    variant="body2"
                    color="text.secondary"
                  >
                    Are you sure you want to deploy the code?
                    <br />
                    This action cannot be undone
                  </Typography>

                  {/* <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                                        Check Answer
                                        </Button> */}
                </FormControl>
              </form>
            </div>
          )}
        </DialogContent>
        {!deploymentSuccess && <Divider />}

        <DialogActions>
          {isDeploying ? null : deploymentSuccess ? null : (
            <Button onClick={handleCloseModal} color="primary">
              Cancel
            </Button>
          )}
          {isDeploying ? null : deploymentSuccess ? null : (
            <Button onClick={handleDeployCode} color="primary">
              Publish
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </span>
  );
}

export default PromptDeploy;
