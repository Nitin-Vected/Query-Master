import React from "react";
import { DialogTitle, IconButton, Box } from "@mui/material";
import { Close } from "@mui/icons-material";
import theme from "../../theme/theme";
import { ModalHeaderProps } from "./interface";

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => (
  <DialogTitle style={{ textAlign: "center", position: "relative" }}>
    <Box
      component={"span"}
      sx={{
        background: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: 1,
        borderRadius: "5px",
      }}
    >
      {title}
    </Box>
    <IconButton
      aria-label="close"
      onClick={onClose}
      style={{ position: "absolute", right: 8, top: 8 }}
    >
      <Close />
    </IconButton>
  </DialogTitle>
);

export default ModalHeader;
