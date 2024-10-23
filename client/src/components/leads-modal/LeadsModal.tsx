import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, Grid, DialogActions } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonView from "../../template/button-view";
import ModalHeader from "../../template/modal-header";
import { Channels, LeadFormModalProps } from "./interface";
import FormTextField from "../../template/form-text-field";
import FormSelectField from "../../template/form-select-field";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getAllChannels } from "../../services/api/userApi";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  contactNumber: Yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10 digit number"),
  leadEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  productId: Yup.string().required("Product is required"),
  statusId: Yup.string().required("Status is required"),
  channelId: Yup.string().required("Channel is required"),
  productAmount: Yup.string().required("Product Amount is required"),
  discount: Yup.number()
    .typeError("Discount must be a number")
    .nullable() // Allow it to be null or undefined
    .max(3000, "Discount cannot be more than 3000"),
});

const LeadFormModal: React.FC<LeadFormModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [allChannels, setAllChannels] = useState<Channels[]>([]);
  const userData: any = useSelector((state: RootState) => state);
  const allProducts = userData.product.data.productList;
  const allStatus = userData.status.data.statusList;
  const getChannels = async (token: string) => {
    try {
      const data = await getAllChannels(token);
      setAllChannels(data.chanelList);
    } catch (error) {
      console.error("Failed to get all Channel:", error);
    }
  };

  useEffect(() => {
    getChannels(userData.auth.userData.token);
  }, [userData.auth.userData.token]);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      contactNumber: "",
      leadEmail: "",
      productId: "PRODUCT0001",
      statusId: "STATUS0001",
      channelId: "CHANNEL0001",
      productAmount: "",
      discount: "",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
         onSubmit(values);
        onClose();
      }
    },
  });
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <ModalHeader title={"Create Lead"} onClose={onClose} />
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="Full Name"
                name="fullName"
                placeholder="John Doe"
                formik={formik}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="Contact Number"
                name="contactNumber"
                placeholder="9774432345"
                formik={formik}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="Email Id"
                name="leadEmail"
                placeholder="johndoe@gmail.com"
                formik={formik}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormSelectField
                label="Product"
                name="productId"
                options={allProducts.map((product: any) => ({
                  label: product.name,
                  value: product.id,
                }))}
                formik={formik}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="Product Amount"
                name="productAmount"
                placeholder="Rs"
                formik={formik}
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormTextField
                label="Discount"
                name="discount"
                placeholder="Rs"
                formik={formik}
                type="number"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Use FormSelectField for Status */}
              <FormSelectField
                label="Status"
                name="statusId"
                options={allStatus.map((status: any) => ({
                  label: status.name,
                  value: status.id,
                }))}
                formik={formik}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormSelectField
                label="Channel"
                name="channelId"
                options={allChannels.map((channel: any) => ({
                  label: channel.name, // Product name as label
                  value: channel.id, // Product id as value
                }))}
                formik={formik}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormTextField
                label="Description"
                name="description"
                placeholder="Description of the lead"
                formik={formik}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", paddingRight: 25 }}>
          <ButtonView
            type="submit"
            isEditable={true}
            style={{ marginTop: 3 }}
            sx={{ left: -11 }}
          >
            Submit
          </ButtonView>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeadFormModal;
