import React from "react";
import { Select, MenuItem } from "@mui/material";
import theme from "../../theme/theme";
import { SelectDropdownProps } from "./interface";

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  name,
  value,
  onChange,
  options,
  fullWidth = true,
  sx = {},
  disabled,
  style,
}) => {
  return (
    <Select
      name={name}
      value={value} // This will display "Not Assigned" as the default if the value is undefined or null
      onChange={onChange}
      displayEmpty
      disabled={disabled}
      style={style}
      sx={{
        height: 40,
        ...sx,
        "& .MuiSelect-select": {
          padding: "8px 14px",
        },
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            "& .MuiMenuItem-root.Mui-selected": {
              backgroundColor: `${theme.palette.primary.main} !important`,
              color: "white",
              "&:hover": {
                backgroundColor: `${theme.palette.primary.main} !important`,
              },
            },
          },
        },
      }}
      fullWidth={fullWidth}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectDropdown;
