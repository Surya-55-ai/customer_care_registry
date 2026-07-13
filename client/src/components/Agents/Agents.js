import React, { useEffect, useState } from "react";
import api from "../../api";
import LoaderSpinner from "../LoaderSpinner/LoaderSpinner";
import "./Agents.css";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await api.get("/agents");
        setAgents(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) return <LoaderSpinner label="Loading agents..." />;

  return (
    <div className="agents-page">
      <h2>Agents</h2>
      {error && <p className="auth-error">{error}</p>}

      <table className="agents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Solved</th>
            <th>Pending</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((a) => (
            <tr key={a._id}>
              <td>
                {a.customer?.firstName} {a.customer?.lastName}
              </td>
              <td>{a.customer?.userName}</td>
              <td>{a.customer?.email}</td>
              <td>{a.totalSolved}</td>
              <td>{a.totalPending}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {agents.length === 0 && !error && (
        <p className="empty-state">No agents registered yet.</p>
      )}
    </div>
  );
};

export default Agents;

