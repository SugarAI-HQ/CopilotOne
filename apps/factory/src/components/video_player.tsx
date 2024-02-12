import { useEffect, useState } from "react";
import { Box, Card, CircularProgress, Grid } from "@mui/material";
import ReactPlayer from "react-player";
import { signIn, useSession } from "next-auth/react";

type VideoPlayerProps = {
  videoLink: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoLink }) => {
  const [isClient, setIsClient] = useState<boolean>(false);
  const session = useSession();
  const handleVideoPlayerClick = () => {
    if (!session.data?.user) {
      signIn();
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Card
        sx={{
          backgroundColor: "var(--sugarhub-card-color)",
          color: "var(--sugarhub-text-color)",
        }}
      >
        <Box>
          {isClient ? (
            <Box flex={1}>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: session.data?.user ? -1 : 1,
                    cursor: "pointer",
                  }}
                  onClick={handleVideoPlayerClick}
                />
                <ReactPlayer
                  url={videoLink}
                  className="react-player"
                  controls
                  width={"100%"}
                  height={"60vh"}
                />
              </div>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Card>
    </>
  );
};
export default VideoPlayer;
