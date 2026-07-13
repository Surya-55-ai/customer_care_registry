import React, { useEffect, useState } from "react";
import api from "../api";

const AgentNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get("/notifications/agent");
        setNotifications(data);
      } catch (err) {
        // silently ignore - notifications are non-critical
      }
    };
    fetchNotifications();
  }, []);

  if (notifications.length === 0) return null;

  return (
    <ul style={{ listStyle: "none", padding: 0, marginBottom: 16 }}>
      {notifications.map((n) => (
        <li
          key={n._id}
          style={{
            background: n.isRead ? "#f4f6f9" : "#eaf2fd",
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 6,
            fontSize: "0.8rem",
          }}
        >
          {n.message}
        </li>
      ))}
    </ul>
  );
};

export default AgentNotifications;
