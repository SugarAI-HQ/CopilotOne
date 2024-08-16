import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import VoiceChatIcon from "@mui/icons-material/VoiceChat";
import DocumentScanner from "@mui/icons-material/DocumentScanner";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Dataset from "@mui/icons-material/Dataset";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Link from "next/link";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";

export const mainListItems = (
  <React.Fragment>
    <Link href="/dashboard">
      <ListItemButton>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
    </Link>
    <Link href="/dashboard/copilots">
      <ListItemButton>
        <ListItemIcon>
          <PrecisionManufacturingIcon />
        </ListItemIcon>
        <ListItemText primary="Copilots" />
      </ListItemButton>
    </Link>
    <Link href="/dashboard/forms">
      <ListItemButton>
        <ListItemIcon>
          <VoiceChatIcon />
        </ListItemIcon>
        <ListItemText primary="Forms" />
      </ListItemButton>
    </Link>
    <Link href="/dashboard/prompts">
      <ListItemButton>
        <ListItemIcon>
          <DocumentScanner />
        </ListItemIcon>
        <ListItemText primary="Packages" />
      </ListItemButton>
    </Link>

    <Link href="/settings/api-keys">
      <ListItemButton>
        <ListItemIcon>
          <LockOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="API Keys" />
      </ListItemButton>
    </Link>
    {/* <Link href="/dashboard/dataset">
      <ListItemButton >
        <ListItemIcon>
          <Dataset />
        </ListItemIcon>
        <ListItemText primary="Dataset" />
      </ListItemButton>
    </Link> */}
    {/*
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Integrations" />
    </ListItemButton> */}
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Components
    </ListSubheader> */}

    <Link href="/marketplace/packages" target="blank">
      <ListItemButton>
        <ListItemIcon>
          <LocalGroceryStoreIcon />
        </ListItemIcon>
        <ListItemText primary="Sugar Hub" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);
