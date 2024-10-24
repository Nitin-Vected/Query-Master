import React, { useEffect, useState } from "react";
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
  CircularProgress,
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
import { ToastContainer } from "react-toastify";

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({
  openEnrollment,
  closeModal,
  data,
}) => {
  const userData: any = useSelector((state: RootState) => state);
  const allProducts = userData.product.data.productList;
  const [selectProducts, setSelectProducts] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false); // To manage loading state
  const [totalAmount, setTotalAmount] = useState<number>();

  const addRow = () => {
    setSelectProducts([...selectProducts, ""]);
  };
  const removeRow = (index: number) => {
    const newProducts = selectProducts.filter((_, i) => i !== index);
    setSelectProducts(newProducts);
  };

  const handleProductChange = (index: number, newValue: string) => {
    const updatedProducts = [...selectProducts];
    updatedProducts[index] = newValue;
    setSelectProducts(updatedProducts);
  };
  const validationSchema = Yup.object({
    transactionProof: Yup.string().required("Transaction proof is required"),
    discount: Yup.number()
      .typeError("Discount must be a number")
      .nullable() // Allow it to be null or undefined
      .max(3000, "Discount cannot be more than 3000"),
    products: Yup.array()
      .of(
        Yup.string().required("Each product is required") // Validation for each product
      )
      .min(1, "At least one product is required"), // Ensure at least one product is select    finalAmount: Yup.string().required("Final Amount is required"),
    amount: Yup.string().required("Amount is required"),
    transactionMode: Yup.string().required("Transaction Mode is required"),
    transactionDate: Yup.string().required("Transaction Date is required"),
    enrollmentDate: Yup.string().required("Enrollment Date is required"),
    dueAmount: Yup.string().required(" DueAmount is required"),
    transactionAmount: Yup.string().required(" transactionAmount is required"),
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

  const onSubmitApi = async (newData: object) => {
    try {
      setIsLoading(true); // Set loading state to true when API call starts
      await enrollLead(userData.auth.userData.token, newData); // Wait for the API call
      setIsLoading(false); // Set loading state to false after success
      closeModal(); // Close the modal after successful API call
    } catch (error) {
      setIsLoading(false); // Ensure loading state is reset in case of error
      console.error("Failed to enroll lead:", error);
    }
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
      dueAmount: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let [firstName, lastName] = data.fullName.split(" ");
      let newData = {
        leadEmail: data.email,
        firstName: firstName,
        lastName: lastName,
        contactNumber: data.contactNumber,
        products: selectProducts,
        transactionMode: values.transactionMode,
        finalAmount: values.finalAmount,
        transactionAmount: values.transactionAmount,
        transactionDate: values.transactionDate,
        transactionProof: values.transactionProof,
        dueAmount: values.dueAmount,
        dueDate: values.enrollmentDate,
      };
      onSubmitApi(newData);
    },
  });
  useEffect(() => {
    // Calculate total based on selected products
    const total = selectProducts.reduce((acc, selectedProductId) => {
      const selectedProduct = allProducts.find(
        (p) => p.id === selectedProductId
      );
      return acc + (selectedProduct?.price || 0);
    }, 0);

    formik.setFieldValue("amount", total);
    const discountValue = parseFloat(formik.values.discount || "0");
    const finalAmount = total - discountValue;
    setTotalAmount(total);
    formik.setFieldValue("finalAmount", finalAmount); // Update finalAmount in formik
    const transactionAmount = parseFloat(
      formik.values.transactionAmount || "0"
    );
    if (!formik.values.discount || formik.values.discount === "") {
      const dueAmount = finalAmount - transactionAmount;
      formik.setFieldValue("dueAmount", dueAmount);
    } else {
      const dueAmount = finalAmount - transactionAmount;
      formik.setFieldValue("dueAmount", dueAmount);
    }
  }, [
    selectProducts,
    allProducts,
    formik.values.discount,
    formik.values.transactionAmount,
    formik.setFieldValue,
  ]);

  // useEffect(() => {
  //   const total = selectProducts.reduce((acc, selectedProductId) => {
  //     const selectedProduct = allProducts.find(
  //       (p) => p.id === selectedProductId
  //     );
  //     return acc + (selectedProduct?.price || 0);
  //   }, 0);

  //   formik.setFieldValue("amount", total);
  //   const discountValue: string = formik.values.discount;
  //   formik.setFieldValue("discount", discountValue);
  //   const finalAmount: number = total - discountValue;
  //   setTotalAmount(total);
  //   formik.setFieldValue("finalAmount", finalAmount); // Update finalAmount in formik
  //   const transactionAmount = formik.values.transactionAmount;

  //   if (!formik.values.discount) {
  //     const allValue = finalAmount - transactionAmount;
  //     formik.setFieldValue("dueAmount", allValue);
  //   }
  // }, [
  //   selectProducts,
  //   allProducts,
  //   formik.values.discount,
  //   formik.values.transactionAmount,
  // ]); // Dependency array includes discount for updates

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
        <ToastContainer />
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
                    (p) => p.id === selectedProductId
                  );
                  console.log("allProducts", allProducts);

                  return (
                    <TableRow key={index}>
                      <TableCell style={tableLable}>
                        {selectProducts.length > 0 && (
                          <SelectDropdown
                            name={`products${index}`}
                            // value={selectedProductId}
                            value={
                              formik.values.products || // Use Formik's value for channelId
                              allProducts
                                .find((channel: any) => channel.id)
                                ?.id?.toString() || // Fallback to find ID by channel name
                              "" // Fallback to empty string if not found
                            }
                            onChange={(e) => {
                              handleProductChange(index, e.target.value);
                              const selectedId = e.target.value; // Get selected ID
                              formik.setFieldValue("products", [selectedId]); // Set the value as an array with the selected ID
                            }}
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
                        )}

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
                disabled={true}
                placeholder="Total Amount"
                type="number"
                formik={formik}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value.replace(/\D/g, "");
                  formik.setFieldValue("amount", value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="Discount"
                name="discount"
                placeholder="Total Discount"
                type="number"
                formik={formik}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
                  if (Number(value) > 3000) {
                    value = "3000"; // Set maximum value to 3000
                  }
                  formik.setFieldValue("discount", value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="Final Amount"
                name="finalAmount"
                type="number"
                disabled={true}
                placeholder="Rs"
                formik={formik}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value.replace(/\D/g, "");
                  formik.setFieldValue("finalAmount", value);
                }}
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
                type="number"
                placeholder="Rs"
                formik={formik}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value.replace(/\D/g, ""); // Ensure only numbers
                  const finalAmount = Number(formik.values.finalAmount); // Get final amount from formik state
                  if (Number(value) > finalAmount) {
                    value = finalAmount.toString(); // Limit transactionAmount to finalAmount
                  }
                  formik.setFieldValue("transactionAmount", value); // Set the transaction amount in formik state
                }}
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
            {formik.values.transactionMode === "Online" ? (
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
            ) : null}

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
            <Grid item xs={12} sm={6} md={4}>
              <FormTextField
                label="DueAmount *"
                name="dueAmount"
                placeholder="dueAmount"
                formik={formik}
                handleChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value.replace(/\D/g, "");
                  formik.setFieldValue("dueAmount", value);
                }}
              />
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
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Submit"
            )}
          </ButtonView>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EnrollmentModal;
