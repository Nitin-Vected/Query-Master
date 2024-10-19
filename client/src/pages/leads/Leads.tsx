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
import { Counsellor, LeadData, ManageStatus } from "./interface";
import FileImportButton from "../../template/file-import-button";
import SearchInput from "../../template/search-input";
import ComponentHeading from "../../template/component-heading";
import CustomTable from "../../template/custom-table";
import CustomPagination from "../../template/custom-pagination";
import EnrollmentModal from "../../components/enrollment-modal";
import { TableColumn } from "../../template/custom-table/interface";
import theme from "../../theme/theme";
import {
  getallCounsellor,
  getAllLeads,
  getAllLeadsUpdate,
  getallManageStatusApi,
} from "../../services/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const Lead = () => {
  const [open, setOpen] = useState(false);
  const [isLeadsModalOpen, setIsLeadsModalOpen] = useState(false);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [page, setPage] = useState<number>(1);
  const [selectedLead, setSelectedLead] = useState("All Leads");
  const [counsellorList, setCounsellorList] = useState<Counsellor[]>([]);
  const [manageStatusList, setManageStatusList] = useState<ManageStatus[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const userData: any = useSelector((state: RootState) => state);
  const AllLedaData = userData.leads.data;
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
  };

  const handleEdit = (row: LeadData, type: boolean) => {
    setOpen(true);
    setLeadData(row);
    setIsEdit(type);
  };

  const fetchCounsellorData = async (token: string) => {
    try {
      const data = await getallCounsellor(token); // Fetch the data

      setCounsellorList(data.counsellorList || []); // Ensure to set the counsellorList
    } catch (error) {
      console.error("Failed to fetch counsellor data:", error);
    }
  };
  const getallManage = async (token: string) => {
    try {
      const data = await getallManageStatusApi(token); // Fetch the data
      setManageStatusList(data.statusList); // Ensure to set the counsellorList
    } catch (error) {
      console.error("Failed to fetch get all Manage data:", error);
    }
  };
  useEffect(() => {
    getAllLeads(userData.auth.userData.token);
    fetchCounsellorData(userData.auth.userData.token);
    getallManage(userData.auth.userData.token);
  }, [userData.auth.userData.token]);

  const handleLeadChange = (event: SelectChangeEvent<string>) => {
    setSelectedLead(event.target.value);
  };

  //   const handleStatusChange = (
  //     event: SelectChangeEvent<string>,
  //     rowIndex: number
  //   ) => {
  //     // Get the selected value from the dropdown
  //     const selectedValue = event.target.value;

  //     // Open enrollment modal if the selected status is "Enrolled"
  //     if (selectedValue === "Enrolled") {
  //       setIsEnrollmentModalOpen(true);
  //     }

  //     // Create a new copy of the rows to avoid mutating the original state
  //     const newRows = [...manageStatusList];

  //     // Update the status of the specific row at rowIndex
  //     newRows[rowIndex].status = selectedValue;
  // console.log("newRows dfff",newRows);
  //     // Update the state with the modified rows
  //     setManageStatusList(newRows); // Update the state to reflect changes

  //     // Optionally, log the updated status
  //     console.log(`Status updated for row ${rowIndex} to ${selectedValue}`);
  //   };
  const handleStatusChange = (
    event: SelectChangeEvent<string>,
    rowIndex: number,
    selectedStatus: any
  ) => {
    // Get the selected value from the dropdown
    const selectedValue = event.target.value;
    console.log("row irr", selectedStatus);
    // Open enrollment modal if the selected status is "Enrolled"
    if (selectedValue === "Enrolled") {
      setIsEnrollmentModalOpen(true);
    }

    // Create a new copy of rows to avoid mutating the original state
    const newRows = [...manageStatusList];

    // Update the status of the specific row at rowIndex
    newRows[rowIndex].status = selectedValue;

    // Update the state with the modified rows
    setManageStatusList(newRows);
    getAllLeadsUpdate(userData.auth.userData.token, selectedStatus);
  };

  const leadDataSubmit = async (leadData: LeadData) => {
    try {
      console.log("leadData", leadData);
    } catch (error) {
      console.error("Error occurred during lead creation:", error);
    }
  };
  const options = counsellorList.map((user) => ({
    label: `${user.firstName} ${user.lastName}`, // Concatenate first and last names
    value: `${user.firstName} ${user.lastName}`,
  }));

  options.push({ label: "Unassigned", value: "Unassigned" });

  const headers: TableColumn<LeadData>[] = [
    { label: "Full Name", key: "fullName" },
    { label: "Contact Number", key: "contactNumber" },
    { label: "Email Id", key: "email" },
    {
      label: "Manage Status",
      key: "status",

      // render: (value: string | boolean | null, index: number) => {
      //   return (
      //     <SelectDropdown
      //       name={`status${index}`}
      //       disabled={value === "Enrolled"} // Disable if the status is "Enrolled"
      //       value={manageStatusList[index]?.status || value || "status"} // Show the row's status or fallback to original value or "status"
      //       onChange={(e) => {
      //         const selectedStatus = manageStatusList.find(
      //           (statusd) => statusd?.name === e?.target?.value
      //         );
      //         handleStatusChange(e, index, selectedStatus); // Pass the selected ID to the handler
      //       }} // Handle the value change
      //       onChange={(e) => {
      //         const selectedStatus = manageStatusList.find(
      //           (status) => status.name === e.target.value
      //         );
      //         if (selectedStatus) {
      //           handleStatusChange(e, index, selectedStatus.id); // Ensure selectedStatus exists
      //         }
      //       }} // Handle the value change

      //       options={manageStatusList.map((statuws) => ({
      //         label: statuws.name,
      //         value: statuws.name, // Use the status name as the dropdown option
      //         id: statuws.id, // Add the ID for later use
      //       }))}
      //     />
      //   );
      // },
      render: (value: string | boolean | null, index: number) => {
        // Ensure that manageStatusList[index] exists or create a default value
        const currentStatus =
          manageStatusList[index]?.status || value || "status";

        return (
          <SelectDropdown
            name={`status${index}`}
            disabled={value === "Enrolled"} // Disable if the status is "Enrolled"
            value={currentStatus} // Fallback to default "status" if currentStatus is undefined
            onChange={(e) => {
              const selectedStatus = manageStatusList.find(
                (statuss) => statuss?.name === e.target.value
              );
              if (selectedStatus) {
                // Make sure manageStatusList[index] exists
                if (!manageStatusList[index]) {
                  // Create the object if it doesn't exist
                  manageStatusList[index] = {};
                }
                // Update the status of the specific index
                manageStatusList[index].status = selectedStatus?.name;
                handleStatusChange(e, index, selectedStatus.id); // Pass the selected ID
              }
            }}
            options={manageStatusList?.map((status) => ({
              label: status.name,
              value: status.name, // Use the status name as the dropdown option
              id: status.id, // Add the ID for later use
            }))}
          />
        );
      },
    },

    { label: "Channel", key: "channel" },
    {
      label: "Counsellor Name",
      key: "assignedTo",
      render: (value: string | null, index: number | string, row: any) => {
        return (
          <SelectDropdown
            disabled={value !== "Unassigned"} // Disable if the current value is not "Unassigned"
            name={`assignedTo${index}`} // Name is based on the index
            // value={value || "Unassigned"} // Set the dropdown value to the current value or "Unassigned"
            value={counsellorList[index]?.status || value || "Unassigned"} // Show the row's status or fallback to original value or "status"
            onChange={(e) => handleStatusChange(e, index, row)} // Pass row data along with index
            options={options} // Use the dynamic options here
          />
        );
      },
    },
    {
      label: "Action",
      key: "action",
      render: (_value: string, row: any) => (
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

          <CustomTable headers={headers} rows={AllLedaData} />

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
