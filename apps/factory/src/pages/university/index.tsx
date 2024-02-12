import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Pagination,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import { FaFolder } from "react-icons/fa";
import Footer from "~/components/footer";
import { api } from "~/utils/api";

const BlogsPage: NextPage = () => {
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const page: number | undefined =
    parseInt(router.query.page as string, 10) || undefined;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    router.push({
      query: { ...router.query, page },
    });
  };

  const handleClick = (postSlug: string) => {
    router.push(`/university/prompt-engineering/${postSlug}`);
  };

  // const { data, isLoading, isError, error } = api.blog.getBlogs.useQuery();

  const { data: getPosts, isLoading } = api.blog.getBlogs.useQuery({
    pageNo: page,
  });

  return (
    <>
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
        <Container>
          <Box
            sx={{
              backgroundColor: "var(--sugarhub-tab-color)",
              padding: 5,
              // fontSize: isSmallScreen ? 25 : 35,
              textAlign: "center",
              fontWeight: "bold",
              // height: "35vh",
              borderRadius: 5,
              color: "var(--sugarhub-text-color)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              wordWrap: "break-word",
            }}
          >
            <Typography
              // variant="h2"
              component="h1"
              sx={{ fontSize: isSmallScreen ? 25 : 35 }}
            >
              Sugar University
            </Typography>
            <Typography component="h2" sx={{ pt: 1 }}>
              Welcome to GenAI World !!
            </Typography>
          </Box>
          <Grid container sx={{ paddingLeft: "15px" }}>
            {isLoading || getPosts === undefined ? (
              <CircularProgress />
            ) : (
              getPosts.map((post, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Card
                    sx={{
                      backgroundColor: "var(--sugarhub-bg-color)",
                      width: "350px",
                      maxHeight: "480px",
                      // border: 0,
                      margin: 1,
                    }}
                    onClick={() => {
                      handleClick(post.slug);
                    }}
                  >
                    <Box sx={{ cursor: "pointer", borderRadius: 5 }}>
                      <CardMedia
                        sx={{ objectFit: "cover" }}
                        component="img"
                        height="100"
                        image={post.previewImage}
                      />
                    </Box>
                    <Box
                      sx={{
                        paddingLeft: 2,
                        paddingRight: 2,
                        backgroundColor: "inherit",
                        color: "var(--sugarhub-text-color)",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 18,
                          fontWeight: "bold",
                          paddingTop: 1,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {post.title}
                      </Typography>

                      <Grid
                        container
                        sx={{
                          color: "GrayText",
                          paddingTop: 1,
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FaFolder />
                          <Typography
                            sx={{
                              paddingLeft: 1,
                              fontSize: 13,
                              flexDirection: "row",
                              WebkitBoxOrient: "vertical",
                              WebkitLineClamp: 2,
                              display: "-webkit-box",
                              overflow: "hidden",
                            }}
                          >
                            {post.tags?.toString().split(",").join(", ")}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box
                        sx={{
                          paddingTop: 2,
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          overflow: "hidden",
                        }}
                      >
                        {post.description}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        paddingTop: 2,
                        display: "grid",
                        gridTemplateRows: "auto 1fr auto",
                      }}
                    >
                      <Button variant="text" sx={{ height: 40 }}>
                        More Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))
            )}
            <Grid
              item
              sx={{
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Pagination
                onChange={handlePageChange}
                count={2}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "white",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "Highlight",
                    color: "white",
                  },
                  padding: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Box>
    </>
  );
};

export default BlogsPage;
