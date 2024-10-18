import { SelectChangeEvent } from "@mui/material";

export interface SelectDropdownProps {
  name: string;
  value?: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  options: { label: string; value: string }[];
  fullWidth?: boolean;
  sx?: object;
  disabled?: boolean;
  style?: React.CSSProperties;
}
