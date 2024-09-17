import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Conversation {
  _id: string;
  sender: string;
  message: string;
  timestamp: string;
  role: string;
}

export interface Query {
  _id: string;
  userEmail: string;
  subject: string;
  status: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
  conversation: Conversation[];
}

interface QueryState {
  queries: Query[];
  selectedTicketId: string | null;  // Add this line
}

const initialState: QueryState = {
  queries: [],
  selectedTicketId: null,  // Add this line
};

const querySlice = createSlice({
  name: "queries",
  initialState,
  reducers: {
    setQueries(state, action: PayloadAction<Query[]>) {
      state.queries = action.payload;
    },
    updateQuery(state, action: PayloadAction<Query>) {
      const index = state.queries.findIndex(query => query._id === action.payload._id);
      if (index !== -1) {
        state.queries[index] = action.payload;
      }
    },
    addConversationMessage(state, action: PayloadAction<{ queryId: string; message: Conversation }>) {
      const { queryId, message } = action.payload;
      const query = state.queries.find(q => q._id === queryId);
      if (query) {
        query.conversation.push(message);
      }
    },
    selectTicket(state, action: PayloadAction<string | null>) {
      state.selectedTicketId = action.payload;
    },
  },
});

export const { setQueries, updateQuery, addConversationMessage, selectTicket } = querySlice.actions;

export default querySlice.reducer;
