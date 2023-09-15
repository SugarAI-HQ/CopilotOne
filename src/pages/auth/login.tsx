import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import RouteGuard from "~/components/RouteGuard";

export default function Login() {
  

  return (

    <div className="w-full">
      <Typography variant="h5" fontWeight={700}>
        Login
      </Typography>


      <Button
        variant="outlined"
        className="mt-4"
        onClick={() => void signIn()}
      >
        Login
      </Button>
    </div>

  );
}
