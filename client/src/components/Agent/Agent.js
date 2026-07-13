import React, { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import Chat from "../Chat/Chat";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import "./Agent.css";

const Agent = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get("/complaints");
      setComplaints(data);
      setSelected((prevSelected) => {
        if (prevSelected) {
          const stillThere = data.find((c) => c._id === prevSelected._id);
          if (stillThere) return stillThere;
        }
        return data.length > 0 ? data[0] : null;
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResolve = async (complaintId) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, { status: "resolved" });
      fetchComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return <LoaderSpinner label="Loading agent dashboard..." />;

  // Calculated live from the complaints list, so these numbers are always accurate
  const totalCount = complaints.length;
  const solvedCount = complaints.filter((c) => c.status === "resolved").length;
  const pendingCount = complaints.filter((c) => c.status !== "resolved").length;

  return (
    <div className="agent-dashboard">
      <aside className="agent-sidebar">
        <div className="agent-profile-card">
          <p className="agent-name">{user?.firstName}</p>
          <h3>Complaint Details</h3>
          <div className="agent-stats">
            <div>
              <span className="stat-label">Total</span>
              <span className="stat-value">{totalCount}</span>
            </div>
            <div>
              <span className="stat-label">solved</span>
              <span className="stat-value">{solvedCount}</span>
            </div>
            <div>
              <span className="stat-label">Pending</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <ul className="agent-complaint-list">
          {complaints.length === 0 && <li className="empty-state">No complaints assigned yet.</li>}
          {complaints.map((c) => (
            <li
              key={c._id}
              className={selected?._id === c._id ? "active" : ""}
              onClick={() => setSelected(c)}
            >
              <p className="complaint-customer">{c.customer?.firstName || "Customer"}</p>
              <p className="complaint-snippet">{c.details.slice(0, 30)}</p>
              <span className={`badge badge-${c.status}`}>{c.status}</span>
              {c.status !== "resolved" && (
                <button
                  className="resolve-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResolve(c._id);
                  }}
                >
                  Mark resolved
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>

      <main className="agent-chat-panel">
        {selected ? (
          <Chat complaintId={selected._id} title={selected.customer?.firstName || "Customer"} />
        ) : (
          <p className="empty-state">Select a complaint to view the conversation.</p>
        )}
      </main>
    </div>
  );
};

export default Agent;