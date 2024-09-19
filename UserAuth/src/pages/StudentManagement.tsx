import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Spinner from "../components/Spinner";
import {
  adminGetStudentsList,
  adminUpdateStudentStatus,
} from "../utility/utility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const StudentManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    currentStatus: string;
  } | null>(null); // State for selected student
  const token = useSelector(
    (state: RootState) => state.auth.userData?.token || ""
  );

  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const response = await adminGetStudentsList(token);
        setStudents(response.data.studentList);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [token]);

  const handleOpenModal = (studentId: string, currentStatus: string) => {
    setSelectedStudent({ id: studentId, currentStatus });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null); // Reset the selected student
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedStudent) return;

    const { id, currentStatus } = selectedStudent;
    const newStatus = currentStatus === "true" ? "false" : "true";

    setLoading(true);
    try {
      await adminUpdateStudentStatus(id, newStatus, token);
      setStudents(
        students.map((student) =>
          student._id === id ? { ...student, status: newStatus } : student
        )
      );
      // toast.success("Student status updated successfully.");
    } catch (error) {
      console.error("Error updating student status:", error);
      setError("Failed to update student status");
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 1 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 250, flex: 1 },
    {
      field: "contactNumber",
      headerName: "Contact Number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.status === "true" ? "success" : "error"}
          onClick={() => handleOpenModal(params.row.id, params.row.status)}
        >
          {params.row.status === "true" ? "Active" : "Inactive"}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <Spinner />;
  }
  if (error) return <div>{error}</div>;

  return (
    <>
      <BackButton url="/" />
      <h1>Students</h1>
      <div style={{ height: 400, width: "100%" }}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <DataGrid
            rows={students.map((student) => ({
              id: student._id,
              name: student.name,
              email: student.email,
              contactNumber: student.contactNumber,
              status: student.status,
            }))}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            disableRowSelectionOnClick
          />
        </div>
      </div>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-status-change"
      >
        <DialogTitle id="confirm-status-change">
          Confirm Status Change
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this student's status?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmStatusChange} color="error">
            Yes, Change Status
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StudentManagement;
