const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

/* ---------- HEALTH CHECK ---------- */
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

/* ---------- SERVER ---------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
