import React from "react";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Link,
  Box,
  Paper,
  Grid,
  Chip,
  Stack,
} from "@mui/material";
import LikeButton from "./like_button";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { PackagePublicOutput as pp } from "~/validators/marketplace";

const PromptHeader = ({ pp }: { pp: pp }) => {
  const likes = 1008;
  const tags = ["intro", "greeting", "openai", "text-generation", "hello-llm"];

  return (
    <Paper
      elevation={0}
      className="from-gray-50-to-white border-b border-gray-100 bg-gradient-to-t"
    >
      <Container maxWidth="lg" sx={{ pt: 6, sm: { pt: 9 } }}>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Avatar
                src={pp?.User?.image || "/default-avatar.png"}
                alt=""
                sx={{ width: 42, height: 42, borderRadius: "50%" }}
              />
            </Grid>
            <Grid item>
              <Link
                href={"/" + pp?.User?.username}
                className="text-gray-400 hover:text-blue-600"
              >
                {pp?.User?.username}
              </Link>
            </Grid>
            <Grid item>
              <Typography variant="h6" component="span">
                /
              </Typography>
            </Grid>
            <Grid item>
              <Link
                href="/meta-llama/Llama-2-7b"
                className="break-words font-mono font-semibold hover:text-blue-600"
              >
                {pp?.name}
              </Link>
            </Grid>
            <Grid item>
              <Button
                // variant=""
                startIcon={<ContentCopyIcon />}
                size="small"
                sx={{ textTransform: "none", mr: 1, borderColor: "gray.300" }}
                title="Copy model name to clipboard"
              ></Button>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <LikeButton count={likes}></LikeButton>
            </Grid>
          </Grid>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ p: 1 }}>
          {/* <Grid  direction="row" container alignItems="center" spacing={2}> */}
          {tags &&
            tags.map((tag, index) => (
              <Chip key={index} label={tag} variant="outlined" sx={{ ml: 2 }} />
            ))}

          {/* </Grid> */}
        </Stack>
      </Container>
    </Paper>
  );
};

export default PromptHeader;
