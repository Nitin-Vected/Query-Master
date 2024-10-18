import React from "react";
import { Button } from "@mui/material";
import theme from "../../theme/theme";

interface CustomButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined" | "text";
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  isEditable?: boolean;
  sx?: object;
  style?: React.CSSProperties;
  startIcon?: React.ReactNode;
}

const ButtonView: React.FC<CustomButtonProps> = ({
  type,
  disabled = false,
  onClick,
  children,
  isEditable,
  sx = {},
  variant,
  style,
  startIcon,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      startIcon={startIcon}
      sx={{
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "row",
        textTransform: "none",
        justifyContent: "center",
        width: "98px",
        height: "38px",
        borderRadius: "8px",
        fontSize: "15px",
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.contrastText,
          color: theme.palette.primary.main,
        },
        ...sx,
      }}
      style={style}
      disabled={!isEditable || disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default ButtonView;
