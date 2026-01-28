import { useNavigate } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)"
      }}
    >
      <h1 style={{ color: "green", fontSize: 32 }}>
        🎉 Order Placed Successfully!
      </h1>

      <p style={{ marginTop: 10, fontSize: 18 }}>
        Thank you for shopping with us 😊
      </p>

      <button
        style={{
          marginTop: 30,
          padding: "12px 35px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 16
        }}
        onClick={() => navigate("/dashboard")}
      >
        Shop More 🛍️
      </button>
    </div>
  );
}
