import React, { useState } from "react";
import { Dialog, DialogContent, Box, IconButton } from "@mui/material";
import { Close, ZoomIn, ZoomOut } from "@mui/icons-material";
import editIcon from "../../assets/image/editIcon.png";
import { ProofImageModalProps } from "./interface";

const ProofImageModal: React.FC<ProofImageModalProps> = ({
  open,
  proofImage,
  onClose,
}) => {
  console.log("proofImage",proofImage)
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.2, 0.5));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ position: "relative", paddingInline: "0px" }}>
        <Box sx={{ textAlign: "center" }}>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <Close />
          </IconButton>
          <Box
            sx={{
              overflow: "hidden",
              display: "inline-block",
              maxWidth: "80%",
              maxHeight: "80vh",
              border: "1px solid #ddd",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            {proofImage && (
              <img
                src={proofImage}
                alt="Transaction Proof"
                style={{
                  transform: `scale(${zoom})`,
                  width: "100%",
                  height: "auto",
                  transition: "transform 0.3s ease",
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: "45%",
              right: 0,
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <IconButton
              onClick={handleZoomIn}
              sx={{ backgroundColor: "#f0f0f0" }}
            >
              <ZoomIn />
            </IconButton>
            <IconButton
              onClick={handleZoomOut}
              sx={{ backgroundColor: "#f0f0f0" }}
            >
              <ZoomOut />
            </IconButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProofImageModal;
