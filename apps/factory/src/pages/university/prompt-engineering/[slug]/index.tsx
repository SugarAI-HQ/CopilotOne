import { useEffect, useState } from "react";

import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { NextPage } from "next";
import { api } from "~/utils/api";
import Header from "~/components/marketplace/header";
import VideoPlayer from "~/components/video_player";
import VideoDetails from "~/components/video_details";
import Footer from "~/components/footer";

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const { data: blogData, isLoading } = api.blog.getBlog.useQuery({
    slug: slug,
  });

  console.log(blogData);

  return (
    <>
      {blogData === undefined || isLoading ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            backgroundColor: "var(--sugarhub-main-color)",
            height: "100vh",
            width: "100vw",
            overflowY: "scroll",
          }}
        >
          <Header headerName={`Sugar University`}></Header>
          <Container>
            <VideoPlayer videoLink={blogData!.mediaUrl} />
            <VideoDetails blogData={blogData} />
          </Container>
          <Footer />
        </Box>
      )}
    </>
  );
};

export default BlogPage;
