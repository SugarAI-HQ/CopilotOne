import { Box, Grid, Typography, Tooltip, IconButton } from "@mui/material";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { GetBlogOutput } from "~/validators/blog";
import { useRouter } from "next/router";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ShareIcon from "@mui/icons-material/Share";
import ShareCube from "./cubes/share_cube";
import styles from "../styles/CustomMarkdown.module.css";

type VideoDetailsProps = {
  blogData: GetBlogOutput;
};

const VideoDetails: React.FC<VideoDetailsProps> = ({ blogData }) => {
  const [openShareModal, setOpenShareModal] = useState<string>("");
  const router = useRouter();

  return (
    <>
      <Box
        sx={{
          paddingLeft: 2,
          paddingRight: 2,
          backgroundColor: "inherit",
          color: "var(--sugarhub-text-color)",
        }}
      >
        <Grid
          container
          sx={{
            display: "flex",
            flexDirection: "row",
            color: "GrayText",
            paddingTop: 2,
          }}
        >
          <Grid
            item
            sm={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 4,
            }}
          >
            <FaFolder />
            <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>
              {blogData?.tags?.toString().split(",").join(", ")}
            </Typography>
          </Grid>
          <Grid
            item
            sm={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <FaRegClock />
            <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>
              {blogData?.publishedAt
                ? blogData?.publishedAt.toDateString()
                : "Publish Date"}
            </Typography>
            <Tooltip title="Share Video" placement="top">
              <IconButton onClick={() => setOpenShareModal("sharevideo")}>
                <ShareIcon
                  sx={{
                    color: "var(--sugarhub-ternary-bg-color)",
                    fontSize: "1.5rem",
                  }}
                />
              </IconButton>
            </Tooltip>
            <ShareCube
              setOpenShareModal={setOpenShareModal}
              open={openShareModal}
              shareUrl={`${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`}
              shareTitle={"Share Video"}
            />
          </Grid>
        </Grid>
        <Typography sx={{ fontSize: 28, fontWeight: "bold", paddingTop: 3 }}>
          {blogData?.title}
        </Typography>

        <Box
          sx={{ paddingTop: 2, paddingBottom: 2 }}
          className={styles.customMarkdown}
        >
          {
            <Markdown remarkPlugins={[remarkGfm]}>
              {blogData?.description}
            </Markdown>
          }
        </Box>
      </Box>
    </>
  );
};
export default VideoDetails;
