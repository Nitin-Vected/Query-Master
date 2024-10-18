import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Modal,
  IconButton,
  InputAdornment,

} from '@mui/material';
import { LeadPreviewModalProps } from "./interface";
import image from "../../assets/image";
import * as Yup from "yup";
import { CSSProperties } from "styled-components";
import CloseIcon from "@mui/icons-material/Close"; // Import Close Icon from Material UI
import theme from "../../theme/theme";
import { Portrait,AutoStories, Description, SupervisorAccount, LocalPhone,Email, BarChart} from '@mui/icons-material';

const LeadPreviewModal: React.FC<LeadPreviewModalProps> = ({
  open = false,
  handleOpen,
  handleClose,
  data,
}) => {
  console.log("data --12 ", data);
  const [expanded, setExpanded] = useState<string | false>(false);
  const [comment, setComment] = useState('');
  const [reminderDate, setReminderDate] = useState<Date | null>(new Date());

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const [isEditable, setIsEditable] = useState(false);
  useEffect(() => {
    if (data.type === "Edit") {
      setIsEditable(true);
    } else {
      setIsEditable(false);
    }
  }, [data.type]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(
        /^[A-Za-z\s]+$/,
        "Full Name must not contain digits or special characters"
      )
      .required("Full Name is required"),
    contactNumber: Yup.string()
      .required("Contact Number is required")
      .matches(/^[0-9]+$/, "Contact Number must be digits only"),
    status: Yup.string().required("Status is required"),
    courseName: Yup.string().required("Course Name is required"),
    discount: Yup.number().required("Discount is required").min(0),
    finalAmount: Yup.number().required("Final Amount is required").min(0),
  });
  const [showNotes, setShowNotes] = useState(false); // State to manage notes visibility
  const [reminder, setReminder] = useState(false);
  const [history, setHistory] = useState(false);

  const handleToggleReminder = () => {
    setReminder((prev) => !prev);
  };
  const handleToggleHistory = () => {
    setHistory((prev) => !prev);
  };

  const handleToggleNotes = () => {
    setShowNotes((prev) => !prev);
  };

  const TextFieldStyle: CSSProperties = {
    height: "35px",
    borderRadius: "5px",
    borderColor: theme.palette.info.main,
    color: isEditable ? theme.palette.secondary.main : theme.palette.info.main,
  };

  const BoxModal: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "background.paper",
    padding: 1.8,
    borderRadius: 3,
    borderWidth: "1px",
    borderColor: theme.palette.info.main,
    background: theme.palette.primary.contrastText,
    borderStyle: "solid",
  };


  return (
    <>
      <Modal
        open={open}
        BackdropProps={{
          style: {
            backgroundColor: theme.palette.action.focus,
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <Box
          sx={{
            ...BoxModal,
            width: { xs: "90%", sm: 400, lg: "60%" },
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mb={1}
            alignItems="center"
          >
            <Typography
              variant="h5"
              sx={{
                color: "black",
                fontWeight: "500",
                fontSize: "24px",
                marginLeft: 2,
                marginTop: 2,
              }}
            >
              Lead Info
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {data.type !== "Edit" && (
                <Button
                  sx={{
                    marginLeft: -18,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 35,
                    borderWidth: 0.1,
                    borderStyle: "solid",
                    padding: 2,
                    borderRadius: "4px",
                    width: "120px",
                    borderColor: "lightgrey",
                    marginTop: 2,
                  }}
                  startIcon={
                    <img
                      src={image.editIcon}
                      alt="Add"
                      style={{ width: "18px", height: "20px" }}
                    />
                  }
                  style={{
                    color: theme.palette.secondary.main,
                    fontSize: "13.5px",
                    textTransform: "none",
                    fontWeight: "500",
                  }}
                  onClick={() => setIsEditable(!isEditable)} // Set editable state here
                >
                  Edit Lead
                </Button>
              )}

              {/* Close Icon */}
              <IconButton
                sx={{
                  marginLeft: 2,
                  marginTop: 2,
                  color: "black",
                }}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          <Box
            sx={{
              padding: 1,
              overflowX: "hidden",
              maxHeight: "70vh",
            }}
          >
            <Box component="form" noValidate autoComplete="off" sx={{ padding: 2 }}>
              <Grid container spacing={2} sx={{ padding: 2, pb: 5, mb: 3, border: 1, borderColor: "#cccccc", borderRadius: 2 }}>
                {/* Full Name Field with Icon */}
                <Grid item xs={12} sm={4}>

                  <Typography component="label" htmlFor="name">
                    Full Name<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Portrait />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Course Name Field with Icon */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="courseName">
                    Course Name<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="courseName"
                    name="courseName"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AutoStories />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Counsellor Name Field with Icon */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="counsellorName">
                    Counsellor Name<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="counsellorName"
                    name="counsellorName"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SupervisorAccount/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Email Field with Icon */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="email">
                    Email<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email/>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Status Field with Icon */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="status">
                    Status<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="status"
                    name="status"
                    variant="outlined"
                    fullWidth
                    required
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BarChart />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Description Field */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="description">
                    Description<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Description />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Contact Number Field */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="contactNumber">
                    Contact Number<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="contactNumber"
                    name="contactNumber"
                    type="tel"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocalPhone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Channel Field */}
                <Grid item xs={12} sm={4}>
                  <Typography component="label" htmlFor="channel">
                    Channel<span style={{ color: 'red' }}> *</span>
                  </Typography>
                  <TextField
                    id="channel"
                    name="channel"
                    variant="outlined"
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BarChart />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5, mr: 5 }}>
                    <Button variant="contained" color="primary" >Save Changes</Button>
                  </Box>
                </Grid>
              </Grid>
              {/* Comments Accordion */}
              <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')} sx={{ mb: 2 }}>
                <AccordionSummary aria-controls="panel1-content" id="panel1-header">
                  <Typography>Comment</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    id="comments"
                    label="Add a Comment"
                    multiline
                    rows={4}
                    variant="outlined"
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" color="primary">Submit Comment</Button>
                  </Box>
                </AccordionDetails>
              </Accordion>


              {/* History Accordion */}
              <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')} sx={{ mb: 2 }}>
                <AccordionSummary aria-controls="panel2-content" id="panel2-header">
                  <Typography>History</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>History of actions taken on this lead will be displayed here.</Typography>
                </AccordionDetails>
              </Accordion>

              {/* Reminder Accordion */}
              <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')} sx={{ mb: 2 }}>
                <AccordionSummary aria-controls="panel3-content" id="panel3-header">
                  <Typography>Reminder</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Add your DateTimePicker here */}
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>Set Reminder</Button>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default LeadPreviewModal;


