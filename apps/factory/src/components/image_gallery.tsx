import React, { useEffect, useState } from "react";
import { GenerateOutput } from "~/validators/service";
import ShareCube from "./cubes/share_cube";
import DownloadButtonBase64 from "./download_button_base64";
import { Box, IconButton, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import Image from "next/image";
import { GetPromptOutput } from "~/validators/service";
import { api } from "~/utils/api";
import { NextPageWithLayout } from "~/pages/_app";
import { LogIdsArray } from "~/validators/prompt_log";

interface ImageGalleryProps {
  pv: GetPromptOutput;
  itemsPerPage: number;
  outputLog: GenerateOutput;
  url: string;
}

export const ImageGallery = ({
  pv,
  itemsPerPage,
  outputLog,
  url,
}: ImageGalleryProps) => {
  const [logIds, setLogIds] = useState<LogIdsArray>([]);
  const [openShareModal, setOpenShareModal] = useState("");

  const shareUrl = url + `?logId=${openShareModal}`;

  const extraOptions = {
    environment: pv?.versionOrEnvironment,
  };

  const {
    data: logIdResponse,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = api.cube.getLogIds.useInfiniteQuery(
    {
      promptPackageId: pv?.promptPackageId,
      promptTemplateId: pv?.templateId,
      perPage: itemsPerPage,
      ...extraOptions,
    },
    {
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
      },
    },
  );

  useEffect(() => {
    if (logIdResponse) {
      const allLogs: any = logIdResponse.pages.flatMap((page) => page.data);
      setLogIds(allLogs);
    }
    console.log(logIdResponse);
  }, [logIdResponse]);

  useEffect(() => {
    if (outputLog) {
      if (!logIds.includes({ id: outputLog.id })) {
        setLogIds([{ id: outputLog.id }, ...logIds]);
      }
    }
  }, [outputLog]);

  return (
    <>
      <div
        className={`${
          logIds.length > 0
            ? "dark:border-gray-70  mb-4 mt-4 w-full rounded-lg border pb-2 pt-1 shadow"
            : ""
        }`}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "left",
          }}
        >
          {logIds?.slice(0, 10).map((logId: any) => {
            return (
              <Box
                key={logId.id}
                sx={{
                  position: "relative",
                  width: "128px",
                  height: "128px",
                  margin: "0.5rem",
                  overflow: "hidden",
                  "&:hover": {
                    "&:before": {
                      content: "''",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: "rgba(0,0,0,0.5)",
                      zIndex: 1,
                    },
                    "& > div": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Image
                  src={`${
                    process.env.NEXT_PUBLIC_APP_URL
                  }/generated/assets/logs/${
                    logId.id
                  }/image.png?w=${128}&h=${128}`}
                  blurDataURL={`${process.env.NEXT_PUBLIC_APP_URL}/generated/assets/og.png`}
                  alt=""
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    // borderRadius: "10px",
                    transition: "opacity 0.3s ease",
                    zIndex: 2,
                  }}
                  width={128}
                  height={128}
                  placeholder="blur"
                  loading="lazy"
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 3,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <DownloadButtonBase64 logId={logId.id} />
                  <Tooltip title="Share Cube" placement="bottom">
                    <IconButton onClick={() => setOpenShareModal(logId.id)}>
                      <ShareIcon
                        sx={{
                          color: "var(--sugarhub-text-color)",
                          fontSize: "1.5rem",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            );
          })}
        </Box>
      </div>
      <ShareCube
        setOpenShareModal={setOpenShareModal}
        open={openShareModal}
        shareUrl={shareUrl}
        shareTitle={"Share Image"}
      />
    </>
  );
};
