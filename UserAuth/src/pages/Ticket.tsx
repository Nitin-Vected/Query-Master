import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import { toast } from "react-toastify";
import { RootState, AppDispatch } from "../app/store";
import { updateQuery } from "../app/querySlice";

interface MessageType {
  _id: string;
  sender: string;
  message: string;
  timestamp: string;
  role: string;
}

const Ticket: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUserEmail = useSelector(
    (state: RootState) => state.auth.userData?.email
  );
  const currentUserRole = useSelector(
    (state: RootState) => state.auth.userData?.role
  );

  const selectedTicketId = useSelector(
    (state: RootState) => state.queries.selectedTicketId
  );

  const query = useSelector((state: RootState) =>
    state.queries.queries.find((q) => q._id === selectedTicketId)
  );

  useEffect(() => {
    if (query) {
      setMessages(
        query.conversation.map((msg) => ({
          _id: msg._id,
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
          role: msg.role,
        }))
      );
      setLoading(false);
    }
  }, [query]);

  const onSendMessage = (text: string) => {
    if (!currentUserEmail || !currentUserRole) {
      toast.error("Unable to send message. User data is missing.");
      return;
    }

    const newMessage: MessageType = {
      _id: `M${Date.now()}`,
      sender: currentUserEmail,
      message: text,
      timestamp: new Date().toISOString(),
      role: currentUserRole,
    };

    setMessages([...messages, newMessage]);

    if (query) {
      dispatch(
        updateQuery({
          ...query,
          conversation: [...query.conversation, newMessage],
        })
      );
    }
  };

  const onTicketClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.success("Ticket Closed Successfully");
    navigate(
      currentUserRole === "SupportAdmin" ? "/manage-tickets" : "/tickets"
    );
  };

  if (loading) {
    return <Spinner />;
  }

  if (!query) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <BackButton
            url={
              currentUserRole === "SupportAdmin"
                ? "/manage-tickets"
                : "/tickets"
            }
          />
          {query.status !== "closed" && (
            <button
              className="btn btn-close-ticket btn-danger"
              onClick={onTicketClose}
            >
              Close Ticket
            </button>
          )}
        </div>

        <h2>
          Ticket ID: {query._id}
          <span className={`status status-${query.status.toLowerCase()}`}>
            {query.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(query.createdAt).toLocaleString("en-IN")}
        </h3>
        <h3>Subject : {query.subject}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{query.subject}</p>
        </div>
        <h2>Comments</h2>
      </header>

      {messages.length > 0 ? <ChatBox messages={messages} /> : <Spinner />}

      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default Ticket;
