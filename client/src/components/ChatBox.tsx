import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import moment from "moment";
import { Tooltip } from "@mui/material";

interface MessageType {
  sender: string;
  email: string;
  message: string;
  timestamp: string;
  role: string;
}

interface ChatBoxProps {
  messages: MessageType[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const currentUserEmail = useSelector(
    (state: RootState) => state.auth.userData?.email
  );

  const getTimeDifference = (date: string) => {
    const now = moment();
    const postDate = moment(date); // Pass the date directly to moment

    const diffInMinutes = now.diff(postDate, "minutes");
    const diffInHours = now.diff(postDate, "hours");
    const diffInDays = now.diff(postDate, "days");
    const diffInSeconds = now.diff(postDate, "seconds");

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  };

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`message ${
            message.email === currentUserEmail ? "user" : "staff"
          }`}
        >
          {message.email !== currentUserEmail && (
            <>
              {message.role === "SupportAdmin" ? (
                <p>
                  <strong>Support Admin</strong>
                </p>
              ) : (
                <p>
                  <strong>{message.sender}</strong>
                </p>
              )}
            </>
          )}

          <p>{message.message}</p>
          <Tooltip
            title={moment(message.timestamp).format("DD/MM/YYYY, h:mm A")}
          >
            <span>{getTimeDifference(message.timestamp)}</span>
          </Tooltip>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatBox;
