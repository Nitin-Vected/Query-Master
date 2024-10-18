import { TextFieldProps } from "@mui/material";
import { FormikValues } from "formik";

export interface FormTextFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  formik: {
    values: FormikValues;
    touched: FormikValues;
    errors: FormikValues;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  };
  required?: boolean;
  InputProps?: TextFieldProps["InputProps"]; // Define the type properly
  type?: string;
  multiline?: boolean;
  rows?: string;
  variant?: TextFieldProps["variant"]; // Define variant type from Material-UI
}
