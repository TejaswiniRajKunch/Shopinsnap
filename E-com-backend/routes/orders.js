const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/* =====================================================
   PLACE ORDER
===================================================== */
router.post("/place", authenticateToken, async (req, res) => {
  const { address } = req.body;
  const user_id = req.user.user_id; // UUID

  if (!address || !address.trim()) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    /* 1️⃣ Get cart items */
    const cartResult = await db.query(
      `
      SELECT c.product_id, c.no_of_items, p.price
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = $1
      `,
      [user_id]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    /* 2️⃣ Calculate total amount */
    let totalAmount = 0;
    cartResult.rows.forEach(item => {
      totalAmount += item.price * item.no_of_items;
    });

    /* 3️⃣ Create order */
    const orderResult = await db.query(
      `
      INSERT INTO orders (user_id, address, total_amount)
      VALUES ($1, $2, $3)
      RETURNING order_id
      `,
      [user_id, address, totalAmount]
    );

    const order_id = orderResult.rows[0].order_id;

    /* 4️⃣ Insert order items */
    for (const item of cartResult.rows) {
      await db.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [order_id, item.product_id, item.no_of_items, item.price]
      );
    }

    /* 5️⃣ Clear cart */
    await db.query(
      "DELETE FROM cart WHERE user_id = $1",
      [user_id]
    );

    res.json({
      message: "Order placed successfully",
      order_id
    });

  } catch (err) {
    console.error("🔥 PLACE ORDER ERROR:", err);
    res.status(500).json({ error: "Failed to place order" });
  }
});

/* =====================================================
   GET USER ORDERS (ORDER HISTORY)
===================================================== */
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        o.order_id,
        o.address,
        o.total_amount,
        o.created_at,
        json_agg(
          json_build_object(
            'product_name', p.product_name,
            'price', oi.price,
            'quantity', oi.quantity,
            'image_url', p.image_url
          )
        ) AS items
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = $1
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
      `,
      [req.user.user_id]
    );

    res.json({ orders: rows });

  } catch (err) {
    console.error("🔥 GET ORDERS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
