import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  FormHelperText,
  TextField,
  TableHead,
  Tooltip,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import theme from "../../theme/theme";
import { CSSProperties } from "styled-components";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import SelectDropdown from "../../template/select-dropdown";
import { OderFormModalProps } from "./interface";
import ModalHeader from "../../template/modal-header";
import ButtonView from "../../template/button-view";
import FormTextField from "../../template/form-text-field";
import FormSelectField from "../../template/form-select-field";
import { Order, Product, Transaction } from "../../pages/orders/interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const OrderModal: React.FC<OderFormModalProps> = ({
  OpenOrderModal,
  handleClose,
  orderData,
}) => {
  const [isFieldVisible, setIsFieldVisible] = useState(false);
  const userData: any = useSelector((state: RootState) => state);
  const allProducts = userData.product.data.productList;
  const allTransactions = userData.transaction.data.transactionList;
  const orderLabel: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "21.5px",
    fontWeight: "600",
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  console.log(orderData?.transactions)
  console.log(userData)
  useEffect(() => {
    setTransactions(allTransactions.filter((transaction: Transaction) =>
      orderData?.transactions.includes(transaction.id)))
    setProducts(allProducts.filter((product: Product) => orderData?.products.includes(product.id)))
  }, [orderData])
  console.log(transactions)
  const orderTitle: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "15px",
    fontWeight: "400",
  };
  const tableHead: CSSProperties = {
    border: `1px solid ${theme.palette.info.dark}`,
    borderWidth: 1,
    fontWeight: "400",
    fontSize: 17,
    color: theme.palette.secondary.main,
    textAlign: "center",
    padding: "6px",
    textWrap: "nowrap",
  };
  const tableLabel: CSSProperties = {
    border: `1px solid ${theme.palette.info.dark}`,
    padding: "6px",
    borderWidth: 1,
    fontWeight: "400",
    fontSize: 14,
    color: theme.palette.secondary.main,
    textAlign: "center",
  };
  const tableContainer: CSSProperties = {
    alignItems: "center",
    borderBlockWidth: 0.1,
    borderStyle: "none",
    borderLeft: "none",
    borderRight: "none",
    borderColor: theme.palette.text.secondary,
    borderTopWidth: "none",
    padding: "none",
    marginTop: 10,
  };
  // Validation schema using Yup
  const validationSchema = Yup.object({
    transactionAmount: Yup.string().required("Transaction Mode is required"),
    transactionMode: Yup.string().required("Transaction Mode is required"),
    transactionDate: Yup.string().required("Transaction Date is required"),
    transactionProof: Yup.string().required("Transaction proof is required"),
  });
  return (
    <Dialog
      sx={{
        border: "none",
        borderRadius: "none",
      }}
      open={OpenOrderModal}
      fullWidth
      maxWidth="md"
      BackdropProps={{
        style: {
          backgroundColor: theme.palette.action.focus,
          backdropFilter: "blur(2px)",
        },
      }}
    >
      <ModalHeader
        title={"Orders"}
        onClose={() => {
          handleClose();
          setIsFieldVisible(false);
        }}
      />
      <DialogContent
        sx={{
          padding: { xs: "12px", sm: "20px 40px" },
        }}
        style={{
          overflow: "auto",
          height: "70vh",
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            ...orderLabel,
          }}
        >
          Order Detail:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ ...orderTitle }}>Full Name :</Typography>
            <Typography sx={{ ...orderTitle }}>{orderData?.userName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ ...orderTitle }}>Contact Number :</Typography>
            <Typography sx={{ ...orderTitle }}>{orderData?.contactNumber}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ ...orderTitle }}>Email Id :</Typography>
            <Typography sx={{ ...orderTitle }}>{orderData?.email}</Typography>
          </Grid>
        </Grid>

        {/* Product Details */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            ...orderLabel,
            marginTop: 1.5,
          }}
        >
          Product Detail:
        </Typography>

        <TableContainer component={Paper} style={tableContainer}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: theme.palette.success.dark }}>
                <TableCell style={tableHead}>Product Name</TableCell>
                <TableCell style={tableHead}>Product Amount</TableCell>
                <TableCell style={tableHead}>Product Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={tableLabel}>{product.name}</TableCell>
                    <TableCell style={tableLabel}>{product.price}</TableCell>
                    <TableCell
                      sx={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        maxWidth: '250px',
                      }}
                      style={tableLabel}
                    >
                      <Tooltip title={product.description} arrow>
                        <span>{product.description}</span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} marginTop={1.5}>
            <Typography sx={{ ...orderTitle }}>Total Amount :</Typography>
            <Typography sx={{ ...orderTitle }}>
              {orderData?.amount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} marginTop={1.5}>
            <Typography sx={{ ...orderTitle }}>Due Amount :</Typography>
            <Typography sx={{ ...orderTitle }}>
              {orderData?.dueAmount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} marginTop={1.5}>
            <Typography sx={{ ...orderTitle }}>Due Date :</Typography>
            <Typography sx={{ ...orderTitle }}>{orderData?.dueDate}</Typography>
          </Grid>
        </Grid>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            ...orderLabel,
            marginTop: 1.5,
          }}
        >
          Transaction Detail:
        </Typography>

        <TableContainer component={Paper} style={tableContainer}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: theme.palette.success.dark }}>
                <TableCell style={tableHead}>Transaction Mode</TableCell>
                <TableCell style={tableHead}>Transaction Amount</TableCell>
                <TableCell style={tableHead}>Transaction Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transactions, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell style={tableLabel}>{transactions.mode}</TableCell>
                    <TableCell style={tableLabel}>{transactions.amount}</TableCell>
                    <TableCell style={tableLabel}>{transactions.date}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Transaction Details */}
        {!isFieldVisible ? (
          <ButtonView
            startIcon={<Add />}
            onClick={() => setIsFieldVisible(true)}
            type="button"
            isEditable={true}
            sx={{
              fontSize: "15px",
              width: "150",
            }}
            style={{
              marginTop: 9,
            }}
          >
            Add Transaction
          </ButtonView>
        ) : (
          <Formik
            initialValues={{
              transactionMode: "Online",
              transactionAmount: "",
              transactionDate: "",
              transactionProof: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log(values);
            }}
          >
            {(formik) => (
              <Form>
                <Grid container spacing={2} direction="row" marginTop={0.9}>
                  <Grid item xs={12} md={4} marginTop={1}>
                    <FormSelectField
                      label="Transaction Mode"
                      name="transactionMode"
                      options={[
                        { label: "Cash", value: "Cash" },
                        { label: "Online", value: "Online" },
                      ]}
                      formik={formik}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} lg={3.8} marginTop={1}>
                    <FormTextField
                      label="Transaction Amount"
                      name="transactionAmount"
                      placeholder="Rs"
                      formik={formik}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={4} marginTop={1}>
                    <FormTextField
                      label="Transaction Date *"
                      name="transactionDate"
                      formik={formik}
                      type="date"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ ...orderTitle }}>
                      Transaction Proof<span style={{ color: "red" }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      required
                      name="transactionProof"
                      type="file"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 40,
                        },
                      }}
                    />
                    {formik.touched.transactionProof &&
                      formik.errors.transactionProof && (
                        <FormHelperText error>
                          {formik.errors.transactionProof}
                        </FormHelperText>
                      )}
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  marginTop={0.9}
                  flexDirection={"row"}
                  justifyContent={"end"}
                  alignContent={"center"}
                >
                  <ButtonView
                    type="submit"
                    isEditable={true}
                    style={{ marginTop: 8 }}
                    sx={{ left: -11 }}
                    onClick={() => {
                      handleClose();
                      setIsFieldVisible(false);
                    }}
                  >
                    Submit
                  </ButtonView>
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
