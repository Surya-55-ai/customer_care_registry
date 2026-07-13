import React, { useState } from "react";
import ComplaintsManager from "../../admin_components/ComplaintsManager";
import CustomersManager from "../../admin_components/CustomersManager";
import CategoriesManager from "../../admin_components/CategoriesManager";
import "./Admin.css";

const TABS = [
  { key: "complaints", label: "Complaints" },
  { key: "customers", label: "Customers" },
  { key: "categories", label: "Categories" },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("complaints");

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={activeTab === t.key ? "active" : ""}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="admin-tab-content">
        {activeTab === "complaints" && <ComplaintsManager />}
        {activeTab === "customers" && <CustomersManager />}
        {activeTab === "categories" && <CategoriesManager />}
      </div>
    </div>
  );
};

export default Admin;

