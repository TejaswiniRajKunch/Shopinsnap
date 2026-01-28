import React, { useEffect, useState } from "react";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs"; 

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(error =>
        setErr(error.response?.data?.error || "Failed to load product")
      );
  }, [id]);

  const addToCart = async () => {
    if (qty < 1) {
      setErr("Quantity must be at least 1");
      return;
    }

    try {
      await api.post("/cart/add", {
        product_id: product.product_id,
        no_of_items: qty
      });

      navigate("/cart");
    } catch (error) {
      setErr(error.response?.data?.error || "Failed to add to cart");
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>

      {/* ✅ BREADCRUMBS */}
      <Breadcrumbs />

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: 15,
          padding: "6px 14px",
          borderRadius: 6,
          border: "1px solid #999",
          cursor: "pointer"
        }}
      >
        ⬅ Dashboard
      </button>

      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ display: "flex", gap: 30, marginTop: 20 }}>
        <img
          src={product.image_url || "https://via.placeholder.com/350"}
          alt={product.product_name}
          style={{
            width: 350,
            height: 350,
            objectFit: "cover",
            borderRadius: 10
          }}
        />

        <div>
          <h2>{product.product_name}</h2>
          <h3>{product.brand}</h3>
          <p>{product.prod_description}</p>
          <h2>₹ {product.price}</h2>

          <label>Quantity:</label><br />
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            style={{
              width: 80,
              padding: 8,
              marginTop: 5
            }}
          />

          <br />
          <button
            onClick={addToCart}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "green",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
