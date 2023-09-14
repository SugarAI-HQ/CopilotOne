// pages/index.tsx

import React from 'react';
import Head from 'next/head';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

function HomePage() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Head>
          <title>sugarcane.ai</title>
          {/* Add meta tags and other head elements as needed */}
        </Head>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              sugarcane.ai
            </Typography>
            <Button color="inherit">Contact</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ marginTop: 2 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to sugarcane.ai
          </Typography>
          <Typography variant="body1" paragraph>
            We are an AI-based company specializing in cutting-edge AI solutions.
          </Typography>
          <Button variant="contained" color="primary">
            Learn More
          </Button>
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default HomePage;
