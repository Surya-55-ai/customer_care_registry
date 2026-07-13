import React, { useEffect, useState } from "react";
import api from "../../api";
import Chat from "./Chat";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";

const ChatPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/complaints/mine");
        setComplaints(data);
        if (data.length > 0) setSelectedId(data[0]._id);
      } catch (err) {
        // handled by empty state below
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) return <LoaderSpinner label="Loading your complaints..." />;

  if (complaints.length === 0) {
    return (
      <p style={{ textAlign: "center", padding: 40, color: "#7c8697" }}>
        You need to raise a complaint before you can chat with an agent.
      </p>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 700, margin: "0 auto" }}>
      <label style={{ fontSize: "0.85rem", color: "#5b6675" }} htmlFor="complaintSelect">
        Select complaint
      </label>
      <select
        id="complaintSelect"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        style={{
          display: "block",
          width: "100%",
          padding: "9px 10px",
          margin: "6px 0 16px",
          borderRadius: 6,
          border: "1px solid #d3d9e0",
        }}
      >
        {complaints.map((c) => (
          <option key={c._id} value={c._id}>
            {c.details.slice(0, 40)} — {c.status}
          </option>
        ))}
      </select>

      <Chat complaintId={selectedId} title="Chat with Agent" />
    </div>
  );
};

export default ChatPage;

