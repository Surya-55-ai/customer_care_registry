import React from "react";

const About = () => {
  return (
    <div style={{ padding: "40px", maxWidth: 700, margin: "0 auto", lineHeight: 1.6 }}>
      <h2 style={{ marginBottom: 12, color: "#1c2733" }}>About Customer Care Registry</h2>
      <p style={{ color: "#5b6675" }}>
        Customer Care Registry is a complaint management platform that connects customers with
        support agents. Customers can raise complaints, track their status, and chat directly
        with an assigned agent. Agents can view assigned complaints and resolve them, while
        admins oversee users, agents, categories, and all complaints from a central dashboard.
      </p>
    </div>
  );
};

export default About;
