import React, { useEffect, useState } from "react";
import api from "../../api";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";

const History = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get("/complaints/mine");
        setComplaints(data.filter((c) => c.status === "resolved"));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <LoaderSpinner label="Loading history..." />;

  return (
    <div style={{ padding: "32px 40px" }}>
      <h2 style={{ marginBottom: 16, color: "#1c2733" }}>Resolved Complaint History</h2>
      {error && <p className="auth-error">{error}</p>}
      {!error && complaints.length === 0 && (
        <p className="empty-state">No resolved complaints yet.</p>
      )}
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        {complaints.map((c) => (
          <li
            key={c._id}
            style={{ border: "1px solid #e2e5ea", borderRadius: 8, padding: "10px 14px", fontSize: "0.85rem" }}
          >
            <p>{c.details}</p>
            <p style={{ color: "#7c8697", fontSize: "0.75rem" }}>
              Resolved on {new Date(c.updatedAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;

