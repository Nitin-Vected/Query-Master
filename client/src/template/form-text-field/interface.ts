import { TextFieldProps } from "@mui/material";
import { FormikValues } from "formik";
import { ChangeEvent } from "react";

export interface FormTextFieldProps {
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  formik:
    | {
        values: FormikValues | string | number;
        touched: FormikValues;
        errors: FormikValues;
        handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
        handleBlur: (
          event: React.FocusEvent<HTMLInputElement, Element>
        ) => void;
      }
    | any;
  required?: boolean;
  InputProps?: TextFieldProps["InputProps"]; // Define the type properly
  inputProps?: TextFieldProps["inputProps"]; // Define the type properly
  type?: string;
  multiline?: boolean;
  rows?: string;
  variant?: TextFieldProps["variant"]; // Define variant type from Material-UI
  handleChange?: (e: ChangeEvent<HTMLInputElement>) => void; // Define type for handleChange
  isEditable?: boolean;
}
