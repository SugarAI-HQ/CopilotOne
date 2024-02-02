import React, { useState } from "react";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { api } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";
import { EntityTypesType } from "~/generated/prisma-client-zod.ts";
import { CircularProgress } from "@mui/material";
import { LikePublicOutputType } from "~/validators/like";

interface LikeButtonProps {
  entityId: string;
  entityType: EntityTypesType;
}

const LikeButton: React.FC<LikeButtonProps> = ({ entityId, entityType }) => {
  const [counter, setCounter] = useState<number>(0);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [hasLiked, setHasLiked] = useState<boolean>();
  const { data: sessionData } = useSession();

  const { data: like, isLoading } = api.like.getLikes.useQuery(
    {
      entityId,
      entityType,
    },
    {
      onSuccess(like: LikePublicOutputType) {
        setCounter(like.likesCount);
      },
    },
  );

  const { data: liked } = api.like.getUserLike.useQuery(
    {
      likeId: like?.id,
    },
    {
      onSuccess(liked) {
        setHasLiked(liked.hasLiked);
      },
      enabled: !!like?.id,
      retry: false,
    },
  );

  const unlikeMutation = api.like.unlikeEntity.useMutation();
  const likeMutation = api.like.likeEntity.useMutation();

  const handleLikeClick = () => {
    setButtonLoading(true);
    if (like) {
      if (hasLiked) {
        unlikeMutation.mutate(
          {
            likeId: like.id,
          },
          {
            onSuccess() {
              console.log("Likes Updated");
              setCounter(counter! - 1);
              setHasLiked((prevHasLiked) => !prevHasLiked);
              setButtonLoading(false);
            },
            onError(error) {
              const errorData = JSON.parse(error.message);
              console.log("error: ", errorData);
            },
          },
        );
      } else {
        likeMutation.mutate(
          {
            likeId: like.id,
          },
          {
            onSuccess(fetchedLikeId) {
              console.log("Likes Updated");
              setCounter(counter! + 1);
              setHasLiked((prevHasLiked) => !prevHasLiked);
              setButtonLoading(false);
            },
            onError(error) {
              const errorData = JSON.parse(error.message);
              console.log("error: ", errorData);
            },
          },
        );
      }
    }
  };

  return (
    <div>
      {isLoading || like === undefined ? (
        <CircularProgress />
      ) : (
        <ButtonGroup
          variant="outlined"
          color="inherit"
          size="small"
          sx={{ color: "#FFFFFF", padding: "20px" }}
        >
          <Button
            disabled={buttonLoading}
            size="small"
            startIcon={
              <FavoriteIcon
                sx={hasLiked ? { color: "red" } : { color: "white" }}
              />
            }
            onClick={() => (sessionData != null ? handleLikeClick() : signIn())}
          >
            {hasLiked ? "Liked" : "Like"}
          </Button>
          <Button sx={{ cursor: "default", pointerEvents: "none" }}>
            {counter} Likes
          </Button>
        </ButtonGroup>
      )}
    </div>
  );
};

export default LikeButton;
