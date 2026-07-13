import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Registration from "./components/Registration";
import Complaint from "./components/Complaint/Complaint";
import MyComplaints from "./components/MyComplaints/MyComplaints";
import ChatPage from "./components/Chat/ChatPage";
import Agent from "./components/Agent/Agent";
import Agents from "./components/Agents/Agents";
import Admin from "./components/Admin/Admin";
import About from "./components/About/About";
import History from "./components/History/History";
import User from "./components/User/User";
import NotFound from "./components/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/about" element={<About />} />

          <Route
            path="/complaint"
            element={
              <ProtectedRoute allowedTypes={["user"]}>
                <Complaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-complaints"
            element={
              <ProtectedRoute allowedTypes={["user"]}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute allowedTypes={["user"]}>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedTypes={["user"]}>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent"
            element={
              <ProtectedRoute allowedTypes={["agent"]}>
                <Agent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute allowedTypes={["admin"]}>
                <Agents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
