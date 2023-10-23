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
import { getLayout } from "~/components/Layouts/DashboardLayout";

const Profile = () => {
  const { data: sessionData } = useSession();
  return (
    <RouteGuard>
      <div className="w-full">
        <Typography variant="h5" fontWeight={700}>
          Profile
        </Typography>

        <Card className="mt-3" variant="outlined" sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Account
            </Typography>
            <Divider
              className="my-4"
              sx={{ marginTop: "16px", marginBottom: "16px" }}
            />

            <Avatar
              className="h-16 w-16"
              alt="Profile Image"
              src={sessionData?.user?.image || "/images/avatar.png"}
            />

            <Typography sx={{ fontSize: 16, marginTop: "16px" }} gutterBottom>
              {sessionData?.user?.username}
            </Typography>
            <Typography sx={{ fontSize: 14 }} gutterBottom>
              {sessionData?.user?.email}
            </Typography>
          </CardContent>
        </Card>

        <Button
          variant="outlined"
          sx={{
            marginTop: "16px",
          }}
          onClick={() => void signOut()}
        >
          Logout
        </Button>
      </div>
    </RouteGuard>
  );
};
Profile.getLayout = getLayout;

export default Profile;
