import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface MessageType {
  _id: string;
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

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((message) => (
        <div
          key={message._id}
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
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatBox;
