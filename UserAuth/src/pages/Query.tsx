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
  email: string;
  message: string;
  timestamp: string;
  role: string;
}

const Query: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.userData);

  // Add a null check for currentUser before accessing email, name, and role
  const email = currentUser?.email;
  const name = currentUser?.name;
  const role = currentUser?.role;

  const selectedQueryId = useSelector(
    (state: RootState) => state.queries.selectedQueryId
  );

  const query = useSelector((state: RootState) =>
    state.queries.queries.find((q) => q._id === selectedQueryId)
  );

  useEffect(() => {
    if (query) {
      setMessages(
        query.conversation.map((msg) => ({
          _id: msg._id,
          sender: msg.sender,
          email: msg.email,
          message: msg.message,
          timestamp: msg.timestamp,
          role: msg.role,
        }))
      );
      setLoading(false);
    }
  }, [query]);

  const onSendMessage = (text: string) => {
    if (!email || !role) {
      toast.error("Unable to send message. User data is missing.");
      return;
    }

    const newMessage: MessageType = {
      _id: `M${Date.now()}`,
      sender: name || "Unknown",
      email: email,
      message: text,
      timestamp: new Date().toISOString(),
      role: role,
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

  const onQueryClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.success("Query Closed Successfully");
    navigate(role === "SupportAdmin" ? "/manage-queries" : "/queries");
  };

  if (loading) {
    return <Spinner />;
  }

  if (!query) {
    return <div>Query not found</div>;
  }

  return (
    <div className="query-page">
      <header className="query-header">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <BackButton
            url={role === "SupportAdmin" ? "/manage-queries" : "/queries"}
          />
          {query.status !== "closed" && (
            <button
              className="btn btn-close-query btn-danger"
              onClick={onQueryClose}
            >
              Close Query
            </button>
          )}
        </div>

        <h2>
          Query ID: {query._id}
          <span className={`status status-${query.status.toLowerCase()}`}>
            {query.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(query.createdAt).toLocaleString("en-IN")}
        </h3>
        <h3>Subject : {query.subject}</h3>
        <hr />
        <div className="query-desc">
          <h3>Description of Issue</h3>
          <p>{query.subject}</p>
        </div>
        <h2>Comments</h2>
      </header>

      {messages.length > 0 ? <ChatBox messages={messages} /> : <Spinner />}

      <MessageInput onSend={onSendMessage} queryId={query._id} />
    </div>
  );
};

export default Query;
