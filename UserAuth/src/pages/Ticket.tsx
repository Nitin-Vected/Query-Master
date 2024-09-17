import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import ChatBox from "../components/ChatBox";
import MessageInput from "../components/MessageInput";
import { toast } from "react-toastify";

interface TicketType {
  _id: string;
  status: string;
  createdAt: string;
  product: string;
  description: string;
}

interface MessageType {
  _id: string;
  text: string;
  createdAt: string;
  isStaff: boolean;
}

const Ticket: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);

  const ticket: TicketType = {
    _id: "T123456",
    status: "closed",
    createdAt: "2024-09-15T12:34:56Z",
    product: "Example Product",
    description:
      "This is a detailed description of the issue reported by the user. It outlines the problem and any relevant information that could help in resolving the ticket.",
  };

  // Simulate fetching messages (Replace with actual API call)
  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          _id: "M123456",
          text: "Initial message from staff.",
          createdAt: "2024-09-15T14:20:00Z",
          isStaff: true,
        },
        {
          _id: "M123457",
          text: "Initial message from user.",
          createdAt: "2024-09-16T09:10:00Z",
          isStaff: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const onSendMessage = (text: string) => {
    // Handle sending the message (e.g., call API or WebSocket)
    const newMessage: MessageType = {
      _id: `M${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      isStaff: false, // Assuming it's a message from the user
    };
    setMessages([...messages, newMessage]);
  };

  const onTicketClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.success("Ticket Closed Successfully");
    navigate("/tickets");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <div style={{display:'flex', justifyContent:"space-between"}}>
          <BackButton url="/tickets" />
          {ticket.status !== "closed" && (
            <button
              className="btn btn-close-ticket btn-danger"
              onClick={onTicketClose}
            >
              Close Ticket
            </button>
          )}
        </div>

        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-IN")}
        </h3>
        <h3>Product : {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h3>Description of Issue</h3>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>

      {messages.length > 0 ? <ChatBox messages={messages} /> : <Spinner />}

      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default Ticket;
