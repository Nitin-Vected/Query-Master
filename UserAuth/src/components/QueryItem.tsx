import React from "react";
import { Query, selectQuery } from "../app/querySlice";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

interface QueryItemProps {
  query: Query;
}

const QueryItem: React.FC<QueryItemProps> = ({ query }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(selectQuery(query._id));
  };

  return (
    <div className="query">
      <div className="query-date">
        {new Date(query.createdAt).toLocaleDateString()}
      </div>
      <div className="query-subject">{query.subject}</div>
      <div className={`status status-${query.status.toLowerCase()}`}>{query.status}</div>
      <Link
        to={`/query/${query._id}`}
        className="btn btn-reverse btn-sm"
        onClick={handleClick}
      >
        View
      </Link>
    </div>
  );
};

export default QueryItem;
