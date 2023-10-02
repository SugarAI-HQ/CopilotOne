import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import { Link as MUILink, Typography, Grid } from "@mui/material";

import { api } from "~/utils/api";
import { packageVisibility } from "~/validators/base";

function PublicPackages() {
  const { data: packages, refetch: refectchPackages } =
    api.marketplace.getPackages.useQuery({
        visibility: packageVisibility.Enum.PUBLIC
    });
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
                <MUILink href={`/marketplace/packages/${pkg?.id}`}>View</MUILink>
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

export default PublicPackages