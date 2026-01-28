import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs"; 

export default function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [err, setErr] = useState("");

  const loadCart = () => {
    api.get("/cart/my-cart")
      .then(res => setCart(res.data.cart))
      .catch(error =>
        setErr(error.response?.data?.error || "Failed to load cart")
      );
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (product_id, amount) => {
    try {
      await api.post("/cart/add", {
        product_id,
        no_of_items: amount
      });
      loadCart();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update quantity");
    }
  };

  const removeItem = async (cart_id) => {
    try {
      await api.delete(`/cart/remove/${cart_id}`);
      loadCart();
    } catch (error) {
      alert(error.response?.data?.error || "Failed to remove item");
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.no_of_items,
    0
  );

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "auto" }}>

      {/* ✅ BREADCRUMBS */}
      <Breadcrumbs />

      {/* 🔙 BACK ARROW */}
      <div style={{ marginBottom: 15 }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            fontSize: 16,
            padding: "4px 10px",
            borderRadius: 5,
            border: "1px solid #999",
            cursor: "pointer",
            background: "#9f8cff"
          }}
        >
          ←
        </button>
      </div>

      <h2 style={{ textAlign: "center", letterSpacing: 2 }}>MY CART</h2>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {cart.length === 0 ? (
        <h3 style={{ textAlign: "center" }}>Your cart is empty 😔</h3>
      ) : (
        <>
          {cart.map(item => {
            const itemTotal = item.price * item.no_of_items;

            return (
              <div
                key={item.cart_id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 180px",
                  gap: 20,
                  padding: 18,
                  marginBottom: 20,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.35)"
                }}
              >
                {/* IMAGE */}
                <img
                  src={item.image_url || "https://via.placeholder.com/120"}
                  alt="product"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 8
                  }}
                />

                {/* DETAILS */}
                <div>
                  <h3>{item.product_name}</h3>
                  <p>₹{item.price}</p>

                  {/* QUANTITY CONTROLS */}
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <button
                      onClick={() => updateQty(item.product_id, -1)}
                      disabled={item.no_of_items <= 1}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: "#9f8cff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 18,
                        color: "white",
                        opacity: item.no_of_items <= 1 ? 0.5 : 1
                      }}
                    >
                      −
                    </button>

                    <span
                      style={{
                        fontSize: 20,
                        minWidth: 20,
                        textAlign: "center"
                      }}
                    >
                      {item.no_of_items}
                    </span>

                    <button
                      onClick={() => updateQty(item.product_id, +1)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: "#9f8cff",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 18,
                        color: "white"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* PRICE SUMMARY */}
                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() => removeItem(item.cart_id)}
                    style={{
                      background: "red",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                      fontSize: 14
                    }}
                  >
                    Remove
                  </button>

                  <p style={{ marginTop: 16 }}>
                    ₹{item.price} × {item.no_of_items}
                  </p>

                  <h4>₹{itemTotal}</h4>
                </div>
              </div>
            );
          })}

          {/* GRAND TOTAL */}
          <div style={{ textAlign: "right", marginTop: 30 }}>
            <h2>Grand Total</h2>
            <h2>₹{total}</h2>
          </div>

          {/* PLACE ORDER */}
          <button
            style={{
              marginTop: 30,
              width: "100%",
              padding: "12px",
              background: "green",
              color: "white",
              fontSize: 15,
              borderRadius: 8,
              cursor: "pointer",
              border: "none"
            }}
            onClick={() => navigate("/checkout")}
          >
            Place Order
          </button>

          {/* BACK */}
          <button
            style={{
              marginTop: 12,
              width: "100%",
              padding: "12px",
              background: "#9f8cff",
              color: "white",
              fontSize: 15,
              borderRadius: 8,
              cursor: "pointer",
              border: "none"
            }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Homepage
          </button>
        </>
      )}
    </div>
  );
}
