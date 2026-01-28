import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const loadCategories = () => {
    setErr("");
    api
      .get("/category/manage")
      .then((res) => setCategories(res.data))
      .catch((error) =>
        setErr(error.response?.data?.error || "Failed to load categories")
      );
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const renameCategory = async (cat) => {
    const newName = window.prompt("Enter new category name", cat.cat_name);
    if (!newName || newName.trim() === "") return;

    try {
      await api.put(`/category/${cat.cat_id}`, { cat_name: newName.trim() });
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update category");
    }
  };

  const deleteCategory = async (cat) => {
    if (!window.confirm(`Soft delete "${cat.cat_name}"?`)) return;

    try {
      await api.delete(`/category/${cat.cat_id}`);
      loadCategories();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to delete category");
    }
  };

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "30px auto",
        position: "relative",
        padding: 20,
      }}
    >
      {/* Dashboard Button */}
      <div
        style={{
          position: "absolute",
          top: 15,
          left: 15,
          padding: "8px 14px",
          background: "#ffffff",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 500,
          border: "1px solid #ddd",
          boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
          userSelect: "none",
        }}
        onClick={() => navigate("/dashboard")}
      >
        ⬅ Dashboard
      </div>

      <h2 style={{ textAlign: "center", marginTop: 60 }}>Manage Categories</h2>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ marginTop: 20 }}>
        <button
          onClick={loadCategories}
          style={{ padding: "8px 12px", borderRadius: 6, cursor: "pointer" }}
        >
          Refresh
        </button>

        <button
          style={{
            marginLeft: 10,
            padding: "8px 12px",
            background: "#007bff",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => navigate("/add-category")}
        >
          Add Category
        </button>
      </div>

      <table
        style={{
          width: "100%",
          marginTop: 20,
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>ID</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Name</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
              Deleted?
            </th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {categories.map((c) => (
            <tr key={c.cat_id}>
              <td style={{ padding: 8 }}>{c.cat_id}</td>
              <td style={{ padding: 8 }}>{c.cat_name}</td>
              <td style={{ padding: 8 }}>{c.is_deleted ? "Yes" : "No"}</td>
              <td style={{ padding: 8 }}>
                {!c.is_deleted && (
                  <>
                    <button
                      onClick={() => renameCategory(c)}
                      style={{
                        padding: "5px 10px",
                        marginRight: 8,
                        borderRadius: 5,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteCategory(c)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 5,
                        cursor: "pointer",
                        background: "red",
                        color: "white",
                        border: "none",
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td
                colSpan="4"
                style={{ textAlign: "center", padding: 20 }}
              >
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
