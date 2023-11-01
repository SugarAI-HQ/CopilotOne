import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ headerName }: { headerName: string }) => {
  return (
    <AppBar position="sticky" color="default" className="mb-10">
      <Toolbar>
        <Container maxWidth="lg">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
          >
            <Typography variant="h6" component="div">
              <Link href="/" color="inherit" underline="none">
                {/* <IconButton edge="start" color="inherit" aria-label="menu">
                  <MenuIcon />
                </IconButton> */}
                {headerName}
              </Link>
            </Typography>
            <nav>
              {/* <Link href="/products/pro" color="inherit" underline="none">
                Pro
              </Link>
              <Link href="/products/teams" color="inherit" underline="none">
                Teams
              </Link>
              <Link href="/products" color="inherit" underline="none">
                Pricing
              </Link> */}
              {/* <Link href="https://docs.npmjs.com" color="inherit" underline="none">
                Documentation
              </Link> */}
            </nav>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
