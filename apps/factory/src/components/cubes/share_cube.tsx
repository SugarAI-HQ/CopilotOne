import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
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

interface Props {
  setOpenShareModal: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  shareUrl: string;
}

const ShareCube = ({ setOpenShareModal, open, shareUrl }: Props) => {
  const handleClose = () => {
    setOpenShareModal(false);
  };
  return (
    <>
      <Box>
        <Dialog
          open={open}
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
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "200px",
                    flexWrap: "wrap",
                  }}
                >
                  <Box style={{ margin: "0 5px" }}>
                    <FacebookShareButton
                      url={shareUrl}
                      style={{ cursor: "pointer" }}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <WhatsappShareButton url={shareUrl}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <TwitterShareButton url={shareUrl}>
                      <XIcon size={32} round />
                    </TwitterShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <EmailShareButton url={shareUrl}>
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <RedditShareButton url={shareUrl}>
                      <RedditIcon size={32} round />
                    </RedditShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <TelegramShareButton url={shareUrl}>
                      <TelegramIcon size={32} round />
                    </TelegramShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <FacebookMessengerShareButton
                      url={shareUrl}
                      appId="346094688227574"
                    >
                      <FacebookMessengerIcon size={32} round />
                    </FacebookMessengerShareButton>
                  </Box>
                  <Box style={{ margin: "0 5px" }}>
                    <LinkedinShareButton url={shareUrl}>
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                  </Box>
                </Box>
              </Typography>
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
