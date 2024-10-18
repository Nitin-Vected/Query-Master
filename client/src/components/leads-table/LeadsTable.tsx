import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  InputBase,
  Box,
} from "@mui/material";
import { Phone, Email } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { CSSProperties } from "styled-components";
import "../../App.css";
import image from "../../assets/image";
import { LeadTableProps, TableData } from "./interface";
import { tableHeaders } from "./constData";
import theme from "../../theme/theme";

const LeadsTable: React.FC<LeadTableProps> = ({ editFunction }) => {
  const tableHeadStyle: CSSProperties = {
    color: theme.palette.secondary.main,
    height: "45px",
  };
  const tableCellStyle: CSSProperties = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: theme.palette.divider,
    padding: "8px",
    textAlign: "center" as CSSProperties["textAlign"], // TypeScript expects specific values for textAlign
    fontWeight: "500",
    color: theme.palette.text.secondary,
    fontSize: "16px",
    lineHeight: "23px",
  };
  const CellStyle: CSSProperties = {
    borderStyle: "ridge",
    borderColor: theme.palette.divider,
    padding: "7px",
    textAlign: "center" as CSSProperties["textAlign"], // TypeScript expects specific values for textAlign
    borderLeftWidth: "0.1px",
    borderRightWidth: "0.0px",
    borderTopWidth: "0.0px",
    borderWidth: "none",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  };

  const title: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "15px",
    lineHeight: "24px",
    fontWeight: "400",
    textAlign: "center",
  };

  const [tableData, setTableData] = useState<TableData>([
    {
      id: 1,
      name: "John Doe",
      time: "Today at 4:30PM",
      phone: "9774432345",
      email: "johndoe@gmail.com",
      course: "Data Analyst",
      Channel: "Instagram",
      CurrentStatus: "Not Interested",
      ManageStatus: ["Interested", "Not Interested", "Enrolled"],
      Status: "Enrolled",
      discountAmount: "40",
      finalAmount: "44",
    },
    {
      id: 2,
      name: "Ram Doe",
      time: "Today at 8:30PM",
      phone: "9867664553",
      email: "johndoe@gmail.com",
      course: "Data Analyst",
      Channel: "Instagram",
      CurrentStatus: "Interested",
      ManageStatus: ["Interested", "Not Interested", "Enrolled"],
      Status: "Interested",
      discountAmount: "30",
      finalAmount: "44",
    },
  ]);

  const handleStatusChange = (id: number | string, value: string) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, CurrentStatus: value } : row
      )
    );
  };

  return (
    <div style={{ padding: "18px", width: "100%" }}>
      <Box
        sx={{
          display: { xs: "flex", sm: "flex" },
          backgroundColor: theme.palette.primary.contrastText,
          borderRadius: "9px",
          marginRight: 2,
          borderWidth: 1.5,
          borderColor: theme.palette.divider,
          borderStyle: "solid",
          width: { xs: "100%", sm: "322px" }, // Full width on small screens
          height: "39px",
          alignItems: "center",
          marginTop: { xs: 2, sm: 0 }, // Spacing for small screens
        }}
      >
        <IconButton>
          <SearchIcon
            style={{ fontSize: 20, color: theme.palette.primary.main }}
          />
        </IconButton>
        <InputBase
          placeholder="Search, Contact, More"
          sx={{
            color: theme.palette.secondary.main,
            fontSize: "14px",
            lineHeight: 16,
            flex: 1, // Allow input to fill the available space
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          padding: "none",
        }}
        style={{ marginTop: 12, width: "100%", padding: "none" }}
      >
        <Table>
          <TableHead>
            <TableRow style={tableHeadStyle}>
              {tableHeaders.map((header, index) => (
                <TableCell key={index} style={tableCellStyle}>
                  {header.NAME}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {tableData.map((row, index) => (
              <TableRow
                key={index}
                style={{
                  alignItems: "center",
                  borderBlockWidth: 0.1,
                  borderStyle: "solid",
                  borderLeft: "none",
                  borderRight: "none",
                  borderColor: theme.palette.text.secondary,
                }}
              >
                <TableCell style={title}>
                  {row.name}
                  <br />
                  {/* <span style={{ fontSize: "10px", color: "gray" }}>
                    {row.time}
                  </span> */}
                </TableCell>
                <TableCell>
                  <TableCell
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      borderRadius: "none",
                      borderWidth: "1px",
                      borderStyle: "none",
                      borderColor: "none",
                    }}
                  >
                    <Phone fontSize="small" style={{ marginRight: "5px" }} />
                    {row.phone}
                  </TableCell>
                </TableCell>

                <TableCell style={title}>
                  <TableCell
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      display: "flex",
                      borderRadius: "none",
                      borderWidth: "1px",
                      borderStyle: "none",
                      borderColor: "none",
                    }}
                  >
                    <Email fontSize="small" style={{ marginRight: "5px" }} />
                    {row.email}
                  </TableCell>
                </TableCell>
                <TableCell style={title}>{row.course}</TableCell>
                <TableCell style={{ textAlign: "center", padding: "10px" }}>
                  <Select
                    value={tableData[0].CurrentStatus || "Select Status"}
                    onChange={(e) => handleStatusChange(row.id, e.target.value)}
                    // onChange={(e) =>
                    //   handleStatusChange(tableData[0].id, e.target.value)
                    // } // Update status on change
                    displayEmpty
                    inputProps={{ "aria-label": "Select Status" }}
                    size="small"
                    style={{
                      width: "150px",
                      height: 30,
                      borderRadius: 8,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    {tableData[0].ManageStatus.map((item, index) => (
                      <MenuItem
                        key={index} // Ensure to add a unique key for each MenuItem
                        value={item} // Use the item value directly
                        style={{ textAlign: "center" }}
                      >
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>

                <TableCell style={title}>{row.Channel}</TableCell>
                <TableCell style={title}>{row.CurrentStatus}</TableCell>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        onClick={() => {
                          editFunction({ ...row, type: "Edit" });
                        }}
                        key={index}
                        style={CellStyle}
                      >
                        <img
                          src={image.editIcon}
                          alt="first example"
                          style={{
                            width: "20px",
                            height: "20px",
                            transition: "transform 0.3s ease", // Smooth transition
                            cursor: "pointer",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.2)";
                            e.currentTarget.style.filter = "hue-rotate(90deg)"; // Change color on hover
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.filter = "none"; // Reset color on hover out
                          }}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell key={index} style={CellStyle}>
                        <img
                          src={image.eyes}
                          alt="second example"
                          onClick={() => {
                            editFunction({ ...row, type: "viewEdit" });
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                            transition: "transform 0.3s ease", // Smooth transition
                            cursor: "pointer",
                            alignItems: "center",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          } // Scale up on hover
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          } // Reset on hover out
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default LeadsTable;
