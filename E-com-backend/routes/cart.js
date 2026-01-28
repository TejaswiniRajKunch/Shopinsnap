const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/* =====================================================
   ADD / UPDATE CART (UUID SAFE + INC / DEC SUPPORT)
===================================================== */
router.post("/add", authenticateToken, async (req, res) => {
  try {
    let { product_id, no_of_items } = req.body;

    /* ---------------- VALIDATIONS ---------------- */
    if (!product_id) {
      return res.status(400).json({ error: "Invalid product id" });
    }

    no_of_items = parseInt(no_of_items);
    if (isNaN(no_of_items)) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    /* ---------------- PRODUCT EXISTS ---------------- */
    const productCheck = await db.query(
      "SELECT product_id FROM products WHERE product_id = $1",
      [product_id]
    );

    if (productCheck.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    /* ---------------- CHECK EXISTING CART ITEM ---------------- */
    const existing = await db.query(
      `
      SELECT cart_id, no_of_items
      FROM cart
      WHERE user_id = $1 AND product_id = $2
      `,
      [req.user.user_id, product_id]
    );

    /* ---------------- UPDATE EXISTING ---------------- */
    if (existing.rows.length > 0) {
      const currentQty = existing.rows[0].no_of_items;
      const newQty = currentQty + no_of_items;

      /* 🔴 If quantity becomes 0 or less → remove item */
      if (newQty <= 0) {
        await db.query(
          "DELETE FROM cart WHERE cart_id = $1",
          [existing.rows[0].cart_id]
        );

        return res.json({ message: "Item removed from cart" });
      }

      /* 🟢 Update quantity */
      await db.query(
        `
        UPDATE cart
        SET no_of_items = $1
        WHERE cart_id = $2
        `,
        [newQty, existing.rows[0].cart_id]
      );

      return res.json({ message: "Cart updated successfully" });
    }

    /* ---------------- ADD NEW ITEM ---------------- */
    if (no_of_items <= 0) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const { rows } = await db.query(
      `
      INSERT INTO cart (user_id, product_id, no_of_items)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [req.user.user_id, product_id, no_of_items]
    );

    res.json({
      message: "Added to cart successfully",
      cart: rows[0],
    });

  } catch (err) {
    console.error("🔥 CART ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   GET USER CART
===================================================== */
router.get("/my-cart", authenticateToken, async (req, res) => {
  try {
    const { rows } = await db.query(
      `
      SELECT
        c.cart_id,
        c.product_id,
        c.no_of_items,
        p.product_name,
        p.price,
        p.image_url
      FROM cart c
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = $1
      ORDER BY c.created_at DESC
      `,
      [req.user.user_id]
    );

    res.json({ cart: rows });

  } catch (err) {
    console.error("🔥 GET CART ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =====================================================
   REMOVE ITEM
===================================================== */
router.delete("/remove/:cart_id", authenticateToken, async (req, res) => {
  try {
    const cart_id = Number(req.params.cart_id);

    if (isNaN(cart_id)) {
      return res.status(400).json({ error: "Invalid cart id" });
    }

    await db.query(
      "DELETE FROM cart WHERE cart_id = $1 AND user_id = $2",
      [cart_id, req.user.user_id]
    );

    res.json({ message: "Item removed from cart" });

  } catch (err) {
    console.error("🔥 REMOVE CART ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
