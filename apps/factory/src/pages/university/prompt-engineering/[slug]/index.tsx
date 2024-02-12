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
import { NextSeo } from "next-seo";
import humanizeString from "humanize-string";

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const { data: blogData, isLoading } = api.blog.getBlog.useQuery({
    slug: slug,
  });

  return (
    <>
      {blogData === undefined || isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <NextSeo
            title={blogData?.title}
            description={blogData?.description}
            // canonical={shareUrl}
            openGraph={{
              url: `${process.env.NEXT_PUBLIC_APP_URL}${router.asPath}`,
              title: `${blogData?.title}`,
              description: `${blogData?.description}`,
              type: "website",
              images: [
                {
                  url: `${blogData?.previewImage}`,
                  width: 1200,
                  height: 630,
                  type: "image/png",
                },
              ],
            }}
            twitter={{
              cardType: "summary_large_image",
            }}
          />
          <Box
            sx={{
              backgroundColor: "var(--sugarhub-main-color)",
              height: "100vh",
              width: "100vw",
              overflowY: "scroll",
            }}
          >
            <Header
              headerName={`Sugar University`}
              headerUrl={`/university`}
            ></Header>
            <Container className="mt-10">
              <VideoPlayer videoLink={blogData!.mediaUrl} />
              <VideoDetails blogData={blogData} />
            </Container>
            <Footer />
          </Box>
        </>
      )}
    </>
  );
};

export default BlogPage;
