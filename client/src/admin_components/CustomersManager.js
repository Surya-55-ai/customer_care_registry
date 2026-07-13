import React, { useEffect, useState } from "react";
import api from "../api";
import LoaderSpinner from "../components/LoaderSpinner/LoaderSpinner";

const CustomersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  if (loading) return <LoaderSpinner label="Loading customers..." />;

  return (
    <div>
      {error && <p className="auth-error">{error}</p>}
      <table className="agents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Type</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.userName}</td>
              <td>{u.email}</td>
              <td style={{ textTransform: "capitalize" }}>{u.type}</td>
              <td>
                <button className="resolve-btn" onClick={() => handleDelete(u._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && !error && <p className="empty-state">No users found.</p>}
    </div>
  );
};

export default CustomersManager;

