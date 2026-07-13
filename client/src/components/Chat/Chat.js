import React, { useEffect, useRef, useState, useCallback } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./Chat.css";

const POLL_INTERVAL_MS = 4000;

const Chat = ({ complaintId, title }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!complaintId) return;
    try {
      const { data } = await api.get(`/messages/${complaintId}`);
      setMessages(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, [complaintId]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await api.post("/messages", { complaintId, message: text.trim() });
      setText("");
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    }
  };

  if (!complaintId) {
    return <p className="empty-state">Select a complaint to start chatting.</p>;
  }

  return (
    <div className="chat-widget">
      {title && <div className="chat-header">{title}</div>}

      <div className="chat-messages">
        {loading && <p className="empty-state">Loading conversation...</p>}
        {!loading && messages.length === 0 && (
          <p className="empty-state">No messages yet. Say hello!</p>
        )}
        {messages.map((m) => {
          const isMine = m.sender?._id === user?.id || m.sender === user?.id;
          return (
            <div key={m._id} className={`chat-bubble ${isMine ? "mine" : "theirs"}`}>
              <p>{m.message}</p>
              <span className="chat-time">
                {new Date(m.createdAt).toLocaleDateString()},{" "}
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error && <p className="auth-error">{error}</p>}

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" aria-label="Send message">
          ➤
        </button>
      </form>
    </div>
  );
};

export default Chat;

