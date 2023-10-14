import { Chip, Grid } from "@mui/material";

const PromptTags = ({}: {}) => {
  const tags = ["intro", "greeting", "openai", "text-generation", "hello-llm"];

  return (
    <Grid direction="row" container alignItems="center" spacing={2}>
      {tags &&
        tags.map((tag, index) => (
          <Chip key={index} label={tag} variant="outlined" sx={{ ml: 2 }} />
        ))}
    </Grid>
  );
};

export default PromptTags;
