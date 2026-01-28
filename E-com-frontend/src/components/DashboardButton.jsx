import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardButton() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: "#ffffff",
        borderRadius: 6,
        padding: "6px 12px",
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
  );
}
    