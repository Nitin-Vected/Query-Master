import React, { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../app/store";
import { fetchQueries } from "../utility/utility";
import { setQueries, Query } from "../app/querySlice";
import Spinner from "../components/Spinner";
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Queries: React.FC = () => {
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
        const response = await fetchQueries(token);
        const fetchedQueries: Query[] = response.data.myQueries.map(
          (query: Query) => ({
            queryId: query.queryId,
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

  const handleClick = (id: string) => {
    dispatch({ type: "queries/selectQuery", payload: id });
  };

  const columns: GridColDef[] = [
    {
      field: "updatedAt",
      headerName: "Date - Time",
      minWidth: 200,
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params);
        return `${date.toLocaleDateString()} - ${date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })}`;
      },
    },
    { field: "email", headerName: "Email", minWidth: 250, flex: 1 },
    { field: "subject", headerName: "Subject", minWidth: 200, flex: 1 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      flex: 1,
      cellClassName: (params: GridCellParams) =>
        `status-color-${(params.value as string).toLowerCase()}`,
    },
    { field: "userRole", headerName: "User Role", minWidth: 120, flex: 1 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          component={Link}
          to={`/query/${params.row.queryId}`}
          variant="contained"
          color="primary"
          onClick={() => handleClick(params.row.queryId)}
        >
          View
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
      <h1>Queries</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={queries.map((query, index) => ({
            id: index,
            queryId: query.queryId,
            updatedAt: query.updatedAt,
            email: query.userEmail,
            subject: query.subject,
            status: query.status,
            userRole: query.userRole,
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

export default Queries;
