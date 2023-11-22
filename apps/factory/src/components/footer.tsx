import { Box, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo1 from "../../public/favicon.png";
const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: "var(--sugarhub-tab-color)",
        padding: "1rem",
        position: "sticky",
        top: "100vh",
      }}
    >
      <Typography
        variant="h6"
        component="div"
        sx={{
          fontWeight: "1000",
          color: "var(--sugarhub-text-color)",
          textAlign: "center",
        }}
      >
        <Link href="/" color="inherit">
          <IconButton sx={{ p: 0, marginRight: "1rem" }}>
            <Image
              src={Logo1.src}
              alt="logo"
              width="40"
              height="40"
              style={{ borderRadius: "50%" }}
            />
          </IconButton>
          Powered by Sugarcane AI
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
