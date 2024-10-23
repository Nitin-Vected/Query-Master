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
  CircularProgress,
} from "@mui/material";
import image from "../../assets/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormValues, LeadPreviewModalProps } from "./interface";
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
import { ChanelList, Counsellor } from "../../pages/leads/interface";
import {
  getAllChannels,
  getallCounsellor,
  getAllLeads,
  updateLead,
} from "../../services/api/userApi";
import moment from "moment";
import EnrollmentModal from "../enrollment-modal";

const LeadPreviewModal: React.FC<LeadPreviewModalProps> = ({
  open = true,
  handleClose,
  data,
  isEdit,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [history, setHistory] = useState(false);
  const userData: any = useSelector((state: RootState) => state);
  const allProducts = userData.product.data.productList;
  const [counsellorList, setCounsellorList] = useState<Counsellor[]>([]);
  const [channelList, setChannelList] = useState<ChanelList[]>([]);
  const allStatus = userData.status.data.statusList;
  const [updatedValues, setUpdatedValues] = useState<Partial<FormValues>>({});
  const [loading, setLoading] = useState(false); // Loader state
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
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
    fullName: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Full Name must not contain digits or special characters"
      )
      .required("Full Name is required"),
    assignedTo: Yup.string().required("Counsellor Name is required"),
    productId: Yup.string().required("Course Category is required"),
    email: Yup.string()
      .email("Invalid email address")
      .matches(
        /^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/,
        "Email must be a valid Gmail, Yahoo, Outlook, or Hotmail address"
      )
      .required("Email is required"),
    // comment: Yup.string().required("comment  is required"),
    description: Yup.string().required("description  is required"),
    contactNumber: Yup.string()
      .matches(
        /^(?:\+91|91)?[6789]\d{9}$/,
        "Contact Number must be a valid Indian mobile number (10 digits, starting with 6, 7, 8, or 9)"
      )
      .required("Contact Number is required"),
    statusId: Yup.string().required("Status is required"),
  });
  const getAllChannelsData = async (token: string) => {
    try {
      const data = await getAllChannels(token); // Fetch the data
      setChannelList(data.chanelList || []); // Ensure to set the counsellorList
    } catch (error) {
      console.error("Failed to fetch counsellor data:", error);
    }
  };
  useEffect(() => {
    getAllChannelsData(userData.auth.userData.token);
  }, []);

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
  const initialProductId =
    allProducts.find((product: any) => product.name === data.product)?.id || ""; // Fallback to empty string if not found
  const initialAllStatusId =
    allStatus.find((product: any) => product.name === data.status)?.id || ""; // Fallback to empty string if not found
  const assignedToById =
    counsellorList.find(
      (counsellor: Counsellor) =>
        `${counsellor.firstName} ${counsellor.lastName}` === data.assignedTo
    )?.id || "";
  const initialChannelId =
    channelList.find((product: ChanelList) => product.name === data.channel)
      ?.id || "";
  const formik = useFormik<FormValues>({
    initialValues: {
      fullName: data.fullName,
      productId: initialProductId,
      assignedTo: assignedToById || data.assignedTo,
      email: data.email,
      statusId: initialAllStatusId,
      comment: "",
      description: data.description,
      contactNumber: String(data.contactNumber), // Convert to string
      productAmount: data.productAmount,
      channelId: initialChannelId,
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      if (Object.keys(updatedValues).length > 0) {
        try {
          setLoading(true); // Show loader
          await updateLead(
            userData.auth.userData.token,
            updatedValues,
            data.id
          );
          await getAllLeads(userData.auth.userData.token, 1, 5);
        } catch (error) {
          console.error("Error updating lead:", error);
        } finally {
          setLoading(false); // Hide loader
          handleClose(); // Close modal
        }
      } else {
        handleClose(); // Close modal when no updated values
      }
    },
  });

  useEffect(() => {
    const changedValues = Object.keys(formik.values).reduce((acc, key) => {
      const typedKey = key as keyof typeof formik.values; // Assert type here
      if (formik.values[typedKey] !== formik.initialValues[typedKey]) {
        acc[typedKey] = formik.values[typedKey];
      }
      return acc;
    }, {} as typeof formik.values); // Assert type for accumulator
    setUpdatedValues(changedValues);
  }, [formik.values]);

  const fetchCounsellorData = async (token: string) => {
    try {
      const data = await getallCounsellor(token); // Fetch the data
      setCounsellorList(data.counsellorList); // Ensure to set the counsellorList
    } catch (error) {
      console.error("Failed to fetch counsellor data:", error);
    }
  };

  useEffect(() => {
    fetchCounsellorData(userData.auth.userData.token);
  }, [userData.auth.userData.token]);

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
                      name="fullName"
                      placeholder="Enter your Full name"
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
                      <Typography style={subTitle}>{data.product}</Typography>
                    ) : (
                      <SelectDropdown
                        name="productId"
                        value={
                          allProducts.find(
                            (product: any) =>
                              product.id === formik.values.productId
                          )?.name || formik.values.productId
                        }
                        onChange={(event) => {
                          const selectedProduct: any = allProducts.find(
                            (product: any) =>
                              product.name === event.target.value
                          );
                          formik.setFieldValue(
                            "productId",
                            selectedProduct ? selectedProduct.id : ""
                          );
                        }}
                        options={allProducts.map((product: any) => ({
                          label: product.name,
                          value: product.name, // Display product name in the dropdown
                        }))}
                        disabled={isEditable}
                        fullWidth={true}
                      />
                    )}
                    {formik.touched.productId && formik.errors.productId && (
                      <FormHelperText error>
                        {typeof formik.errors.productId === "string"
                          ? formik.errors.productId
                          : ""}
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
                        {formik.values.assignedTo || data.assignedTo}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        name="assignedTo"
                        value={
                          formik.values.assignedTo ||
                          (data.assignedTo === "Unassigned"
                            ? "Unassigned"
                            : counsellorList.find(
                                (counsellor: any) =>
                                  `${counsellor.firstName} ${counsellor.lastName}` ===
                                  data.assignedTo
                              )?.id || data.assignedTo) // Default to an empty string if no match found
                        }
                        onChange={(event) => {
                          const selectedCounsellorId = event.target.value;
                          formik.setFieldValue(
                            "assignedTo",
                            selectedCounsellorId
                          );

                          const selectedCounsellor = counsellorList.find(
                            (counsellor: any) =>
                              counsellor.id === selectedCounsellorId
                          );

                          if (selectedCounsellor) {
                          } else if (selectedCounsellorId === "Unassigned") {
                          } else {
                            console.log(
                              "No counsellor found for the selected ID."
                            );
                          }
                        }}
                        options={[
                          ...counsellorList.map((counsellor: any) => ({
                            label: `${counsellor.firstName} ${counsellor.lastName}`,
                            value: counsellor.id, // Ensure you're using id here
                          })),
                          { label: "Unassigned", value: "Unassigned" },
                        ]}
                        disabled={isEditable}
                        fullWidth
                      />
                    )}

                    {formik.touched.assignedTo && formik.errors.assignedTo && (
                      <FormHelperText error>
                        {typeof formik.errors.assignedTo === "string"
                          ? formik.errors.assignedTo
                          : ""}
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
                      <Typography style={subTitle}>{data.status}</Typography>
                    ) : (
                      <SelectDropdown
                        name="statusId"
                        value={
                          formik.values.statusId ||
                          allStatus.find(
                            (status: any) => status.name === data.status
                          )?.id ||
                          "" // Map status name to ID
                        }
                        onChange={(event) => {
                          const selectedId = event.target.value; // Get selected ID
                          if (selectedId == "STATUS0002") {
                            setIsEnrollmentModalOpen(true);
                          }
                          console.log("selectedId 120", selectedId);

                          formik.setFieldValue("statusId", selectedId); // Set the ID in Formik state
                        }}
                        options={allStatus.map((status: any) => ({
                          label: status.name, // Display the status name in the dropdown
                          value: status.id, // Use status.id as the value for each option
                        }))}
                        disabled={isEditable}
                        fullWidth
                      />
                    )}

                    {formik.touched.statusId && formik.errors.statusId && (
                      <FormHelperText error>
                        {typeof formik.errors.statusId === "string"
                          ? formik.errors.statusId
                          : ""}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={isEditable}
                      label="Description *"
                      name="description"
                      placeholder="Enter your Description"
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
                      handleChange={(
                        e: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        let value = e.target.value.replace(/\D/g, "");
                        formik.setFieldValue("contactNumber", value);
                      }}
                      inputProps={{
                        maxLength: 10,
                      }}
                      InputProps={{
                        sx: {
                          maxLength: 10, // Set your desired max length here
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
                      Channel Name *
                    </Typography>
                    {isEditable ? (
                      <Typography style={subTitle}>{data.channel}</Typography>
                    ) : (
                      <SelectDropdown
                        name="channelId"
                        value={
                          formik.values.channelId || // Use Formik's value for channelId
                          channelList
                            .find(
                              (channel: any) => channel.name === data.channel
                            )
                            ?.id?.toString() || // Fallback to find ID by channel name
                          "" // Fallback to empty string if not found
                        }
                        onChange={(event) => {
                          const selectedId = event.target.value; // Get selected ID
                          console.log("selectedId =12", selectedId); // Debugging line
                          formik.setFieldValue("channelId", selectedId); // Set the ID in Formik state
                        }}
                        options={channelList.map((channel: any) => ({
                          label: channel.name, // Display the channel name in the dropdown
                          value: channel.id?.toString(), // Ensure the value is a string
                        }))}
                        disabled={isEditable}
                        fullWidth
                      />
                    )}

                    {formik.touched.channelId && formik.errors.channelId && (
                      <FormHelperText error>
                        {typeof formik.errors.channelId === "string"
                          ? formik.errors.channelId
                          : ""}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormTextField
                      disabled={true}
                      label="ProductAmount *"
                      name="productAmount"
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
                    md={12}
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
                          top: { sx: 0, md: 2 },
                          display: "flex",
                        }}
                        onClick={() => console.log("Button clicked")}
                      >
                        {loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Submit"
                        )}
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

              {/* <Box
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
              </Box> */}
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
      {isEnrollmentModalOpen && (
        <EnrollmentModal
          openEnrollment={isEnrollmentModalOpen}
          closeModal={() => {
            setIsEnrollmentModalOpen(false);
          }}
          data={data}
        />
      )}
    </Dialog>
  );
};

export default LeadPreviewModal;
