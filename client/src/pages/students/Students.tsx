import {
  Box,
  Typography,
  IconButton,
  Grid,
  SelectChangeEvent,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getAllStudents } from "../../services/api/userApi";
import Spinner from "../../components/Spinner";

const Students = () => {
  const [selectedOrder, setSelectedOrder] = useState("All Students");
  const [page, setPage] = useState<number>(1); // Start with page 1
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userData: any = useSelector((state: RootState) => state);
  const [products, setProducts] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const SpinnerLoading = useSelector((state: RootState) => state.student.loading);

  const allStudents = userData?.student?.data?.data;

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setSelectedOrder(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.[0] || null;
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };
  const handleViewProducts = (
    event: React.MouseEvent<HTMLElement>,
    productsList: string[]
  ) => {
    setAnchorEl(event.currentTarget);
    setProducts(productsList); // No changes needed here, just confirm the type
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  const handleViewClick = (type: string, student: Student) => {
    console.log(`${type} for student:`, student);
  };
  useEffect(() => {
    getAllStudents(userData.auth.userData.token, page, limit);
    setTotalPages(userData.student.data.totalPages);
  }, [userData.auth.userData.token, page, limit]);
  const tableHeaders: TableColumn<Student>[] = [
    { label: "Enrollment Number", key: "enrollmentNumber" },
    { label: "Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Contact Number", key: "contactNumber" },
    {
      label: "Product Name",
      key: "products",
      render: (_value: string | string[], row: Student, _index: number) => (
        <Button
          variant="outlined"
          onClick={(e) => handleViewProducts(e, row.products)}
          sx={{
            textTransform: "none",
            color: theme.palette.secondary.main,
            fontWeight: "bold",
            borderColor: theme.palette.secondary.main,
          }}
        >
          View
        </Button>
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

        {SpinnerLoading ? <Spinner /> : <Box
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
            <SearchInput placeholder={"Search Lead"} onChange={() => { }} />
          </Box>

          <CustomTable headers={tableHeaders} rows={allStudents} />

          <CustomPagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>}
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {products.length > 0 ? (
          products.map((product, index) => (
            <MenuItem key={index} onClick={handleCloseMenu}>
              {product} {/* Directly render the string value */}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No products available</MenuItem>
        )}
      </Menu>
    </>
  );
};

export default Students;
