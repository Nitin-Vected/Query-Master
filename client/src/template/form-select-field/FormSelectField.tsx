import React from "react";
import { Typography, FormHelperText } from "@mui/material";
import SelectDropdown from "../select-dropdown";
import { FormSelectFieldProps } from "./interface";

const FormSelectField: React.FC<FormSelectFieldProps> = ({
  label,
  name,
  options,
  formik,
  required = false,
}) => (
  <>
    <Typography variant="subtitle2">
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </Typography>
    <SelectDropdown
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      options={options}
      sx={{
        "& .MuiSelect-select": {
          padding: "8px 14px",
        },
      }}
    />
    {formik.touched[name] && formik.errors[name] && (
      <FormHelperText error>{formik.errors[name]}</FormHelperText>
    )}
  </>
);

export default FormSelectField;
