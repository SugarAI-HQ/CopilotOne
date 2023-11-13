import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import {
  Link as MUILink,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";

import { api } from "~/utils/api";
import { packageVisibility } from "~/validators/base";
import LikeButton from "./like_button";
import TimeAgo from "react-timeago";
import PromptTags from "./prompt_tags";
import LaunchIcon from "@mui/icons-material/Launch";

function PublicPackages() {
  const { data: packages, refetch: refectchPackages } =
    api.marketplace.getPackages.useQuery({
      visibility: packageVisibility.Enum.PUBLIC,
    });
  return (
    <Grid container spacing={1}>
      {packages && packages.length > 0 ? (
        packages.map((pkg, index) => (
          <Grid item key={index} xs={12} sm={6} md={12} lg={12}>
            <Card
              sx={{
                backgroundColor: "var(--sugarhub-card-color)",
                color: "var(--sugarhub-text-color)",
              }}
            >
              <Grid
                container
                spacing={1}
                sx={{ padding: "1rem", margin: "1rem" }}
              >
                <Grid item xs={12} md={4} lg={4}>
                  <Grid container spacing={1} alignItems={"center"}>
                    <Grid item xs={12} md={2} lg={2}>
                      <Avatar
                        src={pkg?.User?.image || "/default-avatar.png"}
                        alt=""
                        sx={{ width: 42, height: 42, borderRadius: "50%" }}
                      />
                    </Grid>
                    <Grid item xs={12} md={8} lg={8}>
                      <Typography>
                        {`${pkg?.User.username} / ${pkg?.name}`}
                      </Typography>
                    </Grid>
                    <Box sx={{ paddingLeft: "1rem", marginTop: "1rem" }}>
                      <TimeAgo
                        title="Updated at"
                        date={pkg?.updatedAt}
                        style={{ color: "var(--sugarhub-text-color)" }}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={4}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography>
                    {pkg?.description.substring(
                      0,
                      pkg?.description.length > 50
                        ? 50
                        : pkg?.description.length,
                    )}{" "}
                    {pkg?.description.length > 50 ? "..." : ""}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={4}
                  sx={{ paddingRight: "1rem" }}
                  textAlign={"right"}
                >
                  <span>
                    <IconButton
                      href={`/marketplace/packages/${pkg?.id}`}
                      sx={{ color: "var(--sugarhub-text-color)" }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  </span>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))
      ) : (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            padding: "0",
            margin: "0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ color: "var(--sugarhub-text-color)", fontSize: "1.4rem" }}
          >
            No cards created
          </Typography>
        </Box>
      )}
    </Grid>
  );
}

export default PublicPackages;
