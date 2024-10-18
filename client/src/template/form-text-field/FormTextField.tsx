import React from "react";
import { TextField, Typography } from "@mui/material";
import { FormTextFieldProps } from "./interface";

const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  name,
  placeholder,
  formik,
  required = false,
  disabled,
  InputProps,
  type,
  multiline,
  rows,
  variant,
}) => (
  <>
    <Typography variant="subtitle2">
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </Typography>
    <TextField
      fullWidth
      required={required}
      name={name}
      multiline={multiline}
      rows={rows}
      variant={variant}
      disabled={disabled}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      placeholder={placeholder}
      error={formik.touched[name] && Boolean(formik.errors[name])}
      helperText={formik.touched[name] && formik.errors[name]}
      type={type}
      sx={{
        "& .MuiInputBase-root": {
          height: 40,
        },
      }}
      InputProps={InputProps}
    />
  </>
);

export default FormTextField;
