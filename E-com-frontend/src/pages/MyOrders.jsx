import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/orders/my-orders")
      .then(res => setOrders(res.data.orders))
      .catch(err =>
        setErr(err.response?.data?.error || "Failed to load orders")
      );
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "auto" }}>
      <h2>My Orders</h2>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {orders.length === 0 ? (
        <p>No orders placed yet 😔</p>
      ) : (
        orders.map(order => (
          <div
            key={order.order_id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 15,
              marginBottom: 20,
              background: "#fff"
            }}
          >
            <h3>Order #{order.order_id}</h3>
            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Total:</strong> ₹{order.total_amount}</p>

            <hr />

            {order.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: 15,
                  marginBottom: 10,
                  alignItems: "center"
                }}
              >
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  style={{ width: 80, height: 80, objectFit: "cover" }}
                />

                <div>
                  <h4>{item.product_name}</h4>
                  <p>₹{item.price} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ))
      )}

      <button
        style={{ marginTop: 20 }}
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
