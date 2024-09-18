import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import Spinner from "../components/Spinner";
import {
  adminGetStudentsList,
  adminUpdateStudentStatus,
} from "../utility/utility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";

const StudentManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const dispatch: AppDispatch = useDispatch();
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

  const handleStatusToggle = async (
    studentId: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "true" ? "false" : "true";
    setLoading(true);
    console.log(studentId);

    try {
      await adminUpdateStudentStatus(studentId, newStatus, token);
      setStudents(
        students.map((student) =>
          student._id === studentId
            ? { ...student, status: newStatus }
            : student
        )
      );
    } catch (error) {
      console.error("Error updating student status:", error);
      setError("Failed to update student status");
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Id", minWidth: 150, flex: 1 }, // Set minWidth or flex
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 }, // Adjust the minWidth
    { field: "email", headerName: "Email", minWidth: 250, flex: 1 }, // Make it wide enough for long emails
    {
      field: "contactNumber",
      headerName: "Contact Number",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150, // Set a minimum width
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <Button
          variant="contained"
          color={params.row.status === "true" ? "success" : "error"}
          onClick={() => handleStatusToggle(params.row.id, params.row.status)}
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
    </>
  );
};

export default StudentManagement;
