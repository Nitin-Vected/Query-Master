// src/components/ChatBox.tsx
import React, { useEffect, useRef } from 'react';

interface MessageType {
  _id: string;
  text: string;
  createdAt: string;
  isStaff: boolean;
}

interface ChatBoxProps {
  messages: MessageType[];
}

const ChatBox: React.FC<ChatBoxProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="chat-box">
      {messages.map((message) => (
        <div
          key={message._id}
          className={`message ${message.isStaff ? 'staff' : 'user'}`}
        >
          <p>{message.text}</p>
          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatBox;
