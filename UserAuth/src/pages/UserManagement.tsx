import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import Spinner from "../components/Spinner";
import { adminGetStudentsList, adminUpdateStudentStatus } from "../utility/utility"; // Import your API functions

const UserManagement: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [students, setStudents] = useState<any[]>([]); // Adjust type according to your data structure
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.userData?.token || ""
  );

  useEffect(() => {
    const getStudents = async () => {
      setLoading(true);
      try {
        const response = await adminGetStudentsList(token); // Fetch students from API
        setStudents(response.data); // Adjust according to your response structure
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Failed to load students");
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, [token]);

  const handleStatusToggle = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    setLoading(true);
    try {
      await adminUpdateStudentStatus(studentId, newStatus, token); // Update student status
      setStudents(students.map(student =>
        student._id === studentId ? { ...student, status: newStatus } : student
      ));
    } catch (error) {
      console.error("Error updating student status:", error);
      setError("Failed to update student status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }
  if (error) return <div>{error}</div>;

  return (
    <>
      <BackButton url="/" />
      <h1>Students</h1>
      <div className="students">
        <div className="student-headings">
          <div>Name</div>
          <div>Email</div>
          <div>Enrollment Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        {students.length > 0 ? (
          students.map((student) => (
            <div key={student._id} className="student-item">
              <div>{student.name}</div>
              <div>{student.email}</div>
              <div>{new Date(student.enrollmentDate).toLocaleDateString()}</div>
              <div>{student.status}</div>
              <div>
                <button
                  onClick={() => handleStatusToggle(student._id, student.status)}
                >
                  {student.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>No students found</div>
        )}
      </div>
    </>
  );
};

export default UserManagement;
