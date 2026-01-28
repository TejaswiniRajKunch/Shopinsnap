import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";

export default function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    brand: "",
    product_name: "",
    prod_description: "",
    price: "",
    stock: "",
    image_url: "",
    cat_id: ""
  });

  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Load categories & product data
  useEffect(() => {
    api.get("/category/all").then((res) => setCategories(res.data));

    api
      .get(`/products/${productId}`)
      .then((res) => {
        const p = res.data;
        setForm({
          brand: p.brand || "",
          product_name: p.product_name || "",
          prod_description: p.prod_description || "",
          price: p.price || "",
          stock: p.stock || "",
          image_url: p.image_url || "",
          cat_id: p.cat_id || ""
        });
      })
      .catch((error) => {
        setErr(error.response?.data?.error || "Failed to load product");
      });
  }, [productId]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");

    try {
      await api.put(`/products/${productId}`, form);
      setMsg("Product updated successfully!");
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to update product");
    }
  };

  return (
    <div style={{ maxWidth: 550, margin: "30px auto" }}>
      <h2>Edit Product</h2>

      {msg && <p style={{ color: "green" }}>{msg}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <form onSubmit={submit}>

        {/* Category */}
        <select
          name="cat_id"
          value={form.cat_id}
          onChange={onChange}
          required
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
        />
        <br /><br />

        {/* Product Name */}
        <input
          name="product_name"
          placeholder="Product Name"
          value={form.product_name}
          onChange={onChange}
          required
        />
        <br /><br />

        {/* Product Description */}
        <textarea
          name="prod_description"
          placeholder="Product Description"
          value={form.prod_description}
          onChange={onChange}
          rows={4}
          style={{ width: "100%", padding: "8px" }}
        ></textarea>
        <br /><br />

        {/* Price */}
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={onChange}
          required
        />
        <br /><br />

        {/* Stock */}
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={onChange}
          required
        />
        <br /><br />

        {/* Image URL */}
        <input
          name="image_url"
          placeholder="Image URL"
          value={form.image_url}
          onChange={onChange}
        />
        <br /><br />

        <button type="submit">Save Changes</button>
      </form>

      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate("/view-products")}
      >
        Back to Products
      </button>
    </div>
  );
}
