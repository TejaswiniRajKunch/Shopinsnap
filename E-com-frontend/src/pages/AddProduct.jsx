import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    brand: "",
    product_name: "",
    prod_description: "",
    price: "",
    stock: "",
    image_url: "",
    cat_id: ""
  });

  // Load categories
  useEffect(() => {
    api.get("/category/all").then((res) => setCategories(res.data));
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submitProduct = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.post("/products/add", form);
      setMsg("Product Added Successfully!");
      setForm({
        brand: "",
        product_name: "",
        prod_description: "",
        price: "",
        stock: "",
        image_url: "",
        cat_id: ""
      });
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to add product");
    }
  };

  return (
    <div style={{ position: "relative", padding: 20, maxWidth: 600, margin: "0 auto" }}>

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

      <h2 style={{ textAlign: "center", marginTop: 60 }}>Add Product</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      {/* -------- FORM -------- */}
      <form onSubmit={submitProduct} style={{ marginTop: 20 }}>

        {/* Category Dropdown */}
        <select
          name="cat_id"
          value={form.cat_id}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.cat_id} value={c.cat_id}>
              {c.cat_name}
            </option>
          ))}
        </select>
        <br /><br />

        {/* Brand */}
        <input
          name="brand"
          placeholder="Brand"
          value={form.brand}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        /><br /><br />

        {/* Product Name */}
        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        /><br /><br />

        {/* Product Description */}
        <input
          name="prod_description"
          placeholder="Product Description"
          value={form.prod_description}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        /><br /><br />

        {/* Price */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        /><br /><br />

        {/* Stock */}
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={onChange}
          required
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        /><br /><br />

        {/* Image URL */}
        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={onChange}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 6,
            border: "1px solid #ccc",
            fontSize: 16,
          }}
        /><br /><br />

        <button
          type="submit"
          style={{
            padding: "10px 15px",
            background: "#28a745",
            color: "#fff",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            width: "100%",
            fontSize: "16px",
          }}
        >
          Add Product
        </button>
      </form>

    </div>
  );
}
