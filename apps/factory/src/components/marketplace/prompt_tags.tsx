import { Chip, Grid } from "@mui/material";

const PromptTags = ({}: {}) => {
  const tags = ["intro", "greeting", "openai", "text-generation", "hello-llm"];

  return (
    <Grid direction="row" container alignItems="center" spacing={2}>
      {tags &&
        tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            variant="outlined"
            sx={{
              color: "#FFFFFF",
              backgroundColor: "#424242",
              marginLeft: "1rem",
            }}
          />
        ))}
    </Grid>
  );
};

export default PromptTags;
