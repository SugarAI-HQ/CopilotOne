// pages/index.tsx

import React, { useEffect, useState } from "react";
import Head from "next/head";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import NextAuth from "next-auth";

import { authOptions } from "~/server/auth";

// import { authOptions } from "~/server/auth";

// export default NextAuth(authOptions);

import { signIn, useSession } from "next-auth/react";

export function Login() {
  return (
    <Button color="inherit" variant="outlined" onClick={() => void signIn()}>
      Login
    </Button>
  );
}

function Index() {
  const { data: session } = useSession();
  return (
    <div>
      <Head>
        <title>Sugarcane AI</title>
        {/* Add meta tags and other head elements as needed */}
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sugarcane AI
          </Typography>
          <Login />
        </Toolbar>
      </AppBar>
      <Container sx={{ marginTop: 2 }}>
        <Typography variant="h4" gutterBottom>
          Get Started
        </Typography>
        <Login />
      </Container>
    </div>
  );
}

export default Index;
