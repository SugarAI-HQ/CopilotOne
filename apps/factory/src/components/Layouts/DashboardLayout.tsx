import * as React from "react";
import type { ReactElement } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SidebarProfile from "~/components/SidebarProfile";
import { mainListItems, secondaryListItems } from "~/app/dashboard/listItems";
import RouteGuard from "../RouteGuard";
import { useRouter } from "next/router";
import { MdSettings, MdShare } from "react-icons/md";
import PreferencesModal from "../PreferencesDialog";
import SharePackageDialog from "../SharePackageDialog";
import BugReport from "~/components/Layouts/bug_report";
import LikeButton from "~/components/marketplace/like_button";
import { Chip, Icon } from "@mui/material";
// import Chart from './Dashboard/Chart';
// import Deposits from './Dashboard/Deposits';
// import Orders from './Dashboard/Orders';

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      g{"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export function Dashboard({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [preferencesOpen, setPreferencesOpen] = React.useState(false);
  const [sharePackageOpen, setSharePackageOpen] = React.useState(false);

  const handleOpen = () => {
    setPreferencesOpen(true);
  };

  const handleClose = () => {
    setPreferencesOpen(false);
  };

  const handleSharePackageOpen = () => {
    setSharePackageOpen(true);
  };

  const handleSharePackageClose = () => {
    setSharePackageOpen(false);
  };
  const router = useRouter();

  // Check if the current route matches the pattern '/dashboard/prompts/[id]'
  const isPromptsRoute = router.pathname.startsWith("/dashboard/prompts/");

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            ></Typography>
            {isPromptsRoute && (
              <div className="flex items-center gap-3">
                <IconButton onClick={handleOpen} color="inherit">
                  <MdSettings />
                </IconButton>
                {/* <LikeButton count={1008}></LikeButton> */}
                <Button
                  onClick={handleSharePackageOpen}
                  startIcon={<MdShare />}
                  variant="outlined"
                  color="inherit"
                  // sx={{ borderRadiuss: "40px" }}
                  size="small"
                >
                  Share
                </Button>
                <BugReport></BugReport>
              </div>
            )}
            {/* <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: [2],
            }}
          >
            <Typography variant="h5">
              Sugar Factory
              <Chip sx={{ m: 1 }} size="small" label="β"></Chip>
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
          <SidebarProfile />
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={1}>
              {children}
            </Grid>
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
          <SharePackageDialog
            open={sharePackageOpen}
            onClose={handleSharePackageClose}
          />
          <PreferencesModal open={preferencesOpen} onClose={handleClose} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export const getLayout = (page: ReactElement) => (
  <DashboardLayout>{page}</DashboardLayout>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <Dashboard>{children}</Dashboard>
    </RouteGuard>
  );
}
