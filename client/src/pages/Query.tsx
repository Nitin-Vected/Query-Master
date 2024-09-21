import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import { toast } from "react-toastify";
import { RootState } from "../app/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";
import { manageQueryStatus, fetchQueryById } from "../utility/utility"; // Import your API utility
import io from "socket.io-client";
import { BASE_API_URL } from "../utility/constants";

const socket = io(BASE_API_URL);

interface MessageType {
  sender: string;
  email: string;
  message: string;
  timestamp: string;
  role: string;
}

const Query: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [query, setQuery] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.userData);
  const { email, name, role, token } = currentUser || {};

  const param = useParams();
  const queryId = param.queryId;

  useEffect(() => {
    const fetchQueryData = async () => {
      if (!token || !queryId || !role) return;

      setLoading(true);
      try {
        const response = await fetchQueryById(queryId, token, role);
        setQuery(response.data.queryData);
        setMessages(response.data.queryData.conversation || []);
      } catch (error) {
        toast.error("Failed to fetch query data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueryData();
  }, [token, queryId, role]);

  useEffect(() => {
    socket.on("receiveMessage", (message: MessageType) => {
      console.log();

      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const onSendMessage = (text: string) => {
    if (!email || !role) {
      toast.error("Unable to send message. User data is missing.");
      return;
    }

    const newMessage: MessageType = {
      // _id: `${Date.now()}`,
      sender: name || "Unknown",
      email: email,
      message: text,
      timestamp: new Date().toISOString(),
      role: role,
    };
    socket.emit("sendMessage", newMessage);
    setQuery({
      ...query,
      conversation: [...(query.conversation || []), newMessage],
    });
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    handleOpenModal(event.target.value);
  };

  const handleOpenModal = (status: string) => {
    setSelectedStatus(status);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedStatus("");
    setOpenModal(false);
  };

  const handleConfirmStatusChange = async () => {
    if (!query || !token || !role || !selectedStatus) {
      toast.error("Failed to update query status. Required data missing.");
      return;
    }

    setLoading(true);
    try {
      const response = await manageQueryStatus(
        query.queryId,
        query.userEmail,
        token,
        role,
        selectedStatus
      );

      if (response.status === 201) {
        toast.success("Query status updated successfully.");
        setQuery({
          ...query,
          status: selectedStatus,
        });
        navigate(role === "SupportAdmin" ? "/manage-queries" : "/queries");
      } else {
        toast.error("Failed to update query status. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while updating the query status.");
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (!query) {
    return <div>Query not found</div>;
  }

  return (
    <div className="query-page">
      <div className="split-container">
        {/* Left side: Query details */}
        <div className="query-details">
          <header className="query-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap:20,
                marginBottom: "20px",
              }}
            >
              <BackButton
                url={role === "SupportAdmin" ? "/manage-queries" : "/queries"}
              />
              {query.status.toLowerCase() !== "closed" && (
                <>
                  {query.status.toLowerCase() !== "in-progress" && role !== "Student" ? (
                    <FormControl variant="standard">
                      <InputLabel>Update Status</InputLabel>
                      <Select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        label="Status"
                        style={{ minWidth: "200px" }}
                      >
                        <MenuItem value="closed">Close</MenuItem>
                        <MenuItem value="in-progress">
                          In Progress
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    <button
                      className="btn btn-close-query btn-danger"
                      onClick={() => handleOpenModal("closed")}
                    >
                      Close Query
                    </button>
                  )}
                </>
              )}
            </div>

            <h3
              style={{ marginBottom: "10px" }}
              className={`status-color-${query.status.toLowerCase()}`}
            >
              Status: {query.status}
            </h3>

            <table className="query-info-table">
              <tbody>
                <tr>
                  <th>Query ID</th>
                  <td>{query.queryId}</td>
                </tr>
                <tr>
                  <th>Date</th>
                  <td>{new Date(query.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
            </table>

            <div className="query-desc">
              <h3>Subject</h3>
              <p>{query.subject}</p>
            </div>
          </header>
        </div>

        {/* Right side: Chat system */}
        <div className="query-chat">
          {messages.length > 0 ? <ChatBox messages={messages} /> : <Spinner />}
          <MessageInput
            onSend={onSendMessage}
            queryId={query.queryId}
            status={query.status.toLowerCase() === "closed"}
          />
        </div>
      </div>

      {/* Modal for confirmation */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="confirm-close-query"
      >
        <DialogTitle id="confirm-close-query">Confirm Close Query</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this query status?
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
    </div>
  );
};

export default Query;
