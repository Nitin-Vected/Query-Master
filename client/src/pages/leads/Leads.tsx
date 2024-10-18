import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Select,
  MenuItem,
  InputBase,
  Paper,
  Pagination,
  Grid,
  Avatar,
  styled,
  Modal,
} from "@mui/material";
import { useRef, useState } from "react";
import HeaderView from "../../template/HeaderView";
import LeadPreviewModal from "../../components/lead-preview-modal";
import LeadsModal from "../../components/leads-modal";
import { Search, RemoveRedEyeOutlined } from "@mui/icons-material";
import editIcon from "../../assets/image/editIcon.png";
import LeadPreviewFormModal from "../../components/lead-preview-modal/LeadPreviewModal";
// import axios from "axios";

const CustomPagination = styled(Pagination)(() => ({
  "& .MuiPaginationItem-root": {
    border: "1px solid #E5E7EB",
    borderRadius: "5px",
    color: "#374151",
    fontWeight: "bold",
    width: "40px",
    height: "40px",
    "&:hover": {
      backgroundColor: "#F3F4F6",
    },
  },
  "& .Mui-selected": {
    backgroundColor: "#1F2937",
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: "#1F2937",
    },
  },
}));

const Lead = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [page, setPage] = useState<number>(1);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("file data", file);
  };

  const handleEdit = (row: any) => {
    setOpen(true);
    setFileSelected(row);
  };

  const leadDataSubmit = async (leadData: any) => {
    try {
      console.log("leadData", leadData);
      //   const response = await axios.post("/api/lead", leadData);

      //   if (response.status === 201) {
      //     console.log("Lead created successfully:", response.data);
      //   } else {
      //     console.error("Unexpected response:", response);
      //   }
    } catch (error) {
      console.error("Error occurred during lead creation:", error);
    }
  };

  const rows = [
    {
      name: "John Doe",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Instagram",
      counselor: "Peter",
    },
    {
      name: "Sarah Haw",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Youtube",
      counselor: "Not Assigned",
    },
    {
      name: "Tyson Tan",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Facebook",
      counselor: "Not Assigned",
    },
    {
      name: "Robert Shell",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Youtube",
      counselor: "Not Assigned",
    },
  ];

  return (<>
    <Box sx={{ backgroundColor: "#F9FAFB", height: "100vh" }}>
      <HeaderView />
      <Box sx={{ paddingInline: 3, pt: { xs: 8, md: 10 } }}>
        <Typography variant="h4" fontWeight="bold">
          Lead
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: "1200px",
          margin: "auto",
          padding: 2,
          boxShadow: "0px 0px 5px 0px #00000040",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 2,
            borderBottom: "1px solid #D1D5DB",
          }}
        >
          <Grid item xs={12} sm={6} md={6} display="flex" gap={2}>
            <Select
              defaultValue="All Leads"
              sx={{
                height: "45px",
                backgroundColor: "#FFFFFF",
                borderColor: "#D1D5DB",
                color: "#374151",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "180px",
              }}
            >
              <MenuItem value="Enrolled">Enrolled</MenuItem>
              <MenuItem value="All Leads">All Leads</MenuItem>
            </Select>

            <Button
              sx={{
                height: "45px",
                color: "#374151",
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "180px",
              }}
              onClick={() => setIsLeadsModalOpen(true)}
            >
              + Create Lead
            </Button>
          </Grid>

          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            display="flex"
            sx={{
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Button
              sx={{
                height: "45px",
                color: "#374151",
                borderColor: "#2563EB",
                textTransform: "none",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "200px",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Import from Excel
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Button>
          </Grid>
        </Grid>

        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <InputBase
            placeholder="Search Lead"
            startAdornment={<Search sx={{ mr: 1, color: "#9CA3AF" }} />}
            sx={{
              border: "1px solid #D1D5DB",
              borderRadius: "8px",
              padding: "2px 8px",
              width: "100%",
              maxWidth: "280px",
              bgcolor: "#FFFFFF",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Box shadow
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F3F4F6" }}>
                {[
                  "Full Name",
                  "Contact Number",
                  "Email Id",
                  "Manage Status",
                  "Channel",
                  "Counselor Name",
                  "Action",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: "#6B7280",
                      fontWeight: "bold",
                      padding: "10px",
                      textAlign: "center",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: "10px", textWrap: "nowrap" }}>
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ padding: "10px" }}>{row.contact}</TableCell>
                  <TableCell sx={{ padding: "10px" }}>{row.email}</TableCell>

                  {/* Status Dropdown */}
                  <TableCell sx={{ padding: "10px" }}>
                    <Select
                      defaultValue="Select Status"
                      fullWidth
                      sx={{
                        padding: "4px 12px", // Adjusting padding inside the select input
                        fontSize: "0.875rem", // Slightly smaller font
                        height: "36px", // Adjust the height of the Select component
                      }}
                    >
                      <MenuItem value="Select Status">Select Status</MenuItem>
                      <MenuItem value="Enrolled">Enrolled</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ padding: "10px" }}>{row.channel}</TableCell>
                  <TableCell sx={{ padding: "10px" }}>
                    <Select
                      defaultValue="Not Assigned"
                      fullWidth
                      sx={{
                        padding: "4px 12px",
                        fontSize: "0.875rem",
                        height: "36px",
                      }}
                    >
                      <MenuItem value="Not Assigned">Not Assigned</MenuItem>
                      <MenuItem value="Peter">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              bgcolor: "#FFCA28",
                              color: "black",
                              width: 24,
                              height: 24,
                              fontSize: "0.8rem",
                              mr: 1,
                            }}
                          >
                            P
                          </Avatar>
                          Peter
                        </Box>
                      </MenuItem>
                    </Select>
                  </TableCell>

                  <TableCell
                    sx={{
                      padding: "10px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <img
                      src={editIcon}
                      style={{
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleEdit(row)}
                      alt="editLogo"
                    />
                    <IconButton>
                      <RemoveRedEyeOutlined
                        sx={{ width: "25px", height: "25px", color: "#000000" }}
                      />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <CustomPagination
            count={100}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            siblingCount={0}
            boundaryCount={1}
            color="primary"
            sx={{
              ".MuiPagination-ul": {
                display: "flex",
                flexWrap: "nowrap", // Prevent wrapping
                justifyContent: "center", // Center items
              },
              ".MuiPaginationItem-root": {
                minWidth: "36px", // Adjust button width
                padding: "6px", // Adjust padding for smaller screens
              },
              "@media (max-width: 600px)": {
                ".MuiPaginationItem-root": {
                  fontSize: "0.75rem", // Smaller font size on mobile
                  minWidth: "28px", // Smaller width on mobile
                  padding: "4px", // Less padding on mobile
                },
              },
            }}
          />
        </Box>
      </Box>

      <LeadPreviewModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleClickOpen}
        data={fileSelected}
      />
      <LeadsModal
        open={isLeadsModalOpen}
        onClose={() => {
          setIsLeadsModalOpen(false);
        }}
        onSubmit={leadDataSubmit}
      />
    </Box>

    {/* <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '70%', lg: 800 }, // Responsive width
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          borderRadius: 2,
        }}
      >
        <LeadPreviewFormModal onClose={handleClose} />
      </Box>
    </Modal> */}



  </>);
};

export default Lead;