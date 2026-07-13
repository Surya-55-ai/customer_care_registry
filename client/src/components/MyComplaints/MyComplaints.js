import React, { useEffect, useState } from "react";
import api from "../../api";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import "./MyComplaints.css";

const statusColor = {
  pending: "#e6a817",
  "in-progress": "#1e6fd9",
  resolved: "#1e8449",
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get("/complaints/mine");
        setComplaints(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load complaints.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  if (loading) return <LoaderSpinner label="Loading your complaints..." />;

  return (
    <div className="my-complaints-page">
      <h2>My Complaints</h2>

      {error && <p className="auth-error">{error}</p>}

      {!error && complaints.length === 0 && (
        <p className="empty-state">You haven't raised any complaints yet.</p>
      )}

      <div className="complaint-cards">
        {complaints.map((c) => (
          <div className="complaint-card" key={c._id}>
            <p className="complaint-id">ID: {c._id}</p>
            <p>Complaint: {c.details}</p>
            <p>Date: {new Date(c.createdAt).toLocaleDateString()}</p>
            <p className="status" style={{ color: statusColor[c.status] || "#7c8697" }}>
              Status: {c.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyComplaints;

