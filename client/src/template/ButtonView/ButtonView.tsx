import React from "react";
import { Button } from "@mui/material";
import theme from "../../theme/theme";

// Updated type for variant
interface CustomButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "contained" | "outlined" | "text"; // Correct variant types
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  isEditable?: boolean;
  sx?: object; // Made optional
  style?: React.CSSProperties; // Updated to a more specific type
}

const ButtonView: React.FC<CustomButtonProps> = ({
  type,
  disabled = false,
  onClick,
  children,
  isEditable,
  sx = {}, // Default to empty object
  variant, // Set a default variant
  style,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      sx={{
        backgroundColor: theme.palette.text.secondary,
        color: theme.palette.text.primary,
        display: "flex",
        flexDirection: "row",
        textTransform: "none",
        justifyContent: "center", // Center text within the button
        width: "98px",
        height: "33px",
        left: -11,
        borderRadius: "8px",
        fontSize: "15px",
        "&:hover": {
          backgroundColor: theme.palette.primary.dark, // Darker shade on hover
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
