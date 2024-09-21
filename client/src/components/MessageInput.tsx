import React, { useState } from "react";
import { sendMessageApi } from "../utility/utility";
import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface MessageInputProps {
  onSend: (text: string) => void;
  queryId: string;
  status: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  queryId,
  status,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.userData);
  const [text, setText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("User not authenticated");
      return;
    }

    const { token, role } = currentUser;

    if (text.trim()) {
      onSend(text);
      setText("");
      try {
        await sendMessageApi(queryId, text, token, role);
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
        disabled={status}
      />
      <button type="submit" disabled={status}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
