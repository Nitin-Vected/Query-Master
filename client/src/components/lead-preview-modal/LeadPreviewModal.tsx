import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  FormHelperText,
  Avatar,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import image from "../../assets/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LeadPreviewModalProps } from "./interface";
import {
  AccessTime,
  EventNote,
  RemoveRedEyeOutlined,
} from "@mui/icons-material";
import { CSSProperties } from "styled-components";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import theme from "../../theme/theme";
import CommentIcon from "@mui/icons-material/Comment";
import SelectDropdown from "../../template/select-dropdown";
import ButtonView from "../../template/button-view";
import ModalHeader from "../../template/modal-header";
import editIcon from "../../assets/image/editIcon.png";
import FormTextField from "../../template/form-text-field";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Counsellor } from "../../pages/leads/interface";
import { getallCounsellor } from "../../services/api/userApi";
import moment from "moment";

const LeadPreviewModal: React.FC<LeadPreviewModalProps> = ({
  open = true,
  handleClose,
  data,
  isEdit,
}) => {
  useEffect(() => {
    console.log("data = 1333", data.auditLogs);
  }, [data]);
  const [isEditable, setIsEditable] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [history, setHistory] = useState(false);
  const userData: any = useSelector((state: RootState) => state);
  const allProducts = userData.product.data.productList;
  const [counsellorList, setCounsellorList] = useState<Counsellor[]>([]);

  useEffect(() => {
    if (isEdit) {
      setIsEditable(true);
      console.log(isEditable);
    } else {
      setIsEditable(false);
    }
  }, [isEdit]);

  const handleToggleReminder = () => {
    setReminder((prev) => !prev);
  };
  const handleToggleHistory = () => {
    setHistory((prev) => !prev);
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Full Name must not contain digits or special characters"
      )
      .required("Full Name is required"),
    counsellorName: Yup.string().required("Counsellor Name is required"),
    courseName: Yup.string().required("Course Category is required"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/,
        "Email must be a valid Gmail, Yahoo, Outlook, or Hotmail address"
      )
      .required("Email is required"),
    // channel: Yup.string().required("Channel  is required"),
    description: Yup.string().required("Description  is required"),
    contactNumber: Yup.string()
      .matches(
        /^(?:\+91|91)?[6789]\d{9}$/,
        "Contact Number must be a valid  mobile number"
      )
      .required("Contact Number is required"),
    status: Yup.string().required("Status is required"),
  });
  const allStatus = userData.status.data.statusList;

  const lableTitle: CSSProperties = {
    color: theme.palette.secondary.main,
    fontSize: "15px",
    fontWeight: "400",
  };
  const subTitle: CSSProperties = {
    color: "#aeacac",
    marginTop: 5,
    fontSize: 14,
  };

  const formik = useFormik({
    initialValues: {
      name: data.fullName,
      courseName: data.product,
      counsellorName: data.assignedTo,
      email: data.email,
      status: data.status,
      description: data.description,
      contactNumber: data.contactNumber,
      channel: data.channel,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values", values);
      handleClose();
    },
  });
  const fetchCounsellorData = async (token: string) => {
    try {
      const data = await getallCounsellor(token); // Fetch the data

      setCounsellorList(data.counsellorList); // Ensure to set the counsellorList
    } catch (error) {
      console.error("Failed to fetch counsellor data:", error);
    }
  };
  const options = counsellorList.map((user) => ({
    label: `${user.firstName} ${user.lastName}`, // Concatenate first and last names
    value: `${user.firstName} ${user.lastName}`,
  }));
  useEffect(() => {
    fetchCounsellorData(userData.auth.userData.token);
  }, [userData.auth.userData.token]);

  options.push({ label: "Unassigned", value: "Unassigned" });
  return (
    <Dialog
      sx={{
        border: "none",
        borderRadius: "none",
      }}
      open={open}
      fullWidth
      maxWidth="md"
      BackdropProps={{
        style: {
          backgroundColor: theme.palette.action.focus,
          backdropFilter: "blur(2px)",
        },
      }}
    >
      <ModalHeader title={"Lead Info"} onClose={handleClose} />
      <DialogContent
        sx={{
          padding: { xs: "12px", sm: "20px 40px" },
        }}
      >
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
        >
          {isEdit && (
            <Button
              sx={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                height: 35,
                borderWidth: 0.1,
                borderStyle: "solid",
                borderRadius: "4px",
                width: "120px",
                marginBottom: 1.5,
              }}
              startIcon={
                isEditable ? (
                  <img
                    src={editIcon}
                    alt="Edit"
                    style={{ width: "18px", height: "20px" }}
                  />
                ) : (
                  <RemoveRedEyeOutlined
                    sx={{ color: theme.palette.secondary.main }}
                    style={{ width: "20px", height: "20px" }}
                  />
                )
              }
              style={{
                color: theme.palette.secondary.main,
                fontSize: "13.5px",
                textTransform: "none",
                fontWeight: "500",
              }}
              onClick={() => setIsEditable(!isEditable)}
            >
              {isEditable ? " Edit Lead" : "Preview"}
            </Button>
          )}
        </Box>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                padding: 1.5,
                borderRadius: "3px",
                borderColor: "lightgrey",
              }}
            >
              <Box display="flex" flexDirection="column" mb={2} gap={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={isEditable}
                      label="Full Name *"
                      name="name"
                      placeholder="Enter your name"
                      formik={formik}
                      InputProps={{
                        sx: {
                          marginLeft: isEditable ? -1.5 : 0,
                          border: isEditable ? 0 : "1.1px solid #dddcdc",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 0,
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ ...lableTitle }}>
                      Product Name *
                    </Typography>
                    {isEditable ? (
                      <Typography style={subTitle}>
                        {formik.values.courseName || "CourseName"}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        name="courseName"
                        value={formik.values.courseName || data.product}
                        onChange={formik.handleChange}
                        options={allProducts.map((product: any) => ({
                          label: product.name,
                          value: product.name,
                        }))}
                        disabled={isEditable}
                        fullWidth={true}
                      />
                    )}
                    {formik.touched.courseName && formik.errors.courseName && (
                      <FormHelperText error>
                        {formik.errors.courseName}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Counsellor Name */}
                  <Grid item xs={12} md={4}>
                    <Typography sx={{ ...lableTitle }}>
                      Counsellor Name *
                    </Typography>
                    {isEditable ? (
                      <Typography style={subTitle}>
                        {formik.values.counsellorName}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        value={formik.values.counsellorName}
                        name="counsellorName"
                        onChange={formik.handleChange}
                        options={options}
                        fullWidth={true}
                      />
                    )}

                    {formik.touched.counsellorName &&
                      formik.errors.counsellorName && (
                        <FormHelperText error>
                          {formik.errors.counsellorName}
                        </FormHelperText>
                      )}
                  </Grid>
                </Grid>
              </Box>
              <Box display="flex" flexDirection="column" mb={2} gap={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={isEditable}
                      label="Email Id *"
                      name="email"
                      placeholder="Enter your email"
                      value={formik.values.email} // Ensure it's binding correctly
                      onChange={formik.handleChange} // Handle input changes
                      formik={formik}
                      InputProps={{
                        sx: {
                          marginLeft: isEditable ? -1.5 : 0,
                          border: isEditable ? 0 : "1.1px solid #dddcdc",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 0,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Typography sx={{ ...lableTitle }}>Status * </Typography>
                    {isEditable ? (
                      <Typography style={subTitle}>
                        {formik.values.status || data.status}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        name="status"
                        value={formik.values.status || data.status || ""}
                        onChange={(event) => {
                          const selectedStatusId = event.target.value;
                          formik.setFieldValue("status", selectedStatusId);
                        }}
                        options={allStatus.map((status: any) => ({
                          label: status.name, // Display the status name in the dropdown
                          value: status.name, // Use status.id as the value for each option
                          id: status.id, // Add the ID for later use
                        }))}
                        fullWidth={true}
                      />
                    )}

                    {formik.touched.status && formik.errors.status && (
                      <FormHelperText error>
                        {formik.errors.status}
                      </FormHelperText>
                    )}
                  </Grid>

                  {/* Counsellor Name */}
                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={isEditable}
                      label="Description *"
                      name="description"
                      placeholder="Enter your description"
                      formik={formik}
                      InputProps={{
                        sx: {
                          marginLeft: isEditable ? -1.5 : 0,
                          border: isEditable ? 0 : "1.1px solid #dddcdc",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 0,
                          },
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box display="flex" flexDirection="column" mb={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={isEditable}
                      label="ContactNumber *"
                      name="contactNumber"
                      placeholder="Enter your contactNumber"
                      formik={formik}
                      InputProps={{
                        sx: {
                          marginLeft: isEditable ? -1.5 : 0,
                          border: isEditable ? 0 : "1.1px solid #dddcdc",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 0,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={true}
                      label="Channel *"
                      name="channel"
                      formik={formik}
                      InputProps={{
                        sx: {
                          marginLeft: isEditable ? -1.5 : 0,
                          border: isEditable ? 0 : "1.1px solid #dddcdc",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: 0,
                          },
                        },
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={4}
                    display={"flex"}
                    justifyContent={"flex-end"}
                  >
                    {isEditable ? (
                      <></>
                    ) : (
                      <ButtonView
                        type="submit"
                        disabled={isEditable}
                        isEditable={true}
                        style={{ marginTop: 3 }}
                        sx={{
                          top: { sx: 0, md: 18 },
                          display: "flex",
                        }}
                        onClick={() => console.log("Button clicked")}
                      >
                        Submit
                      </ButtonView>
                    )}
                  </Grid>
                </Grid>
              </Box>

              <Typography
                sx={{
                  display: "flex",
                  fontSize: 13,
                  alignItems: "center",
                  justifyContent: "flex-end",
                  color: theme.palette.text.disabled,
                  marginTop: -1.5,
                }}
              >
                Lead Created On: 1:03 AM Monday, 23 Sept 24
              </Typography>
            </Box>
            <Box
              sx={{
                border: theme.palette.info.main,
                borderRadius: "8px",
                borderWidth: 1,
                borderStyle: "solid",
                padding: "8px 16px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CommentIcon style={{ height: 20 }} />
                <Typography sx={{ ...lableTitle }}>Comment</Typography>
              </Box>
              <FormTextField
                name="comment"
                variant="standard"
                multiline
                placeholder="Enter Note Text"
                formik={formik}
                InputProps={{
                  disableUnderline: true,
                }}
              />

              <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-end"}
                alignItems={"flex-end"}
              >
                <ButtonView
                  type="submit"
                  isEditable={true}
                  style={{ marginTop: 3 }}
                  onClick={() => console.log("Button clicked")}
                >
                  Save
                </ButtonView>
              </Box>
            </Box>

            <Box marginTop={3}>
              <Box
                marginTop={1}
                style={{
                  padding: "1px",
                  border: theme.palette.info.main,
                  borderRadius: "8px",
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <Accordion
                  expanded={reminder}
                  onChange={handleToggleReminder}
                  sx={{
                    boxShadow: "none",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{ color: theme.palette.action.hover }}
                      />
                    }
                    aria-controls="reminder-content"
                    id="reminder-header"
                    sx={{
                      height: 12,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ flexGrow: 1 }}
                    >
                      <img
                        src={image.history}
                        alt="history"
                        style={{
                          width: "20px",
                          marginRight: "5px",
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: 15,
                          color: theme.palette.secondary.main,
                          marginTop: 1,
                        }}
                      >
                        Reminder
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ padding: "12px", marginTop: -2.5 }}>
                      <Box
                        sx={{
                          flexDirection: "row",
                          alignItems: "center",
                          display: "flex",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: "600",
                            fontSize: 15,
                            color: theme.palette.secondary.main,
                            marginTop: 1,
                          }}
                        >
                          Create Reminder For :
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" marginTop={2}>
                        <Box
                          display="flex"
                          flexDirection="row"
                          alignItems="center"
                        >
                          <EventNote
                            style={{
                              paddingInline: 5,
                              width: "22px",
                              color: theme.palette.action.active,
                            }}
                          />
                          <Typography
                            sx={{
                              fontWeight: "500",
                              fontSize: 14,
                              color: theme.palette.secondary.main,
                              marginLeft: 0.5,
                            }}
                          >
                            Date :
                          </Typography>

                          <TextField
                            type="date"
                            id="dateInput"
                            size="small"
                            sx={{
                              marginRight: "12px",
                              marginLeft: 0.5,
                            }}
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Box>
                        <AccessTime
                          style={{
                            paddingInline: 5,
                            width: "22px",
                            color: theme.palette.action.active,
                          }}
                        />
                        <Typography
                          style={{
                            fontWeight: "500",
                            fontSize: 14,
                            color: theme.palette.secondary.main,
                          }}
                        >
                          Time :
                        </Typography>
                        <TextField
                          type="time"
                          size="small"
                          sx={{
                            marginRight: "12px",
                            marginLeft: 1,
                          }}
                        />
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Box
                style={{
                  padding: "0.9px",
                  border: theme.palette.info.main,
                  borderRadius: "8px",
                  borderWidth: 0.5,
                  borderStyle: "solid",
                }}
                marginTop={1}
              >
                <Accordion
                  sx={{
                    boxShadow: "none",
                  }}
                  expanded={history}
                  onChange={handleToggleHistory}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{ color: theme.palette.action.hover }}
                      />
                    }
                    aria-controls="reminder-content"
                    id="reminder-header"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ flexGrow: 1 }}
                    >
                      <img
                        src={image.history}
                        alt="history"
                        style={{
                          width: "20px",
                          marginRight: "5px",
                        }}
                      />

                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: 15,
                          color: theme.palette.secondary.main,
                        }}
                      >
                        History
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    {data?.auditLogs?.length > 0 ? (
                      data.auditLogs.map(
                        ({
                          field,
                          oldValue,
                          newValue,
                          editedBy,
                          createdAt,
                        }: any) => {
                          const formattedDate = moment(createdAt).format(
                            "MMMM D, YYYY h:mm A"
                          );

                          return (
                            <Box
                              sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                padding: "10px",
                                backgroundColor: "#fafafa",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 1.5,
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <Avatar
                                  sx={{
                                    backgroundColor:
                                      theme.palette.primary.light,
                                    marginRight: "8px",
                                    height: 35,
                                    width: 35,
                                  }}
                                ></Avatar>
                                <Box
                                  flexDirection={"row"}
                                  display={"flex"}
                                  alignItems={"center"}
                                >
                                  <Typography
                                    variant="body1"
                                    sx={{
                                      fontWeight: "500",
                                      color: theme.palette.secondary.main,
                                      fontSize: 17,
                                    }}
                                  >
                                    {editedBy}
                                  </Typography>
                                </Box>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "45px",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    marginRight: "8px",
                                    fontWeight: "500",
                                    color: theme.palette.secondary.main,
                                    fontSize: 17,
                                  }}
                                >
                                  Changed the {field} At
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    fontWeight: "500",
                                    color: theme.palette.secondary.main,
                                    fontSize: 17,
                                  }}
                                >
                                  {formattedDate}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginLeft: "45px",
                                }}
                              >
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    marginRight: "8px",
                                    fontWeight: "500",
                                    color: theme.palette.secondary.main,
                                    fontSize: 17,
                                  }}
                                >
                                  {oldValue}
                                </Typography>
                                <Typography
                                  sx={{
                                    marginRight: "8px",
                                    fontWeight: "500",
                                    color: theme.palette.secondary.main,
                                    fontSize: 35,
                                  }}
                                  variant="body1"
                                >
                                  ➡
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="textSecondary"
                                  sx={{
                                    marginLeft: "5px",
                                    fontWeight: "500",
                                    color: theme.palette.secondary.main,
                                    fontSize: 17,
                                  }}
                                >
                                  {newValue}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        }
                      )
                    ) : (
                      <Typography>No audit logs available.</Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </form>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default LeadPreviewModal;
