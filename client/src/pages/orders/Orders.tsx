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
import { useEffect, useRef, useState } from "react";
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
import { getAllOrders } from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Orders = () => {
  const [page, setPage] = useState<number>(1); // Start with page 1
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedOrder, setSelectedOrder] = useState("All Orders");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [products, setProducts] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [activeOrder, setActiveOrder] = useState<Order | undefined>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userData: any = useSelector((state: RootState) => state);
  const allOrders = userData.order.data.orderList;

  useEffect(() => {
    getAllOrders(userData.auth.userData.token, page, limit);
    setTotalPages(userData.order.data.totalPages)
  }, [userData.auth.userData.token, page, limit, totalPages]);

  const tableHeaders: TableColumn<Order>[] = [
    { label: "Order ID", key: "id" },
    { label: "User Name", key: "userName" },
    {
      label: "Product Name",
      key: "products",
      render: (
        _value: string | string[],
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
    { label: "Total Amount", key: "amount" },
    { label: "Due Amount", key: "dueAmount" },
    { label: "Due Date", key: "dueDate" },
    {
      label: "Action",
      key: "action",
      render: (
        _value: string | string[],
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
    productsList: string[]
  ) => {
    setAnchorEl(event.currentTarget);
    setProducts(productsList); // No changes needed here, just confirm the type
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
            <SearchInput placeholder={"Search Order"} onChange={() => { }} />
          </Box>

          <CustomTable headers={tableHeaders} rows={allOrders} />

          <CustomPagination count={totalPages} page={page} onChange={handlePageChange} />
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
