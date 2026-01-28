import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [cat_name, setCatName] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/category/add", { cat_name });
      setMsg("Category added successfully!");
      setCatName("");
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to add category");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", position: "relative" }}>
      
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

      <h2 style={{ textAlign: "center", marginTop: 60 }}>Add Category</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {/* -------- FORM -------- */}
      <form onSubmit={submit} style={{ marginTop: 20 }}>
        <input
          placeholder="Category Name"
          value={cat_name}
          onChange={(e) => setCatName(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        />

        <br /><br />

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            background: "#007bff",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          Add Category
        </button>
      </form>
    </div>
  );
}
