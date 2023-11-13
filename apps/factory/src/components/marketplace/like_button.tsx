import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FavoriteIcon from "@mui/icons-material/Favorite";

function LikeButton({ count }: { count: number }) {
  const [counter, setCounter] = useState(count);

  const handleLikeClick = () => {
    // Increment the like count when the button is clicked
    setCounter(counter + 1);
  };

  return (
    <div>
      <ButtonGroup
        variant="outlined"
        color="inherit"
        size="small"
        sx={{ color: "#FFFFFF" }}
      >
        <Button
          size="small"
          startIcon={<FavoriteIcon />}
          onClick={handleLikeClick}
        >
          Like
        </Button>
        <Button>{counter} Likes</Button>
      </ButtonGroup>
    </div>
  );
}

export default LikeButton;
