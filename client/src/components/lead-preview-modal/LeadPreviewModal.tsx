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

const LeadPreviewModal: React.FC<LeadPreviewModalProps> = ({
  open = true,
  handleClose,
  data,
  isEdit,
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [history, setHistory] = useState(false);
  useEffect(() => {
    if (isEdit) {
      setIsEditable(true);
      console.log(isEditable);
      console.log("data --12 ", data);
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
    channel: Yup.string().required("Channel  is required"),
    description: Yup.string().required("Description  is required"),
    contactNumber: Yup.string()
      .matches(
        /^(?:\+91|91)?[6789]\d{9}$/,
        "Contact Number must be a valid  mobile number"
      )
      .required("Contact Number is required"),
    status: Yup.string().required("Status is required"),
  });

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
      name: "Ram",
      courseName: "",
      counsellorName: "",
      email: "Ram@gmail.com",
      status: "",
      description: "Interested in react course",
      contactNumber: "6844455454",
      channel: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log("values", values);
      handleClose();
    },
  });
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
                      Course Name *
                    </Typography>
                    {isEditable ? (
                      <Typography style={subTitle}>
                        {formik.values.courseName || "React"}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        name="courseName"
                        value={formik.values.courseName || "React"}
                        onChange={formik.handleChange}
                        options={[
                          { label: "React", value: "React" },
                          { label: "Node", value: "Node" },
                        ]}
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
                        {formik.values.counsellorName || "Mohan"}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        value={formik.values.counsellorName || "Mohan"}
                        name="counsellorName"
                        onChange={formik.handleChange}
                        options={[{ label: "Mohan", value: "Mohan" }]}
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
                      label=" Email Id *"
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
                      <Typography style={subTitle}>
                        {formik.values.status || "Not Enrolled"}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        value={formik.values.status || "Not Enrolled"}
                        name="status"
                        onChange={formik.handleChange}
                        options={[
                          { label: "Enrolled", value: "Enrolled" },
                          { label: "Not Enrolled", value: "Not Enrolled" },
                        ]}
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
                    <Typography sx={{ ...lableTitle }}>Channel *</Typography>
                    {isEditable ? (
                      <Typography style={subTitle}>
                        {formik.values.channel || "Youtube"}
                      </Typography>
                    ) : (
                      <SelectDropdown
                        name="channel"
                        value={formik.values.channel || "Youtube"}
                        onChange={formik.handleChange}
                        options={[{ label: "Youtube", value: "Youtube" }]}
                        fullWidth={true}
                      />
                    )}
                    {formik.touched.channel && formik.errors.channel && (
                      <FormHelperText error>
                        {formik.errors.channel}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={4} display={'flex'} justifyContent={"flex-end"}>
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
                        src={image.watch}
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
                    <Box
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: "8px",
                        padding: "10px",
                        backgroundColor: "#fafafa",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            backgroundColor: theme.palette.primary.light,
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
                            Martha{" "}
                            <span
                              style={{
                                color: "#808080",
                                marginLeft: "3px",
                                fontWeight: "500",
                                fontSize: 17,
                              }}
                            >
                              changed the name
                            </span>
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: "500",
                              color: theme.palette.secondary.main,
                              fontSize: 17,
                            }}
                            marginLeft={5}
                          >
                            August 02, 2024 at 8:03PM
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
                          Sarah
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
                          John Doe
                        </Typography>
                      </Box>
                    </Box>
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
