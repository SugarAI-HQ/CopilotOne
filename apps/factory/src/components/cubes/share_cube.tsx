import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  TwitterShareButton,
  XIcon,
  LinkedinShareButton,
  LinkedinIcon,
  EmailShareButton,
  EmailIcon,
  RedditShareButton,
  RedditIcon,
  FacebookMessengerShareButton,
  FacebookMessengerIcon,
  TelegramShareButton,
  TelegramIcon,
} from "react-share";
import CopyToClipboardButton from "../copy_button";

interface Props {
  setOpenShareModal: React.Dispatch<React.SetStateAction<string>>;
  open: string;
  shareUrl: string;
}

const ShareCube = ({ setOpenShareModal, open, shareUrl }: Props) => {
  const handleClose = () => {
    setOpenShareModal("");
  };
  return (
    <>
      <Box>
        <Dialog
          open={open.length > 0 ? true : false}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              backgroundColor: "var(--modal-bg-color)",
              color: "var(--sugarhub-text-color)",
            }}
          >
            <DialogContent>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                sx={{ textAlign: "center" }}
              >
                Share Cube
              </Typography>
              <Box id="modal-modal-description" sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "200px",
                    flexWrap: "wrap",
                  }}
                >
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="Facebook" placement="top">
                      <FacebookShareButton
                        url={shareUrl}
                        style={{ cursor: "pointer" }}
                      >
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                    </Tooltip>
                  </Box>
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="WhatsApp" placement="top">
                      <WhatsappShareButton url={shareUrl}>
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </Tooltip>
                  </Box>
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="X" placement="top">
                      <TwitterShareButton url={shareUrl}>
                        <XIcon size={32} round />
                      </TwitterShareButton>
                    </Tooltip>
                  </Box>
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="Email" placement="top">
                      <EmailShareButton url={shareUrl}>
                        <EmailIcon size={32} round />
                      </EmailShareButton>
                    </Tooltip>
                  </Box>
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="Reddit" placement="top">
                      <RedditShareButton url={shareUrl}>
                        <RedditIcon size={32} round />
                      </RedditShareButton>
                    </Tooltip>
                  </Box>
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="Telegram" placement="top">
                      <TelegramShareButton url={shareUrl}>
                        <TelegramIcon size={32} round />
                      </TelegramShareButton>
                    </Tooltip>
                  </Box>
                  <Box style={{ margin: "5px 5px" }}>
                    <Tooltip title="Linkedin" placement="top">
                      <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                    </Tooltip>
                  </Box>
                  <Box
                    sx={{
                      margin: "5px 5px",
                      backgroundColor: "black",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "36px",
                      height: "36px",
                    }}
                  >
                    <CopyToClipboardButton
                      textToCopy={shareUrl}
                      textToDisplay={"Copy Url"}
                      cube={true}
                    />
                  </Box>
                </Box>
              </Box>
            </DialogContent>
            <Divider sx={{ borderColor: "var(--divider-color)" }} />
            <DialogActions>
              <Button variant="outlined" color="primary" onClick={handleClose}>
                Cancel
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </>
  );
};

export default ShareCube;
