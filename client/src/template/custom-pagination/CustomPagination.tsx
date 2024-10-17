import { Box, Pagination } from "@mui/material";
import theme from "../../theme/theme";
import styled from "styled-components";
import { CustomPaginationProps } from "./interface";

const CustomPaginationStyle = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    borderRadius: "8px",
    fontWeight: "bold",
    width: "40px",
    height: "40px",
    "@media (max-width: 600px)": {
      fontSize: "0.75rem",
      minWidth: "28px",
      padding: "4px",
    },
  },
  "& .Mui-selected": {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.text.primary} !important`,
  },
}));

const CustomPagination: React.FC<CustomPaginationProps> = ({
  page,
  count,
  onChange,
}) => (
  <Box
    sx={{
      mt: 3,
      display: "flex",
      justifyContent: "center",
      width: "100%",
    }}
  >
    <CustomPaginationStyle
      count={count}
      page={page}
      onChange={onChange}
      variant="outlined"
      siblingCount={0}
    />
  </Box>
);

export default CustomPagination;
