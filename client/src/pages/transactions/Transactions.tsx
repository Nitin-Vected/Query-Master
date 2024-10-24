import {
  Box,
  Grid,
  Button,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useRef, useState } from "react";
import SelectDropdown from "../../template/select-dropdown";
import CustomPagination from "../../template/custom-pagination";
import ComponentHeading from "../../template/component-heading";
import FileImportButton from "../../template/file-import-button";
import SearchInput from "../../template/search-input";
import CustomTable from "../../template/custom-table";
import ProofImageModal from "../../components/proof-image-modal";
import { TableColumn } from "../../template/custom-table/interface";
import theme from "../../theme/theme";
import { Transaction } from "./interface";

const Transactions = () => {
  const [selectedOrder, setSelectedOrder] = useState("All Transactions");
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const rows = [
    {
      orderId: "ORD1234",
      transactionId: "TX1234",
      transactionAmount: "₹1,24,500",
      transactionDate: "2024-10-01",
      transactionType: "Online",
      transactionProof: "proof1.jpg",
    },
    {
      orderId: "ORD5678",
      transactionId: "TX5678",
      transactionAmount: "₹83,000",
      transactionDate: "2024-09-15",
      transactionType: "Cash",
      transactionProof: "",
    },
    {
      orderId: "ORD9101",
      transactionId: "TX9101",
      transactionAmount: "₹66,400",
      transactionDate: "2024-09-25",
      transactionType: "Online",
      transactionProof: "proof3.jpg",
    },
    {
      orderId: "ORD1121",
      transactionId: "TX1121",
      transactionAmount: "₹33,200",
      transactionDate: "2024-09-30",
      transactionType: "Cash",
      transactionProof: "",
    },
  ];

  const headers: TableColumn<Transaction>[] = [
    { label: "Order ID", key: "orderId" },
    { label: "Transaction ID", key: "transactionId" },
    { label: "Amount", key: "transactionAmount" },
    { label: "Date", key: "transactionDate" },
    { label: "Type", key: "transactionType" },
    {
      label: "Proof",
      key: "transactionProof",
      render: (value: string, row: Transaction, _index: number) => {
        return value ? (
          <Button
            variant="outlined"
            onClick={() => handleViewProducts(row.transactionProof)}
            sx={{
              textTransform: "none",
              color: theme.palette.secondary.main,
              fontWeight: "bold",
              borderColor: theme.palette.secondary.main,
            }}
          >
            View Proof
          </Button>
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.secondary.dark,
              fontWeight: "bold",
              m: 1,
            }}
          >
            No Proof Available
          </Typography>
        );
      },
    },
  ];

  const handleOrderChange = (event: SelectChangeEvent<string>) => {
    setSelectedOrder(event.target.value as string);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    console.log("File selected:", file);
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleViewProducts = (proofImage: string) => {
    if (proofImage) {
      setSelectedProof(proofImage);
      setOpenModal(true);
    } else {
      alert("No proof image available for this transaction.");
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProof(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3, mt: 10 }}>
        <ComponentHeading heading="Transactions" />

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
                  { label: "All Transactions", value: "All Transactions" },
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
            <SearchInput placeholder="Search Order" onChange={() => {}} />
          </Box>

          <CustomTable headers={headers} rows={rows} />

          <CustomPagination count={3} page={page} onChange={handlePageChange} />
        </Box>
      </Box>

      <ProofImageModal
        open={openModal}
        proofImage={selectedProof}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Transactions;
