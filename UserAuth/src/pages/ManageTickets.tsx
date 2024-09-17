import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import TicketItem from "../components/TicketItem";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { adminfetchQueries } from "../utility/utility";
import { setQueries, Query } from "../app/querySlice";
import Spinner from "../components/Spinner";

const ManageTickets: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.userData?.token || ""
  );
  const queries = useSelector((state: RootState) => state.queries.queries);

  useEffect(() => {
    const getQueries = async () => {
      setLoading(true);
      try {
        const response = await adminfetchQueries(token);

        // Assuming the API gives a direct array of queries like the one shared
        const fetchedQueries: Query[] = response.data.raisedQueries.map(
          (query: any) => ({
            _id: query._id,
            userEmail: query.userEmail,
            subject: query.subject,
            status: query.status,
            userRole: query.userRole,
            createdAt: query.createdAt,
            updatedAt: query.updatedAt,
            conversation: query.conversation || [],
          })
        );

        // Dispatch action to update the Redux store
        dispatch(setQueries(fetchedQueries));
      } catch (error) {
        console.error("Error fetching queries:", error);
        setError("Failed to load queries");
      } finally {
        setLoading(false);
      }
    };

    getQueries();
  }, [token, dispatch]);

  if (loading) {
    return <Spinner />;
  }
  if (error) return <div>{error}</div>;

  return (
    <>
      <BackButton url="/" />
      <h1>Queries</h1>
      <div className="tickets">
        <div className="ticket-headings">
          <div>Date</div>
          <div>Subject</div>
          <div>Status</div>
          <div>User Role</div>
        </div>
        {queries.map((query) => (
          <TicketItem key={query._id} query={query} />
        ))}
      </div>
    </>
  );
};

export default ManageTickets;
