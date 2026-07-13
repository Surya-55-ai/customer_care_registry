import React, { useEffect, useState } from "react";
import api from "../api";
import LoaderSpinner from "../components/LoaderSpinner/LoaderSpinner";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post("/categories", { name: name.trim() });
      setName("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete category.");
    }
  };

  if (loading) return <LoaderSpinner label="Loading categories..." />;

  return (
    <div>
      {error && <p className="auth-error">{error}</p>}

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input
          placeholder="New category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px 10px", borderRadius: 6, border: "1px solid #d3d9e0", flex: 1 }}
        />
        <button type="submit" className="btn-primary">
          Add
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {categories.map((c) => (
          <li
            key={c._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              border: "1px solid #e2e5ea",
              borderRadius: 6,
              padding: "8px 12px",
            }}
          >
            {c.name}
            <button className="resolve-btn" onClick={() => handleDelete(c._id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      {categories.length === 0 && !error && <p className="empty-state">No categories yet.</p>}
    </div>
  );
};

export default CategoriesManager;

