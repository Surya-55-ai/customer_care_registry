import React, { useEffect, useState } from "react";
import api from "../api";
import LoaderSpinner from "../components/LoaderSpinner/LoaderSpinner";

const ComplaintsManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const [{ data: complaintData }, { data: agentData }] = await Promise.all([
        api.get("/complaints"),
        api.get("/agents"),
      ]);
      setComplaints(complaintData);
      setAgents(agentData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssign = async (complaintId, agentId) => {
    if (!agentId) return;
    try {
      await api.put(`/complaints/${complaintId}/assign`, { agentId });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign agent.");
    }
  };

  const handleStatusChange = async (complaintId, status) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, { status });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) return <LoaderSpinner label="Loading complaints..." />;

  return (
    <div>
      {error && <p className="auth-error">{error}</p>}
      <table className="agents-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Details</th>
            <th>Status</th>
            <th>Assign Agent</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{c.customer?.firstName} {c.customer?.lastName}</td>
              <td>{c.details.slice(0, 50)}</td>
              <td>
                <select value={c.status} onChange={(e) => handleStatusChange(c._id, e.target.value)}>
                  <option value="pending">pending</option>
                  <option value="in-progress">in-progress</option>
                  <option value="resolved">resolved</option>
                </select>
              </td>
              <td>
                <select
                  defaultValue=""
                  onChange={(e) => handleAssign(c._id, e.target.value)}
                >
                  <option value="" disabled>
                    {c.agent ? "Reassign..." : "Assign agent..."}
                  </option>
                  {agents.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.customer?.firstName} {a.customer?.lastName}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {complaints.length === 0 && !error && <p className="empty-state">No complaints found.</p>}
    </div>
  );
};

export default ComplaintsManager;
