import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from "@mui/material";
import { CustomTableProps, Lead } from "./interface";
import theme from "../../theme/theme";

const CustomTableCell = styled(TableCell)(() => ({
  padding: "10px",
  textAlign: "center",
  fontWeight: "bold",
  whiteSpace: "nowrap",
}));

const CustomTable = ({ headers, rows }: CustomTableProps) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "8px",
        boxShadow: `0px 0px 4px ${theme.palette.primary.dark}`,
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.background.paper }}>
            {headers.map((header) => (
              <CustomTableCell
                key={String(header.key || header.label)}
                sx={{
                  color: theme.palette.secondary.light,
                  fontWeight: "bold",
                }}
              >
                {header.label}
              </CustomTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.leads?.map((row: Lead, rowIndex: number) => {
            return (
              <TableRow key={rowIndex}  >
                {headers.map((header, colIndex) => (
                  <CustomTableCell key={colIndex}>
                    {header.render && header.key
                      ? header.render(row[header.key], row, rowIndex)
                      : header.key
                      ? String(row[header.key]) // Converts the value to a string for display
                      : null}
                  </CustomTableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomTable;
