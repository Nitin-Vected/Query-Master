import { createTheme } from "@mui/material/styles";

// Create a theme with all colors and other properties
const theme = createTheme({
  palette: {
    primary: {
      main: "#04142E",
      light: "#FFD773",
      dark: "#04142E",
      contrastText: "#ffffff",
    },

    secondary: {
      main: "#000000",
      light: "#F6F6F6",
      dark: "#9a0036",
      contrastText: "#ffffff",
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#ffffff",
    },
    warning: {
      main: "#f44336",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#000000",
    },
    info: {
      main: "#ccc",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#04142E",
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
