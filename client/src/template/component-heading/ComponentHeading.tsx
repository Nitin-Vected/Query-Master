import { Box, Typography } from "@mui/material";
import { ComponentHeadingProps } from "./interface";

const ComponentHeading = ({ heading }: ComponentHeadingProps) => (
  <Box sx={{ paddingInline: 2 }}>
    <Typography variant="h4" fontWeight="bold">
      {heading}
    </Typography>
  </Box>
);

export default ComponentHeading;
