import { Search } from "@mui/icons-material";
import { InputBase } from "@mui/material";
import { SearchInputProps } from "./interface";
import theme from "../../theme/theme";

const SearchInput: React.FC<SearchInputProps> = ({ placeholder, onChange }) => (
  <InputBase
    placeholder={placeholder}
    startAdornment={
      <Search sx={{ mr: 1, color: theme.palette.secondary.main }} />
    }
    sx={{
      border: `1px solid ${theme.palette.primary.dark}`,
      borderRadius: "8px",
      padding: "2px 8px",
      width: "100%",
      maxWidth: "280px",
    }}
    onChange={onChange}
  />
);

export default SearchInput;
