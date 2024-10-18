import { SelectChangeEvent } from "@mui/material";
import { FormikValues } from "formik";

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormSelectFieldProps {
  label: string;
  name: string;
  options: Array<SelectOption>;
  formik: {
    values: FormikValues;
    touched: FormikValues;
    errors: FormikValues;
    handleChange: (event: SelectChangeEvent<string>) => void;
    handleBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  };
  required?: boolean;
}
