import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { USER_API_URL } from '../utility/constants';
import moment from 'moment';

interface Query {
    _id: string;
    userEmail: string;
    subject: string;
    message: string;
}

const PaginationComponent = () => {
    const [queries, setQueries] = useState<Query[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 4; // Number of items per page

    // Fetch queries from the API
    const fetchQueries = async (page: number) => {
        try {
            const response = await axios.get(`${USER_API_URL}/userGetQueriesInRange/${page}/${limit}`, {
                headers: {
                    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTml0aW4gVmlzaHZha2FybWEiLCJlbWFpbCI6Im5pdGlua3Zpc2h2YWthcm1hQGdtYWlsLmNvbSIsInJvbGUiOiJTdHVkZW50Iiwic3RhdHVzIjoidHJ1ZSIsImlhdCI6MTcyNjcyOTc1OSwiZXhwIjoxNzI2ODE2MTU5fQ.8uKq_OtRTRwWghBClwE4mWxEQwhLQqRtTG41M3sjHRg`,
                },
            });
            setQueries(response.data.queryList);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching queries:', error);
        }
    };

    const getTimeDifference = (date:any) => {
        const now = moment();
        const postDate = moment(date);
        const diff = now.diff(postDate, 'days');
    
        if (diff === 0) {
            return 'Today';
        } else if (diff === 1) {
            return '1 day ago';
        } else {
            return `${diff} days ago`;
        }
    };

    // Fetch data when the component mounts or page changes
    useEffect(() => {
        fetchQueries(currentPage);
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div>
            <h2>Query List (Page {currentPage})</h2>
            <ul>
                {queries.map((query) => (
                    <li key={query._id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
                        <p><strong>Subject:</strong> {query.subject}</p>
                        <p><strong>Message:</strong> {query.message}</p>
                        <p><strong>From:</strong> {query.userEmail}</p>
                    </li>
                ))}
            </ul>

            <div>
                {/* Pagination Controls */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <span style={{ margin: '0 1rem' }}>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
                <div style={{backgroundColor:'skyblue',padding:20}}>
                    {getTimeDifference('09/13/2024')}
                </div>
            </div>
        </div>
    );
};

export default PaginationComponent;
