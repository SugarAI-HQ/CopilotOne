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
import Header from "~/components/marketplace/header";
import { NextPage } from "next";
import { api } from "~/utils/api";

const BlogsPage: NextPage = () => {
  const { data, isLoading, isError, error } = api.blog.getBlogs.useQuery();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography component="span" sx={{ mt: 1, mb: 4, flex: 1, p: 2 }}>
        Error: {error.message}
      </Typography>
    );
  }

  return (
    <>
      {data ? (
        <>
          {data.map((blog: any, index: any) => (
            <div key={index}>
              <h2>{blog.title}</h2>
              <p>{blog.description}</p>
              <p>{blog.slug}</p>
              {/* Add other fields you want to display */}
            </div>
          ))}
        </>
      ) : (
        <Typography component="span" sx={{ mt: 1, mb: 4, flex: 1, p: 2 }}>
          Not found
        </Typography>
      )}
    </>
  );
};

export default BlogsPage;
