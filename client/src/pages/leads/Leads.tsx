import {
  Box,
  Button,
  IconButton,
  Grid,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import LeadPreviewModal from "../../components/lead-preview-modal";
import LeadsModal from "../../components/leads-modal";
import { RemoveRedEyeOutlined } from "@mui/icons-material";
import editIcon from "../../assets/image/editIcon.png";
import SelectDropdown from "../../template/select-dropdown";
import { LeadData } from "./interface";
import FileImportButton from "../../template/file-import-button";
import SearchInput from "../../template/search-input";
import ComponentHeading from "../../template/component-heading";
import CustomTable from "../../template/custom-table";
import CustomPagination from "../../template/custom-pagination";
import EnrollmentModal from "../../components/enrollment-modal";
import { TableColumn } from "../../template/custom-table/interface";
import theme from "../../theme/theme";
import { getApi } from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const Lead = () => {
  const [rows, setRows] = useState([
    {
      name: "John Doe",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Instagram",
      counsellor: "Peter",
      status: "Not Enrolled",
      action: "",
    },
    {
      name: "Sarah Haw",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Youtube",
      counsellor: "Not Assigned",
      status: "Enrolled",
      action: "",
    },
    {
      name: "Tyson Tan",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Facebook",
      counsellor: "Not Assigned",
      status: "Enrolled",
      action: "",
    },
    {
      name: "Robert Shell",
      contact: "9774432345",
      email: "johndoe@gmail.com",
      channel: "Youtube",
      counsellor: "Not Assigned",
      status: "Enrolled",
      action: "",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [selectedLead, setSelectedLead] = useState("All Leads");
  const [isEdit, setIsEdit] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userData: any = useSelector((state: RootState) => state);
  console.log("userData", userData.ledas);
   const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: File | null = event.target.files?.[0] || null;
    console.log("file data", file);
  };

  const handleEdit = (row: LeadData, type: boolean) => {
    setOpen(true);
    setLeadData(row);
    setIsEdit(type);
  };

  useEffect(() => {
    getApi(userData.auth.userData.token);
  }, []);
  const handleLeadChange = (event: SelectChangeEvent<string>) => {
    setSelectedLead(event.target.value);
  };

  const handleStatusChange = (
    event: SelectChangeEvent<string>,
    rowIndex: number
  ) => {
    if (event.target.value === "Enrolled") {
      setIsEnrollmentModalOpen(true);
    }
    const newRows = [...rows];
    newRows[rowIndex].status = event.target.value;
    setRows(newRows);
  };

  const handleAssignedToChange = (
    event: SelectChangeEvent<string>,
    rowIndex: number
  ) => {
    const newRows = [...rows];
    newRows[rowIndex].counsellor = event.target.value;
    setRows(newRows);
  };

  const leadDataSubmit = async (leadData: LeadData) => {
    try {
      console.log("leadData", leadData);
    } catch (error) {
      console.error("Error occurred during lead creation:", error);
    }
  };

  const headers: TableColumn<LeadData>[] = [
    { label: "Full Name", key: "name" },
    { label: "Contact Number", key: "contact" },
    { label: "Email Id", key: "email" },
    {
      label: "Manage Status",
      key: "status",
      render: (value: string, _row: LeadData, index: number) =>
        value === "Enrolled" ? (
          value
        ) : (
          <SelectDropdown
            name={`status${index}`}
            value={value}
            onChange={(e) => handleStatusChange(e, index)}
            options={[
              { label: "Enrolled", value: "Enrolled" },
              { label: "Not Enrolled", value: "Not Enrolled" },
            ]}
          />
        ),
    },
    { label: "Channel", key: "channel" },
    {
      label: "Counsellor Name",
      key: "counsellor",
      render: (value: string, _row: LeadData, index: number) => (
        <SelectDropdown
          name={`assignedTo${index}`}
          value={value}
          onChange={(e) => handleAssignedToChange(e, index)}
          options={[
            { label: "Peter", value: "Peter" },
            { label: "Not Assigned", value: "Not Assigned" },
          ]}
        />
      ),
    },
    {
      label: "Action",
      key: "action",
      render: (_value: string, row: LeadData) => (
        <>
          <IconButton onClick={() => handleEdit(row, false)}>
            <img
              src={editIcon}
              alt="editLogo"
              style={{ width: 25, height: 25 }}
            />
          </IconButton>
          <IconButton onClick={() => handleEdit(row, true)}>
            <RemoveRedEyeOutlined
              sx={{ color: theme.palette.secondary.main }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ flexGrow: 1, p: 3, mt: 10 }}>
        <ComponentHeading heading="Leads" />

        <Box
          sx={{
            // margin: "auto",
            padding: 2,
            boxShadow: `0px 0px 5px 0px ${theme.palette.primary.dark}`,
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
              borderBottom: `1px solid ${theme.palette.primary.dark}`,
            }}
          >
            <Grid item xs={12} sm={6} md={6} display="flex" gap={2}>
              <SelectDropdown
                name="leadFilter"
                value={selectedLead}
                onChange={handleLeadChange}
                options={[
                  { label: "All Leads", value: "All Leads" },
                  { label: "Enrolled", value: "Enrolled" },
                ]}
                sx={{
                  borderRadius: "8px",
                  maxWidth: "180px",
                }}
                fullWidth={false}
              />

              <Button
                sx={{
                  height: "40px",
                  color: theme.palette.secondary.main,
                  textTransform: "none",
                  borderRadius: "8px",
                  border: `1px solid ${theme.palette.primary.dark}`,
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
              <FileImportButton
                onFileChange={handleFileChange}
                fileInputRef={fileInputRef}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <SearchInput placeholder={"Search Lead"} onChange={() => {}} />
          </Box>

          <CustomTable headers={headers} rows={rows} />

          <CustomPagination count={3} page={page} onChange={handlePageChange} />
        </Box>

        {isLeadsModalOpen && (
          <LeadsModal
            open={isLeadsModalOpen}
            onClose={() => {
              setIsLeadsModalOpen(false);
            }}
            onSubmit={leadDataSubmit}
          />
        )}

        {open && (
          <LeadPreviewModal
            open={open}
            handleClose={handleClose}
            data={leadData}
            isEdit={isEdit}
          />
        )}

        <EnrollmentModal
          openEnrollment={isEnrollmentModalOpen}
          closeModal={() => {
            setIsEnrollmentModalOpen(false);
          }}
        />
      </Box>
    </>
  );
};

export default Lead;
