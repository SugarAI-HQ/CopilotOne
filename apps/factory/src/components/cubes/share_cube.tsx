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
              <Typography id="modal-modal-title" variant="h6" component="h2">
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
                  <Box>
                    <FacebookShareButton
                      url={shareUrl}
                      style={{ cursor: "pointer" }}
                    >
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                  </Box>
                  <Box>
                    <WhatsappShareButton url={shareUrl}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                  </Box>
                  <Box>
                    <TwitterShareButton url={shareUrl}>
                      <XIcon size={32} round />
                    </TwitterShareButton>
                  </Box>
                  <Box>
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
