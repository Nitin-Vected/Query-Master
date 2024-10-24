import {
  Box,
  Grid,
  Button,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
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
import { getAllTransactions } from "../../services/api/userApi";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import Spinner from "../../components/Spinner";

const Transactions = () => {
  const [selectedOrder, setSelectedOrder] = useState("All Transactions");
  const [page, setPage] = useState<number>(1); // Start with page 1
  const [limit, setLimit] = useState<number>(5);
  const [totalPages, setTotalPages] = useState<number>(1);
  const userData: any = useSelector((state: RootState) => state);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const SpinnerLoading = useSelector((state: RootState) => state.transaction.loading);

  const allTransactions = userData?.transaction?.data?.transactionList;
  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  }

  useEffect(() => {
    getAllTransactions(userData.auth.userData.token, page, limit);
    setTotalPages(userData.transaction.data.totalPages);
  }, [userData.auth.userData.token, page, limit]);
  const headers: TableColumn<Transaction>[] = [
    { label: "Order ID", key: "orderId" },
    { label: "Transaction ID", key: "id" },
    { label: "Amount", key: "amount" },
    { label: "Date", key: "date" },
    { label: "Type", key: "mode" },
    {
      label: "Proof",
      key: "proof",
      render: (value: string, row: Transaction, _index: number) => {
        return value ? (
          <Button
            variant="outlined"
            onClick={() => handleViewProducts(row.proof)}
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
            <SearchInput placeholder="Search Order" onChange={() => { }} />
          </Box>

          <CustomTable headers={headers} rows={allTransactions} />

          <CustomPagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>}
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
