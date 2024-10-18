import React from "react";
import {
  Dialog,
  DialogContent,
  Grid,
  DialogActions,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import ButtonView from "../../template/button-view";
import ModalHeader from "../../template/modal-header";
import { LeadFormModalProps } from "./interface";
import FormTextField from "../../template/form-text-field";
import FormSelectField from "../../template/form-select-field";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Full name is required"),
  contactNumber: Yup.string()
    .required("Contact number is required")
    .matches(/^[0-9]{10}$/, "Enter a valid 10 digit number"),
  leadEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  course: Yup.string().required("Course is required"),
  status: Yup.string().required("Status is required"),
  channel: Yup.string().required("Channel is required"),
});

const LeadFormModal: React.FC<LeadFormModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      contactNumber: "",
      leadEmail: "",
      course: "Course1",
      status: "Interested",
      channel: "Instagram",
      description: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (onSubmit) {
        onSubmit(values);
      }
      if (onClose) {
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
                label="Course"
                name="course"
                options={[
                  { label: "Course 1", value: "Course1" },
                  { label: "Course 2", value: "Course2" },
                  { label: "Course 3", value: "Course3" },
                ]}
                formik={formik}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {/* Use FormSelectField for Status */}
              <FormSelectField
                label="Status"
                name="status"
                options={[
                  { label: "Interested", value: "Interested" },
                  { label: "Enrolled", value: "Enrolled" },
                ]}
                formik={formik}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormSelectField
                label="Channel"
                name="channel"
                options={[
                  { label: "Youtube", value: "Youtube" },
                  { label: "Instagram", value: "Instagram" },
                  { label: "Facebook", value: "Facebook" },
                ]}
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
            onClick={() => console.log("Button clicked")}
          >
            Submit
          </ButtonView>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeadFormModal;
