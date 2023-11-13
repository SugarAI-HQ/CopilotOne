import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import PublicPackages from "~/components/marketplace/public_package";

const MarketplacePage: NextPage = () => {
  return (
    <>
      <Box
        sx={{
          backgroundColor: "var(--sugarhub-main-color)",
          height: "100vh",
          width: "100vw",
          overflowY: "scroll",
        }}
      >
        <Header headerName={`sugarhub`}></Header>
        <Container>
          <PublicPackages></PublicPackages>
        </Container>
      </Box>
    </>
  );
};

export default MarketplacePage;

// <Typography variant="h4">{packageData.name}</Typography>
// <Typography variant="subtitle1">
// Description: {packageData.description}
// </Typography>
// <Typography variant="subtitle1">
// Author: {packageData.author}
// </Typography>
// <Typography variant="subtitle1">
// Version: {packageData.version}
// </Typography>
