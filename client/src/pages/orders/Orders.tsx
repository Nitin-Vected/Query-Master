import {
  Box,
  IconButton,
  Grid,
  Button,
  Menu,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import { useRef, useState } from "react";
import SelectDropdown from "../../template/select-dropdown";
import OrderModal from "../../components/order_modal";
import CustomTable from "../../template/custom-table";
import CustomPagination from "../../template/custom-pagination";
import ComponentHeading from "../../template/component-heading";
import FileImportButton from "../../template/file-import-button";
import SearchInput from "../../template/search-input";
import { TableColumn } from "../../template/custom-table/interface";
import { Order } from "./interface";
import theme from "../../theme/theme";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState("All Orders");
  const [page, setPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [products, setProducts] = useState<{ name: string }[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const rows = [
    {
      orderId: "ORD1234",
      userName: "John Doe",
      products: [{ name: "Laptop" }, { name: "Mouse" }],
      totalAmount: "₹1,24,500",
      dueAmount: "₹41,500",
      dueDate: "2024-11-01",
      action: "",
    },
    {
      orderId: "ORD5678",
      userName: "Sarah Haw",
      products: [{ name: "Smartphone" }],
      totalAmount: "₹83,000",
      dueAmount: "₹16,600",
      dueDate: "2024-10-15",
      action: "",
    },
    {
      orderId: "ORD9101",
      userName: "Tyson Tan",
      products: [{ name: "Tablet" }, { name: "Stylus Pen" }],
      totalAmount: "₹66,400",
      dueAmount: "₹24,900",
      dueDate: "2024-10-25",
      action: "",
    },
    {
      orderId: "ORD1121",
      userName: "Robert Shell",
      products: [{ name: "Smartwatch" }],
      totalAmount: "₹33,200",
      dueAmount: "₹8,300",
      dueDate: "2024-10-30",
      action: "",
    },
  ];

  const tableHeaders: TableColumn<Order>[] = [
    { label: "Order ID", key: "orderId" },
    { label: "User Name", key: "userName" },
    {
      label: "Product Name",
      key: "products",
      render: (
        _value: string | { name: string }[],
        row: Order,
        _index: number
      ) => (
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
    { label: "Total Amount", key: "totalAmount" },
    { label: "Due Amount", key: "dueAmount" },
    { label: "Due Date", key: "dueDate" },
    {
      label: "Action",
      key: "action",
      render: (
        _value: string | { name: string }[],
        row: Order,
        _index: number
      ) => (
        <IconButton onClick={() => openDetailsModal(row)}>
          <RemoveRedEyeOutlined
            sx={{
              width: "25px",
              height: "25px",
              color: theme.palette.secondary.main,
            }}
          />
        </IconButton>
      ),
    },
  ];

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setSelectedOrder(event.target.value as string);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.[0] || null;
    console.log("file data", file);
  };

  const openDetailsModal = (selectedOrder: Order) => {
    setActiveOrder(selectedOrder);
    setOpen(true);
  };

  const handleViewProducts = (
    event: React.MouseEvent<HTMLElement>,
    productsList: { name: string }[]
  ) => {
    console.log("productsList", productsList);
    setAnchorEl(event.currentTarget);
    setProducts(productsList);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3, mt: 10 }}>
        <ComponentHeading heading="Orders" />

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
                  { label: "All Orders", value: "All Orders" },
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
            <SearchInput placeholder={"Search Order"} onChange={() => {}} />
          </Box>

          <CustomTable headers={tableHeaders} rows={rows} />

          <CustomPagination count={3} page={page} onChange={handlePageChange} />
        </Box>
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
        {products.map((product, index) => (
          <MenuItem key={index} onClick={handleCloseMenu}>
            {product.name}
          </MenuItem>
        ))}
      </Menu>

      <OrderModal
        OpenOrderModal={open}
        handleClose={() => {
          setOpen(false);
        }}
        orderData={activeOrder}
      />
    </>
  );
};

export default Orders;
