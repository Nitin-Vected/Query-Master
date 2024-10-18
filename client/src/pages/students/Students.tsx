import {
  Box,
  Typography,
  IconButton,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { useRef, useState } from "react";
import { RemoveRedEyeOutlined, ReceiptLong } from "@mui/icons-material";
import SelectDropdown from "../../template/select-dropdown";
import ComponentHeading from "../../template/component-heading";
import FileImportButton from "../../template/file-import-button";
import CustomPagination from "../../template/custom-pagination";
import CustomTable from "../../template/custom-table";
import SearchInput from "../../template/search-input";
import { TableColumn } from "../../template/custom-table/interface";
import theme from "../../theme/theme";
import { Student } from "./interface";


const Students = () => {
  const [selectedOrder, setSelectedOrder] = useState("All Students");
  const [page, setPage] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const students = [
    {
      enrollmentNumber: "STU1234",
      name: "John Doe",
      email: "john.doe@example.com",
      contactNumber: "9865784578",
      products: ["Laptop", "Mouse"],
      transactions: ["Paid ₹50,000", "Paid ₹30,000"],
    },
    {
      enrollmentNumber: "STU5678",
      name: "Sarah Haw",
      email: "sarah.haw@example.com",
      contactNumber: "9862284578",
      products: ["Smartphone", "Headphones"],
      transactions: ["Paid ₹60,000", "Pending ₹40,000"],
    },
    {
      enrollmentNumber: "STU9101",
      name: "Tyson Tan",
      email: "tyson.tan@example.com",
      contactNumber: "8862284556",
      products: ["Tablet", "Keyboard"],
      transactions: ["Paid ₹25,000", "Paid ₹15,000"],
    },
    {
      enrollmentNumber: "STU1121",
      name: "Robert Shell",
      email: "robert.shell@example.com",
      contactNumber: "7862858543",
      products: ["Smartwatch", "Charger"],
      transactions: ["Paid ₹10,000", "Pending ₹5,000"],
    },
  ];

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setSelectedOrder(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.[0] || null;
    console.log("file data", file);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleViewClick = (type: string, student: Student) => {
    console.log(`${type} for student:`, student);
  };

  const tableHeaders: TableColumn<Student>[] = [
    { label: "Enrollment Number", key: "enrollmentNumber" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Contact Number", key: "contactNumber" },
    {
      label: "Products",
      key: "products",
      render: (_value: string | string[], row: Student, _index: number) => (
        <IconButton
          sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }}
          onClick={() => handleViewClick("Products", row)}
        >
          <RemoveRedEyeOutlined />
          <Typography
            variant="body2"
            sx={{
              ml: 1,
              color: theme.palette.secondary.main,
              fontWeight: "bold",
            }}
          >
            View
          </Typography>
        </IconButton>
      ),
    },
    {
      label: "Transactions",
      key: "transactions",
      render: (_value: string | string[], row: Student, _index: number) => {
        return (
          <IconButton
            sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }}
            onClick={() => handleViewClick("Transactions", row)}
          >
            <ReceiptLong />
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                color: theme.palette.secondary.main,
                fontWeight: "bold",
              }}
            >
              View
            </Typography>
          </IconButton>
        );
      },
    },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3, mt: 10 }}>
        <ComponentHeading heading="Students" />

        <Box
          sx={{
            margin: "auto",
            padding: 2,
            boxShadow: `0px 0px 5px 0px ${theme.palette.primary.dark}`,
          }}
        >
          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              pb: 2,
              borderBottom: `1px solid ${theme.palette.primary.dark}`,
            }}
          >
            <Grid item xs={12} sm={6} md={6} display="flex" gap={2}>
              <SelectDropdown
                name="leadFilter"
                value={selectedOrder}
                onChange={handleOrderChange}
                options={[
                  { label: "All Students", value: "All Students" },
                  { label: "Enrolled", value: "Enrolled" },
                ]}
                sx={{
                  borderRadius: "8px",
                  maxWidth: "180px",
                }}
                fullWidth={false}
              />
            </Grid>

            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              display="flex"
              sx={{
                justifyContent: { xs: "flex-start", sm: "flex-end" },
              }}
            >
              <FileImportButton
                onFileChange={handleFileChange}
                fileInputRef={fileInputRef}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <SearchInput placeholder={"Search Lead"} onChange={() => {}} />
          </Box>

          <CustomTable<Student> headers={tableHeaders} rows={students} />

          <CustomPagination count={3} page={page} onChange={handlePageChange} />
        </Box>
      </Box>
    </>
  );
};

export default Students;
