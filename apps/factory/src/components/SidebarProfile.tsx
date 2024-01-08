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
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function SidebarProfile() {
  const router = useRouter();
  const { data: sessionData } = useSession();

  async function handleProfileCardClick() {
    await router.push("/dashboard/profile");
  }

  return (
    <>
      {" "}
      {sessionData && (
        <div className="absolute bottom-0 w-full p-3">
          <Card
            className="flex cursor-pointer items-center gap-2 px-2 py-3"
            onClick={handleProfileCardClick}
          >
            <Avatar
              className="h-8 w-8"
              alt="Profile Image"
              src={sessionData?.user?.image || "/images/avatar.png"}
            />
            <div>
              <Typography sx={{ fontSize: 16 }}>
                {sessionData?.user?.username}
              </Typography>
              <Typography sx={{ fontSize: 14 }}>
                {sessionData?.user?.email}
              </Typography>
            </div>
          </Card>
          <Divider
            sx={{
              marginTop: "16px",
              marginBottom: "4px",
            }}
          />
          <Button className="w-full" onClick={() => void signOut()}>
            Logout
          </Button>
        </div>
      )}
    </>
  );
}
