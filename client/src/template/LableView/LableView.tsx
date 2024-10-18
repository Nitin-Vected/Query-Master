import Typography from "@mui/material/Typography";
import { CSSProperties, ReactNode } from "react";
import theme from "../../theme/theme";

// Define the props interface
interface LabelViewProps {
  sx?: CSSProperties; // For additional styles
  textLabel?: ReactNode; // Content of the label
  enableColor?: boolean; // Determines the text color
}

const LabelView = ({
  sx = {},
  textLabel = "",
  enableColor = false, // Default value for isEditable
}: LabelViewProps) => {
  const TextStyle: CSSProperties = {
    fontWeight: "500",
    fontSize: "15px",
    marginBottom: "5px",
    color: enableColor
      ? theme.palette.text.secondary
      : theme.palette.primary.main,
      alignItems:"center",
      justifyContent:"center"
  };

  return (
    <Typography
    
      sx={{
        ...TextStyle,
        ...sx, // Allow additional styles to be passed in
      }}
    >
      {textLabel}
    </Typography>
  );
};

export default LabelView;

