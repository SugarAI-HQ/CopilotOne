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
import { useRouter } from "next/router";

export default function SidebarProfile() {
    const router = useRouter()
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );

    function handleProfileCardClick(){
        router.push('/profile')
    }

  return (
   <> {sessionData && 
      <div className="w-full p-3 absolute bottom-0">
        <Card className="flex gap-2 px-2 py-3 cursor-pointer" onClick={handleProfileCardClick}>
          <Avatar
            className="h-8 w-8"
            alt="Profile Image"
            src={sessionData && sessionData.user?.image}
          />
          <div>
            <Typography sx={{ fontSize: 16 }}>
              {sessionData && sessionData.user?.name}
            </Typography>
            <Typography sx={{ fontSize: 14 }}>
              {sessionData && sessionData.user?.email}
            </Typography>
          </div>
          
        </Card>
        <Divider className="mt-4 mb-1"/>
        <Button className="w-full"
          onClick={() => void signOut()}
        >
        Logout
        </Button>
      </div>}
      </>
  );
}
