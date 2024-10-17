import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  DialogActions,
  Typography,
  FormHelperText,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import * as Yup from "yup";
import theme from "../../theme/theme";

// Define the types for props
interface LeadFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (leadData: any) => void;
}

// Yup Validation schema
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
  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      fullName: "",
      contactNumber: "",
      leadEmail: "",
      course: "",
      status: "",
      channel: "",
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
      <DialogTitle
        style={{ textAlign: "center", position: "relative", paddingTop: 0 }}
      >
        <Box
          component={"span"}
          sx={{
            background: theme.palette.background.paper,
            color: "white",
            padding: 1,
          }}
        >
          Create Lead
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Full Name<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="John Doe"
                error={
                  formik.touched.fullName && Boolean(formik.errors.fullName)
                }
                helperText={formik.touched.fullName && formik.errors.fullName}
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Contact Number<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                name="contactNumber"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="9774432345"
                error={
                  formik.touched.contactNumber &&
                  Boolean(formik.errors.contactNumber)
                }
                helperText={
                  formik.touched.contactNumber && formik.errors.contactNumber
                }
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Email Id<span style={{ color: "red" }}>*</span>
              </Typography>
              <TextField
                fullWidth
                required
                name="leadEmail"
                value={formik.values.leadEmail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="johndoe@gmail.com"
                error={
                  formik.touched.leadEmail && Boolean(formik.errors.leadEmail)
                }
                helperText={formik.touched.leadEmail && formik.errors.leadEmail}
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Course<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl
                fullWidth
                error={formik.touched.course && Boolean(formik.errors.course)}
              >
                <Select
                  name="course"
                  value={formik.values.course}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  sx={{
                    height: 40,
                    "& .MuiSelect-select": {
                      padding: "8px 14px",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Course</em>
                  </MenuItem>
                  <MenuItem value="Course1">Course 1</MenuItem>
                  <MenuItem value="Course2">Course 2</MenuItem>
                  <MenuItem value="Course3">Course 3</MenuItem>
                </Select>
                {formik.touched.course && formik.errors.course && (
                  <FormHelperText>{formik.errors.course}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Status<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl
                fullWidth
                error={formik.touched.status && Boolean(formik.errors.status)}
              >
                <Select
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  sx={{
                    height: 40,
                    "& .MuiSelect-select": {
                      padding: "8px 14px",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Status</em>
                  </MenuItem>
                  <MenuItem value="Interested">Interested</MenuItem>
                  <MenuItem value="Enrolled">Enrolled</MenuItem>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <FormHelperText>{formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">
                Channel<span style={{ color: "red" }}>*</span>
              </Typography>
              <FormControl
                fullWidth
                error={formik.touched.channel && Boolean(formik.errors.channel)}
              >
                <Select
                  name="channel"
                  value={formik.values.channel}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  displayEmpty
                  sx={{
                    height: 40,
                    "& .MuiSelect-select": {
                      padding: "8px 14px",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Channel</em>
                  </MenuItem>
                  <MenuItem value="Youtube">Youtube</MenuItem>
                  <MenuItem value="Instagram">Instagram</MenuItem>
                  <MenuItem value="Facebook">Facebook</MenuItem>
                </Select>
                {formik.touched.channel && formik.errors.channel && (
                  <FormHelperText>{formik.errors.channel}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2">Description</Typography>
              <TextField
                fullWidth
                required
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Description of the lead"
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
                sx={{
                  "& .MuiInputBase-root": {
                    height: 40,
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", paddingRight: 25 }}>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#ffffff",
              color: "#000000",
              width: "100px",
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeadFormModal;