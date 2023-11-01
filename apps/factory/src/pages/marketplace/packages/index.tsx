import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import PublicPackages from "~/components/marketplace/public_package";

const MarketplacePage: NextPage = () => {
  return (
    <>
      <Header headerName={"Sugar Hub"}></Header>
      <Container>
        <PublicPackages></PublicPackages>
      </Container>
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
