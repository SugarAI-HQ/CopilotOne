import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Link as MUILink,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import { CreatePackage } from "~/components/create_package";
import { api } from "~/utils/api";
import { MutationObserverSuccessResult } from "@tanstack/react-query";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import toast from "react-hot-toast";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { useRouter } from "next/router";

function Packages() {
  const { data: packages, refetch: refectchPackages } =
    api.prompt.getPackages.useQuery({});
  return (
    <Grid container spacing={1}>
      {packages && packages.length > 0 ? (
        packages.map((pkg, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardHeader title={pkg?.name} />
              <CardContent>
                <Typography>{pkg?.description}</Typography>
              </CardContent>
              <CardActions>
                <Chip
                  sx={{ mr: 2 }}
                  size="small"
                  label={pkg?.visibility}
                  // variant="conti"
                />
                <MUILink href={`/dashboard/prompts/${pkg?.id}`}>View</MUILink>
                <MUILink href={`/dashboard/prompts/${pkg?.id}/logs`}>
                  Logs
                </MUILink>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography>No cards created</Typography>
        </Grid>
      )}
    </Grid>
  );
}

const PackageHome = () => {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [customError, setCustomError] = useState({});

  function handlePackageCreationSuccess(createdPackage: pp) {
    setStatus("success");
    toast.success("Package Created Successfully");
    router.push("/dashboard/prompts/" + createdPackage?.id);
  }

  const mutation = api.prompt.createPackage.useMutation({
    onError: (error) => {
      const errorData = JSON.parse(error.message);
      setCustomError(errorData);
    },
    onSuccess: (createdPackage) => {
      if (createdPackage !== null) {
        setCustomError({});
        handlePackageCreationSuccess(createdPackage);
      } else {
        // Handle the case where createdPackage is null
        // This can happen if the mutation result is null
        // You might want to show an error message or handle it in another way
        toast.error("Something went wrong, Please try again");
      }
    },
  });

  // console.log("mutate", mutation);
  return (
    <>
      <CreatePackage
        onSubmit={mutation.mutate}
        status={status}
        customError={customError}
      ></CreatePackage>
      <Packages />
    </>
  );
};
PackageHome.getLayout = getLayout;
export default PackageHome;
