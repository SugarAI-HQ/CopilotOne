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

export default function Profile() {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

  return (
    <div className="w-full">
      <Typography variant="h5" fontWeight={700}>
        Profile
      </Typography>

      <Card className="mt-3" variant="outlined" sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Profile
          </Typography>
          <Divider className="my-4" />
          <Avatar className="h-16 w-16" alt="Profile Image" />

          <Typography sx={{ fontSize: 16 }} className="mt-4" gutterBottom>
            Vipul Patil
          </Typography>
          <Typography sx={{ fontSize: 14 }} gutterBottom>
            vipulrpatil.8@gmail.com
          </Typography>
        </CardContent>
      </Card>

      <Button
        variant="outlined"
        className="mt-4"
        onClick={() => void signOut()}
      >
        Logout
      </Button>
    </div>
  );
}
