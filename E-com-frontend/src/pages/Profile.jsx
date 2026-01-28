import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then(res => setUser(res.data.user))
      .catch(() => navigate("/login"));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, maxWidth: "600px", margin: "auto", position: "relative" }}>

      {/* -------- DASHBOARD BUTTON (TOP-LEFT) -------- */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          padding: "8px 14px",
          background: "#ffffff",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "500",
          border: "1px solid #ddd",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
          userSelect: "none",
        }}
        onClick={() => navigate("/dashboard")}
      >
        ⬅ Dashboard
      </div>

      {/* -------- PAGE TITLE -------- */}
      <h2 style={{ textAlign: "center", marginTop: 60 }}>My Profile</h2>

      {/* -------- PROFILE BOX -------- */}
      <div
        style={{
          marginTop: 20,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 8,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
        <p><strong>Email:</strong> {user.email_id}</p>
        <p><strong>Phone:</strong> {user.phone_number}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
