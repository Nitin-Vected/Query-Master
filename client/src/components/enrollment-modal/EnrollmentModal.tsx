import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  DialogActions,
  Typography,
  FormHelperText,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import RemoveIcon from "@mui/icons-material/Remove";
import theme from "../../theme/theme";
import { CSSProperties } from "styled-components";
import SelectDropdown from "../../template/select-dropdown";
import ButtonView from "../../template/button-view";
import { Add } from "@mui/icons-material";
import ModalHeader from "../../template/modal-header";
import FormTextField from "../../template/form-text-field";
import FormSelectField from "../../template/form-select-field";
import { EnrollmentModalProps } from "./interface";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { enrollLead } from "../../services/api/userApi";

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  openEnrollment,
  closeModal,
  data,
}) => {
  console.log("data", data);
  const userData: any = useSelector((state: RootState) => state);
  const allProducts = userData.product.data.productList;
  const [selectProducts, setSelectProducts] = useState<string[]>([""]);

  const addRow = () => {
    setSelectProducts([...selectProducts, ""]);
  };
  const removeRow = (index: number) => {
    const newProducts = selectProducts.filter((_, i) => i !== index);
    setSelectProducts(newProducts);
  };
  const handleProductChange = (index: number, value: string) => {
    const updatedSelectedProducts = [...selectProducts];
    updatedSelectedProducts[index] = value; // Update the selected product id at the specific index
    setSelectProducts(updatedSelectedProducts);
  };
  const validationSchema = Yup.object({
    // transactionProof: Yup.string().required("Transaction proof is required"),
    // discount: Yup.string().required("Discount is required"),
    // product: Yup.string().required("Product is required"),
    // transactionAmount: Yup.string().required("Transaction Amount is required"),
    // finalAmount: Yup.string().required("Final Amount is required"),
    // amount: Yup.string().required("Amount is required"),
    // transactionMode: Yup.string().required("Transaction Mode is required"),
    // transactionDate: Yup.string().required("Transaction Date is required"),
    // enrollmentDate: Yup.string().required("Enrollment Date is required"),
  });
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
  const tableLable: CSSProperties = {
    border: `1px solid ${theme.palette.info.dark}`,
    padding: "6px",
    borderWidth: 1,
    fontWeight: "400",
    fontSize: 14,
    color: theme.palette.secondary.main,
    textAlign: "center",
  };

  const formik = useFormik({
    initialValues: {
      transactionProof: "",
      amount: "",
      products: selectProducts,
      discount: "",
      finalAmount: "",
      transactionMode: "Online",
      transactionAmount: "",
      transactionDate: "",
      enrollmentDate: "",
      dueAmount: "120",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let newData = {
        leadEmail: data.email,
        firstName: data.fullName,
        lastName: "Gi",
        contactNumber: data.contactNumber,
        products: selectProducts,
        paymentMode: values.transactionMode,
        finalAmount: values.finalAmount,
        transactionAmount: values.transactionAmount,
        transactionDate: values.transactionDate,
        transactionProof: values.transactionProof,
        dueAmount: values.dueAmount,
        dueDate: values.enrollmentDate,
      };

      enrollLead(userData.auth.userData.token, newData);
      closeModal();
    },
  });
  const enrollmentLable: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "17px",
    fontWeight: "600",
  };
  const enrollmentTitle: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "15px",
    fontWeight: "400",
  };

  return (
    <Dialog
      sx={{
        border: "none",
        borderRadius: "none",
      }}
      open={openEnrollment}
      fullWidth
      maxWidth="md"
    >
      <ModalHeader
        title={"Enrollment Form"}
        onClose={() => {
          closeModal();
        }}
      />
      <form onSubmit={formik.handleSubmit}>
        <DialogContent
          sx={{
            padding: { xs: "12px", sm: "20px 40px" },
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              ...enrollmentLable,
            }}
          >
            User Details:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ ...enrollmentTitle }}>Full Name :</Typography>
              <Typography sx={{ ...enrollmentTitle }}>
                {data.fullName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ ...enrollmentTitle }}>
                Contact Number :
              </Typography>
              <Typography sx={{ ...enrollmentTitle }}>
                {data.contactNumber}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ ...enrollmentTitle }}>Email Id :</Typography>
              <Typography sx={{ ...enrollmentTitle }}>{data.email}</Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2} marginTop={1}>
            <Grid
              item
              xs={12}
              sx={{
                display: { xs: "block", sm: "flex" },
                justifyContent: "space-between",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  ...enrollmentLable,
                }}
              >
                Product Details:
              </Typography>
              <ButtonView
                startIcon={<Add />}
                onClick={addRow}
                type="button"
                isEditable={true}
                sx={{
                  height: "30px",
                  borderRadius: "5px",
                  width: "120px",
                }}
                style={{ marginTop: 3 }}
              >
                Add More
              </ButtonView>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow
                  style={{ backgroundColor: theme.palette.success.dark }}
                >
                  <TableCell style={tableHead}>Product</TableCell>
                  <TableCell style={tableHead}>Product Amount</TableCell>
                  <TableCell style={tableHead}>Product Description</TableCell>
                  <TableCell style={tableHead}>Remove</TableCell>
                </TableRow>
                {selectProducts.map((selectedProductId, index) => {
                  const selectedProduct = allProducts.find(
                    (p: any) => p.id === selectedProductId
                  );
                  return (
                    <TableRow key={index}>
                      <TableCell style={tableLable}>
                        <SelectDropdown
                          name={`product_${index}`}
                          value={selectedProductId}
                          onChange={(e) =>
                            handleProductChange(index, e.target.value)
                          }
                          options={allProducts.map((product: any) => ({
                            label: product.name,
                            value: product.id,
                          }))}
                          sx={{
                            "& .MuiSelect-select": {
                              padding: "8px 14px",
                            },
                          }}
                        />
                        {formik.touched.products && formik.errors.products && (
                          <FormHelperText error>
                            {formik.errors.products}
                          </FormHelperText>
                        )}
                      </TableCell>

                      {/* Display product amount based on selection */}
                      <TableCell style={tableLable}>
                        {selectedProduct ? selectedProduct.price : ""}
                      </TableCell>

                      {/* Display product description based on selection */}
                      <TableCell style={tableLable}>
                        {selectedProduct ? selectedProduct.description : ""}
                      </TableCell>
                      <TableCell style={tableLable}>
                        <IconButton
                          aria-label="remove"
                          onClick={() => {
                            removeRow(index);
                          }}
                          sx={{
                            color: theme.palette.text.primary,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.error.light,
                            "&:hover": {
                              backgroundColor: theme.palette.error.main,
                            },
                            padding: "0",
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container spacing={2} marginTop={1}>
            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="Total Amount"
                name="amount"
                placeholder="Total Amount"
                formik={formik}
              />
              {/* <Typography variant="subtitle2" sx={{ ...enrollmentTitle }}>
                                Total Amount<span style={{ color: "red" }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                                name="amount"
                                value={formik.values.amount}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Rs"
                                error={formik.touched.amount && Boolean(formik.errors.amount)}
                                helperText={formik.touched.amount && formik.errors.amount}
                                sx={{
                                    "& .MuiInputBase-root": {
                                        height: 40,
                                        borderRadius: "8px",
                                    },
                                }}
                            /> */}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="Discount"
                name="discount"
                placeholder="Rs"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="Final Amount"
                name="finalAmount"
                placeholder="Rs"
                formik={formik}
              />
            </Grid>
          </Grid>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              ...enrollmentLable,
              marginTop: 4,
            }}
          >
            Transaction Details:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <FormSelectField
                label="Transaction Mode"
                name="transactionMode"
                options={[
                  { label: "Cash", value: "Cash" },
                  { label: "Online", value: "Online" },
                ]}
                formik={formik}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="Transaction Amount"
                name="transactionAmount"
                placeholder="Rs"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ ...enrollmentTitle }}>
                Transaction Date<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="transactionDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.transactionDate}
                placeholder="Transaction Date"
                InputLabelProps={{
                  shrink: true, // This ensures that the label stays above the input field
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                }}
              />

              {formik.touched.transactionDate &&
                formik.errors.transactionDate && (
                  <FormHelperText error>
                    {formik.errors.transactionDate}
                  </FormHelperText>
                )}
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ ...enrollmentTitle }}>
                Transaction Proof<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
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
            <Grid item xs={12} sm={6} md={4}>
              <Typography sx={{ ...enrollmentTitle }}>
                Enrollment Date<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                name="enrollmentDate"
                type="date"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.enrollmentDate}
                placeholder="Enrollment Date"
                InputLabelProps={{
                  shrink: true, // This ensures that the label stays above the input field
                }}
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                }}
              />

              {formik.touched.enrollmentDate &&
                formik.errors.enrollmentDate && (
                  <FormHelperText error>
                    {formik.errors.enrollmentDate}
                  </FormHelperText>
                )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", paddingRight: 25 }}>
          <ButtonView
            type="submit"
            isEditable={true}
            sx={{ left: -11 }}
            onClick={() => console.log("Button clicked")}
          >
            Submit
          </ButtonView>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EnrollmentModal;
