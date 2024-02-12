import { Box, Grid, Typography, Tooltip, IconButton } from "@mui/material";
import React, { useState } from "react";
import { FaFolder } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa";
import { GetBlogOutput } from "~/validators/blog";
import { useRouter } from "next/router";
// import remarkGfm from "remark-gfm";
// import remarkAutolinkHeadings from "remark-autolink-headings";
// import rehypeConcatCssStyle from "rehype-concat-css-style";
import { MuiMarkdown } from "mui-markdown";
import ShareIcon from "@mui/icons-material/Share";
import ShareCube from "./cubes/share_cube";

type VideoDetailsProps = {
  blogData: GetBlogOutput;
};

const VideoDetails: React.FC<VideoDetailsProps> = ({ blogData }) => {
  const [openShareModal, setOpenShareModal] = useState<boolean>(false);
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
        <Typography sx={{ fontSize: 28, fontWeight: "bold", paddingTop: 3 }}>
          {blogData?.title}
        </Typography>
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
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <FaRegClock />
            <Typography sx={{ paddingLeft: 2, paddingRight: 2 }}>
              {blogData?.publishedAt
                ? blogData?.publishedAt.toDateString()
                : "Publish Date"}
            </Typography>
            <Tooltip title="Share Course" placement="top">
              <IconButton onClick={() => setOpenShareModal(!openShareModal)}>
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
              shareTitle={"Share Course"}
            />
          </Grid>
        </Grid>

        <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
          {/* <MuiMarkdown>{blogData?.description}</MuiMarkdown>; */}
          {/* <MuiMarkdown skipHtml={false}>{blogData?.description}</MuiMarkdown> */}
          {blogData?.description}
        </Box>
      </Box>
    </>
  );
};
export default VideoDetails;
