import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "../components/BreadCrumbs"; 

export default function Checkout() {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!address.trim()) {
      setErr("Address is required");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      await api.post("/orders/place", { address });

      // ✅ Redirect to success page
      navigate("/order-success");

    } catch (error) {
      setErr(error.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      {/* ✅ BREADCRUMBS */}
      <Breadcrumbs />

      <div
        style={{
          padding: 20,
          maxWidth: 600,
          margin: "40px auto",
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Delivery Address</h2>

        {err && (
          <p style={{ color: "red", textAlign: "center" }}>
            {err}
          </p>
        )}

        <textarea
          rows="5"
          placeholder="Enter full delivery address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            fontSize: 16,
            marginTop: 15,
            borderRadius: 6,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={placeOrder}
          disabled={loading}
          style={{
            marginTop: 20,
            width: "100%",
            padding: 12,
            background: loading ? "#999" : "green",
            color: "white",
            borderRadius: 6,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 16
          }}
        >
          {loading ? "Placing Order..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
