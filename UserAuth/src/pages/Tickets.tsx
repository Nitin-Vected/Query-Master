import React from "react";
import BackButton from "../components/BackButton";
import TicketItem from "../components/TicketItem";

interface TicketType {
  _id: string;
  createdAt: string;
  product: string;
  status: "open" | "new" | "closed" | "in-progress";
}

const Tickets: React.FC = () => {
  const tickets: TicketType[] = [
    {
      _id: "T123456",
      createdAt: "2024-09-15T12:34:56Z",
      product: "Example Product A",
      status: "open",
    },
    {
      _id: "T123457",
      createdAt: "2024-09-14T09:20:00Z",
      product: "Example Product B",
      status: "new",
    },
    {
      _id: "T123458",
      createdAt: "2024-09-13T15:45:30Z",
      product: "Example Product C",
      status: "closed",
    },
    {
      _id: "T123459",
      createdAt: "2024-09-12T11:30:00Z",
      product: "Example Product D",
      status: "open",
    },
  ];

  return (
    <>
      <BackButton url="/" />
      <h1>Tickets</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Product</div>
          <div>Status</div>
          <div></div>
        </div>
        {tickets.map((ticket) => (
          <TicketItem key={ticket._id} ticket={ticket} />
        ))}
      </div>
    </>
  );
};

export default Tickets;
