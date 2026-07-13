import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingExtra, setLoadingExtra] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadExtras = async () => {
      setLoadingExtra(true);
      try {
        if (user.type === "admin") {
          const [{ data: complaints }, { data: users }, { data: agents }] = await Promise.all([
            api.get("/complaints"),
            api.get("/users"),
            api.get("/agents"),
          ]);
          setStats({
            totalComplaints: complaints.length,
            pending: complaints.filter((c) => c.status !== "resolved").length,
            resolved: complaints.filter((c) => c.status === "resolved").length,
            totalUsers: users.length,
            totalAgents: agents.length,
          });
        } else if (user.type === "agent") {
          const { data: complaints } = await api.get("/complaints");
          setStats({
            totalComplaints: complaints.length,
            pending: complaints.filter((c) => c.status !== "resolved").length,
            resolved: complaints.filter((c) => c.status === "resolved").length,
          });
        } else if (user.type === "user") {
          const { data: complaints } = await api.get("/complaints/mine");
          setMyComplaints(complaints);
          setStats({
            totalComplaints: complaints.length,
            pending: complaints.filter((c) => c.status !== "resolved").length,
            resolved: complaints.filter((c) => c.status === "resolved").length,
          });
        }
      } catch (err) {
        // Home page stats are a nice-to-have; fail silently if something's off
      } finally {
        setLoadingExtra(false);
      }
    };

    loadExtras();
  }, [user]);

  return (
    <div>
      <div className="home-wrapper">
        <div className="home-text">
          <h2>Welcome to Customer Care Registry</h2>
          <p>
            Click the "Raise Complaint" button to resolve your doubts or seek assistance from our
            support team.
          </p>

          {!user && (
            <div className="home-actions">
              <Link to="/login" className="btn-primary">
                Login
              </Link>
              <Link to="/register" className="btn-secondary">
                Sign Up
              </Link>
            </div>
          )}

          {user && user.type === "user" && (
            <div className="home-actions">
              <Link to="/complaint" className="btn-primary">
                Raise Complaint
              </Link>
              <Link to="/my-complaints" className="btn-secondary">
                My Complaints
              </Link>
              <Link to="/chat" className="btn-secondary">
                Chat with Agent
              </Link>
            </div>
          )}

          {user && user.type === "agent" && (
            <div className="home-actions">
              <Link to="/agent" className="btn-primary">
                Go to Dashboard
              </Link>
            </div>
          )}

          {user && user.type === "admin" && (
            <div className="home-actions">
              <Link to="/complaints" className="btn-primary">
                Manage Complaints
              </Link>
              <Link to="/users" className="btn-secondary">
                Manage Customers
              </Link>
              <Link to="/agents" className="btn-secondary">
                View Agents
              </Link>
            </div>
          )}
        </div>

        <div className="home-illustration" aria-hidden="true">
          <svg viewBox="0 0 200 200" width="220" height="220">
            <circle cx="100" cy="100" r="95" fill="#eaf2fd" />
            <circle cx="100" cy="80" r="30" fill="#1e6fd9" />
            <rect x="60" y="110" width="80" height="60" rx="14" fill="#1e6fd9" />
          </svg>
        </div>
      </div>

      {user && stats && !loadingExtra && (
        <div className="home-stats">
          <div className="stat-card">
            <span className="stat-card-value">{stats.totalComplaints}</span>
            <span className="stat-card-label">
              {user.type === "user" ? "My Complaints" : "Total Complaints"}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">{stats.pending}</span>
            <span className="stat-card-label">Pending</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-value">{stats.resolved}</span>
            <span className="stat-card-label">Resolved</span>
          </div>
          {user.type === "admin" && (
            <>
              <div className="stat-card">
                <span className="stat-card-value">{stats.totalUsers}</span>
                <span className="stat-card-label">Customers</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-value">{stats.totalAgents}</span>
                <span className="stat-card-label">Agents</span>
              </div>
            </>
          )}
        </div>
      )}

      {user && user.type === "user" && myComplaints.length > 0 && (
        <div className="home-recent">
          <h3>Your Recent Complaints</h3>
          <ul>
            {myComplaints.slice(0, 3).map((c) => (
              <li key={c._id}>
                <span>{c.details.slice(0, 60)}</span>
                <span className={`badge badge-${c.status}`}>{c.status}</span>
              </li>
            ))}
          </ul>
          <Link to="/my-complaints" className="see-all-link">
            See all complaints →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;