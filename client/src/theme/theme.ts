import { createTheme } from "@mui/material/styles";

// Create a theme with all colors and other properties
const theme = createTheme({
  palette: {
    primary: {
      main: "#04142E",
      light: "#FFD773",
      dark: "#00000040",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#000000",
      light: "#6B7280",
      dark: "#808080",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#FF0000",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f44336",
      light: "#FFD773",
      dark: "#f57c00",
      contrastText: "#000000",
    },
    info: {
      main: "#aeacac",
      light: "#dddcdc",
      dark: "#e0e0e0",
      contrastText: "#fafafa",
    },
    success: {
      main: "#808080",
      light: "#81c784",
      dark: "#F5F5F5",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#F3F4F6",
    },
    text: {
      primary: "#ffffff",
      secondary: "#767676",
      disabled: "#9e9e9e",
    },
    action: {
      hover: "#FFB600",
      active: "#04142E",
      selected: "#FFB600",
      disabled: "#ff8a65",
      disabledBackground: "#ffe0b2",
      focus: "#rgba(239, 239, 239, 0.5)",
    },
    divider: "#E1E1E1",
  },
  typography: {
    fontFamily: "Montserrat Thin",
  },
});

export default theme;
