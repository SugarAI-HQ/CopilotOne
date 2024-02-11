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

const BlogPage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const { data } = api.blog.getBlog.useQuery({
    slug: slug,
  });

  return (
    <>
      {data?.title}
      {data?.description}
    </>
  );
};

export default BlogPage;
