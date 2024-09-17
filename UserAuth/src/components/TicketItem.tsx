import React from "react";
import { Link } from "react-router-dom";

// Define the interface for the ticket prop
interface Ticket {
  _id: string;
  createdAt: string;
  product: string;
  status: "open" | "new" | "closed" | "in-progress"; // Adjust statuses according to your needs
}

interface TicketItemProps {
  ticket: Ticket;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket }) => {
  return (
    <div className="ticket">
      <div>{new Date(ticket.createdAt).toLocaleString("en-US")}</div>
      <div>{ticket.product}</div>
      <div className={`status status-${ticket.status}`}>{ticket.status}</div>
      <Link to={`/ticket/${ticket._id}`} className="btn btn-reverse btn-sm">
        View
      </Link>
    </div>
  );
}

export default TicketItem;
