import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Link as MUILink, Typography, Grid } from "@mui/material";
import { CreatePackage } from "~/components/create_package";
import { api } from "~/utils/api";



function Packages() {
  const { data: packages } = api.prompt.getPackages.useQuery({});
  return (
    <Grid container spacing={1}>
      {packages && packages.length > 0 ? (
        packages.map((pkg, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <Card>
              <CardHeader title={pkg.name} />
              <CardContent>
                <Typography>{pkg.description}</Typography>
              </CardContent>
              <CardActions>
                <MUILink href={`/prompts/${pkg.id}`}>View</MUILink>
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

export default function PackageHome() {
  const mutation = api.prompt.createPackage.useMutation();
  return (
    <>
      <CreatePackage onSubmit={mutation.mutate}></CreatePackage>
      <Packages />
    </>
  );
}
