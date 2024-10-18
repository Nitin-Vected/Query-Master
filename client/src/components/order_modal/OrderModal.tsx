import React, { useState } from "react";
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

const OrderModal: React.FC<OderFormModalProps> = ({
  OpenOrderModal,
  handleClose,
  orderData,
}) => {
  const [isFieldVisible, setIsFieldVisible] = useState(false);

  const orderLabel: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "21.5px",
    fontWeight: "600",
  };

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
    marginTop: 20,
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
            <Typography sx={{ ...orderTitle }}>Full Name </Typography>
            <Typography sx={{ ...orderTitle }}>John Doe</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ ...orderTitle }}>Contact Number </Typography>
            <Typography sx={{ ...orderTitle }}>9876543210</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography sx={{ ...orderTitle }}>Email Id </Typography>
            <Typography sx={{ ...orderTitle }}>johndoe@example.com</Typography>
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
            <TableBody>
              <TableRow style={{ backgroundColor: theme.palette.success.dark }}>
                <TableCell style={tableHead}>Product Name</TableCell>
                <TableCell style={tableHead}>Product Amount</TableCell>
                <TableCell style={tableHead}>Product Description</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={tableLabel}>Data Analytics</TableCell>
                <TableCell style={tableLabel}>30,000Rs</TableCell>
                <TableCell style={tableLabel}>Description</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={tableLabel}>AWS Expert</TableCell>
                <TableCell style={tableLabel}>15,000Rs</TableCell>
                <TableCell style={tableLabel}>Description</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} marginTop={1.5}>
            <Typography sx={{ ...orderTitle }}>Total Amount</Typography>
            <Typography sx={{ ...orderTitle }}>
              {" "}
              {orderData?.totalAmount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4} marginTop={1.5}>
            <Typography sx={{ ...orderTitle }}>Due Date</Typography>
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
            <TableBody>
              <TableRow style={{ backgroundColor: theme.palette.success.dark }}>
                <TableCell style={tableHead}>Transaction Mode</TableCell>
                <TableCell style={tableHead}>Transaction Amount</TableCell>
                <TableCell style={tableHead}>Transaction Date</TableCell>
              </TableRow>

              <TableRow>
                <TableCell style={tableLabel}>Online</TableCell>
                <TableCell style={tableLabel}>15,000Rs</TableCell>
                <TableCell style={tableLabel}>02/02/2024</TableCell>
              </TableRow>
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
