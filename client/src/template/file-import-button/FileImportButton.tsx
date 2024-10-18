import { Button } from "@mui/material";
import React from "react";
import { FileImportButtonProps } from "./interface";
import theme from "../../theme/theme";

const FileImportButton: React.FC<FileImportButtonProps> = ({
  onFileChange,
  fileInputRef,
}) => (
  <Button
    sx={{
      height: "40px",
      color: theme.palette.secondary.main,
      textTransform: "none",
      borderRadius: "8px",
      border: `1px solid ${theme.palette.primary.dark}`,
      maxWidth: "200px",
    }}
    onClick={() => fileInputRef.current?.click()}
  >
    Import from Excel
    <input
      type="file"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={onFileChange}
    />
  </Button>
);

export default FileImportButton;
