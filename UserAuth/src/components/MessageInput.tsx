import React, { useState } from "react";
import { sendMessageApi } from "../utility/utility";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";

interface MessageInputProps {
  onSend: (text: string) => void;
  queryId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, queryId }) => {
  const currentUser = useSelector((state: RootState) => state.auth.userData);
  const { token, role } = currentUser;

  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("inside handleSubmit");

    if (text.trim()) {
      onSend(text);
      try {
        await sendMessageApi(queryId, text, token, role);
        setText("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
