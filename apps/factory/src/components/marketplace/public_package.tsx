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
  CircularProgress,
  Pagination,
} from "@mui/material";

import { api } from "~/utils/api";
import { packageVisibility } from "~/validators/base";
import LikeButton from "./like_button";
import TimeAgo from "react-timeago";
import PromptTags from "./prompt_tags";
import LaunchIcon from "@mui/icons-material/Launch";
import { useRouter } from "next/router";

function PublicPackages() {
  const router = useRouter();
  const page: number | undefined =
    parseInt(router.query.page as string, 10) || undefined;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    router.push({
      query: { ...router.query, page },
    });
  };

  const {
    data: packages,
    isLoading,
    refetch: refectchPackages,
  } = api.marketplace.getMarketPlacePackages.useQuery({
    visibility: packageVisibility.Enum.PUBLIC,
    pageNo: page,
  });

  return (
    <Grid container spacing={1}>
      {isLoading ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : packages && packages.length > 0 ? (
        <>
          {packages.map((pkg, index) => (
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
                  sx={{ padding: "0.5rem", margin: "0.5rem" }}
                >
                  <Grid item xs={12} md={4} lg={4}>
                    <Grid container spacing={1} alignItems={"center"}>
                      <Grid item xs={2} md={2} lg={2}>
                        <Avatar
                          src={pkg?.User?.image || "/default-avatar.png"}
                          alt=""
                          sx={{ width: 42, height: 42, borderRadius: "50%" }}
                        />
                      </Grid>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography>
                          {`${pkg?.User.username} / ${pkg?.name}`}
                        </Typography>
                        <Typography>
                          <TimeAgo
                            title="Updated at"
                            date={pkg?.updatedAt}
                            style={{ color: "var(--sugarhub-text-color)" }}
                          />
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={7}
                    lg={7}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <Typography
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: "2",
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {pkg?.description}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={1}
                    lg={1}
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
          ))}
        </>
      ) : (
        <Box
          sx={{
            width: "100vw",
            height: "60vh",
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
            No cards found
          </Typography>
        </Box>
      )}
      <Grid
        item
        sx={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pagination
          onChange={handlePageChange}
          count={20}
          variant="outlined"
          shape="rounded"
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              backgroundColor: "Highlight",
              color: "white",
            },
            padding: 2,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default PublicPackages;
