import React from "react";
import { Query, selectTicket } from "../app/querySlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

interface TicketItemProps {
  query: Query;
}

const TicketItem: React.FC<TicketItemProps> = ({ query }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectTicket(query._id));
  };

  return (
    <div className="ticket">
      <div className="ticket-date">
        {new Date(query.createdAt).toLocaleDateString()}
      </div>
      <div className="ticket-subject">{query.subject}</div>
      <div className={`status status-${query.status.toLowerCase()}`}>{query.status}</div>
      <Link
        to={`/ticket/${query._id}`}
        className="btn btn-reverse btn-sm"
        onClick={handleClick}
      >
        View
      </Link>
    </div>
  );
};

export default TicketItem;
